import { NextResponse } from "next/server";
import dns from "node:dns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, proposals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { canGenerate, type Plan } from "@/lib/subscription";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeFormData, validateFormData } from "@/lib/sanitize";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Fix for Node.js fetch failing with Google APIs on Windows due to IPv6 issues
dns.setDefaultResultOrder('ipv4first');

// Rate limit: max 3 generate requests per user per minute
const RATE_LIMIT_CONFIG = { maxRequests: 3, windowMs: 60_000 };

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Rate limiting — prevent API spam
    const rateLimitResult = rateLimit(
      `generate:${session.user.id}`,
      RATE_LIMIT_CONFIG
    );

    if (!rateLimitResult.allowed) {
      const retryAfterSeconds = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan. Coba lagi dalam ${retryAfterSeconds} detik.`,
          retryAfter: retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    // 3. Get user from database
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    // 4. Monthly generation counter reset
    const userPlan = (dbUser.plan || "FREE") as Plan;
    let currentCount = dbUser.generationCount || 0;

    // Check if we need to reset the monthly counter
    const now = new Date();
    const lastReset = dbUser.lastResetAt ? new Date(dbUser.lastResetAt) : null;
    const needsMonthlyReset =
      !lastReset ||
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getFullYear() !== now.getFullYear();

    if (needsMonthlyReset) {
      // Reset counter for the new month
      currentCount = 0;
      try {
        await db
          .update(users)
          .set({ generationCount: 0, lastResetAt: now })
          .where(eq(users.id, session.user.id));
      } catch (resetError) {
        console.error("Monthly reset error (non-fatal):", resetError);
      }
    }

    // 5. Check usage limits
    if (!canGenerate(userPlan, currentCount)) {
      return NextResponse.json(
        {
          error: "Limit generate tercapai. Upgrade plan untuk melanjutkan.",
          plan: userPlan,
          generationCount: currentCount,
          needsUpgrade: true,
        },
        { status: 403 }
      );
    }

    // 5. Parse, sanitize, and validate input
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body tidak valid." },
        { status: 400 }
      );
    }

    const formData = sanitizeFormData(body);
    const validation = validateFormData(formData);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 6. Build the prompt with sanitized data
    const lengthGuide =
      formData.length === "ringkas"
        ? "1-2 halaman, ringkas dan padat"
        : formData.length === "standar"
        ? "3-5 halaman, detail standar"
        : "10+ halaman, sangat detail dan mendalam";

    const prompt = `Kamu adalah seorang penulis proposal profesional berpengalaman. Buatkan sebuah proposal ${formData.type} yang lengkap dan profesional dengan detail berikut:

**Judul Proposal:** ${formData.judul}
**Organisasi/Perusahaan:** ${formData.org || "Tidak disebutkan"}
**Ditujukan Kepada:** ${formData.kepada || "Tidak disebutkan"}
**Deskripsi/Tujuan:** ${formData.desc}
**Tone/Gaya Penulisan:** ${formData.tone}
**Panjang Dokumen:** ${lengthGuide}
**Bahasa:** ${formData.lang}
**Data Tambahan (Budget/Timeline/dll):** ${formData.extra || "Tidak ada data tambahan"}

**Instruksi Format (SANGAT PENTING):**
- Output HARUS dalam format HTML murni.
- PENTING: Gunakan HANYA tag <h2> untuk SEMUA judul bagian utama (Executive Summary, Latar Belakang, Tujuan, dll). Hal ini krusial untuk fitur page-break otomatis di PDF/Word.
- DILARANG menggunakan tag <h1>. Gunakan <h2> untuk bagian utama, dan <h3> untuk sub-bagian.
- Gunakan tag <p> untuk paragraf, <ul>/<li> untuk daftar.
- Sertakan section utama berikut menggunakan <h2>: 1. Executive Summary, 2. Latar Belakang, 3. Tujuan, 4. Metodologi/Strategi, 5. Timeline/Jadwal, 6. Anggaran (jika relevan), 7. Penutup
- Buat konten yang substantif, panjang, mendetail, dan bukan sekadar placeholder.
- Jangan sertakan tag <html>, <head>, atau <body> — hanya konten proposal saja.
- Pastikan hasilnya terlihat profesional dan siap cetak.
- Tanggal proposal: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}`;

    // 7. Call Gemini API with proper error handling
    let generatedContent: string = "";
    
    // Check if Gemini API Key is configured, if not, provide a mock response for testing.
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Returning a mock proposal for testing.");
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      generatedContent = `<h1>Proposal ${formData.type} (Mock Mode)</h1>
<p><strong>Perhatian:</strong> GEMINI_API_KEY belum dikonfigurasi di file .env Anda. Ini adalah contoh hasil (mock) agar Anda dapat mencoba alur aplikasi.</p>
<h2>1. Executive Summary</h2>
<p>Ini adalah ringkasan eksekutif untuk <strong>${formData.judul}</strong> yang ditujukan kepada <strong>${formData.kepada || "Klien"}</strong>.</p>
<h2>2. Latar Belakang</h2>
<p>${formData.desc}</p>
<h2>3. Penutup</h2>
<p>Demikian proposal ini dibuat dengan pendekatan yang ${formData.tone}. Terima kasih.</p>`;
    } else {
      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        try {
          // Gunakan model Flash terbaru (2.5) untuk attempt 1 dan 2, lalu fallback ke Pro jika terus gagal
          const modelName = attempt === 2 ? "gemini-2.5-pro" : "gemini-2.5-flash";
          const model = genAI.getGenerativeModel({ model: modelName });
          
          const result = await model.generateContent(prompt);
          generatedContent = result.response.text();

          if (!generatedContent) {
            throw new Error("AI tidak menghasilkan konten.");
          }
          
          // Jika sukses, keluar dari loop
          break;
        } catch (aiError: unknown) {
          const msg = aiError instanceof Error ? aiError.message : "Unknown AI error";
          
          // Cek apakah error ini layak untuk di-retry
          const shouldRetry = msg.includes("503") || msg.includes("high demand") || 
                              msg.includes("429") || msg.includes("quota") || msg.includes("Rate limit") ||
                              msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("Error fetching") ||
                              msg.includes("timeout") || msg.includes("ETIMEDOUT");
                              
          if (shouldRetry && attempt < maxRetries - 1) {
            attempt++;
            console.warn(`[Retry] Gemini API attempt ${attempt + 1}/${maxRetries}`);
            // Exponential backoff: 1.5 detik, 3 detik
            await new Promise(resolve => setTimeout(resolve, attempt * 1500));
            continue;
          }
          
          // Jika sudah melebihi batas retry atau error tidak bisa di-retry
          console.error("Gemini API error setelah retries:", aiError);
          
          if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("Error fetching")) {
            return NextResponse.json({ error: "Gagal terhubung ke server AI Google. Pastikan koneksi internet Anda stabil dan tidak ada pemblokiran jaringan, lalu coba lagi." }, { status: 503 });
          }
          if (msg.includes("429") || msg.includes("quota") || msg.includes("Rate limit")) {
            return NextResponse.json({ error: "Kapasitas AI sedang penuh. Sistem telah mencoba ulang secara otomatis namun tetap gagal. Mohon tunggu 1 menit lagi." }, { status: 503 });
          }
          if (msg.includes("503") || msg.includes("high demand")) {
            return NextResponse.json({ error: "Server AI Google sedang penuh/sibuk. Sistem telah mencoba ulang otomatis 3 kali namun gagal. Silakan coba lagi nanti." }, { status: 503 });
          }
          if (msg.includes("403") || msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
            return NextResponse.json({ error: "Konfigurasi API key tidak valid. Hubungi admin." }, { status: 500 });
          }
          if (msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
            return NextResponse.json({ error: "AI membutuhkan waktu terlalu lama merespons. Coba buat dokumen yang lebih ringkas." }, { status: 504 });
          }
          
          return NextResponse.json(
            { error: `Terjadi kesalahan AI: ${msg.substring(0, 100)}... Silakan coba lagi.` },
            { status: 500 }
          );
        }
      }
    }

    // 8. Increment generation count and save to history
    try {
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ generationCount: currentCount + 1 })
          .where(eq(users.id, session.user.id));

        await tx.insert(proposals).values({
          userId: session.user.id,
          title: formData.judul || "Untitled Proposal",
          type: formData.type,
          content: generatedContent,
        });
      });
    } catch (dbError) {
      // Log but don't fail the request — user already has the content
      console.error("DB save error (non-fatal):", dbError);
    }

    // 9. Return the result
    return NextResponse.json({
      content: generatedContent,
      plan: userPlan,
      generationCount: currentCount + 1,
    });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
