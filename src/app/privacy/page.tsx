"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* Nav */}
      <div
        className="flex items-center justify-between pricing-nav"
        style={{ borderColor: "var(--primary)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{
            textDecoration: "none",
            color: "var(--primary)",
            fontFamily: "var(--font-main)",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          <ArrowLeft size={16} strokeWidth={3} />
          KEMBALI
        </Link>
        <span
          style={{
            fontFamily: "var(--font-main)",
            fontWeight: 900,
            fontSize: "1.25rem",
            color: "var(--primary)",
          }}
        >
          PROPOSAL.AI
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "3rem 2rem 6rem",
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: "2rem" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              background: "var(--secondary)",
              borderRadius: "12px",
            }}
          >
            <Lock size={24} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <span
              className="subheading-material"
              style={{ fontSize: "0.7rem" }}
            >
              LEGAL
            </span>
            <h1
              className="heading-material"
              style={{ fontSize: "2rem", marginBottom: 0 }}
            >
              Privacy Policy
            </h1>
          </div>
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "3rem",
          }}
        >
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose-material">
          <h2>1. Pendahuluan</h2>
          <p>
            Kebijakan privasi ini menjelaskan bagaimana PROPOSAL.AI (&quot;kami&quot;)
            mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat
            menggunakan layanan kami. Kami berkomitmen untuk melindungi privasi
            Anda sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU No.
            27 Tahun 2022).
          </p>

          <h2>2. Data yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan data berikut:</p>

          <h3>a. Data Akun</h3>
          <ul>
            <li>Nama lengkap</li>
            <li>Alamat email</li>
            <li>Foto profil (dari Google OAuth, jika digunakan)</li>
            <li>Paket langganan</li>
          </ul>

          <h3>b. Data Penggunaan</h3>
          <ul>
            <li>Jumlah proposal yang dibuat</li>
            <li>Tipe proposal yang dipilih</li>
            <li>Riwayat proposal yang disimpan</li>
            <li>Waktu dan tanggal akses</li>
          </ul>

          <h3>c. Data Teknis</h3>
          <ul>
            <li>Alamat IP</li>
            <li>Jenis browser dan perangkat</li>
            <li>Cookie sesi (untuk autentikasi)</li>
          </ul>

          <h2>3. Bagaimana Kami Menggunakan Data</h2>
          <p>Data Anda digunakan untuk:</p>
          <ul>
            <li>Menyediakan dan meningkatkan layanan</li>
            <li>Autentikasi dan keamanan akun</li>
            <li>Memproses pembayaran dan mengelola langganan</li>
            <li>Mengirim notifikasi terkait layanan</li>
            <li>Analitik penggunaan untuk peningkatan produk</li>
          </ul>

          <h2>4. Penggunaan AI & Pemrosesan Data</h2>
          <p>
            Ketika Anda membuat proposal, data formulir Anda (judul, deskripsi,
            organisasi, dll.) dikirimkan ke Google Gemini API untuk diproses oleh
            AI. Kami <strong>tidak</strong> menyimpan data di server AI pihak
            ketiga setelah pemrosesan selesai. Hasil proposal disimpan di database
            kami atas nama Anda.
          </p>

          <h2>5. Penyimpanan & Keamanan Data</h2>
          <p>
            Data Anda disimpan di server Supabase (PostgreSQL) yang dilindungi
            dengan enkripsi. Kami menerapkan langkah-langkah keamanan berikut:
          </p>
          <ul>
            <li>Enkripsi data saat transit (HTTPS/TLS)</li>
            <li>Autentikasi berbasis sesi yang aman</li>
            <li>Pembatasan akses API (rate limiting)</li>
            <li>Sanitasi input untuk mencegah injeksi</li>
            <li>Security headers (HSTS, X-Frame-Options, dll.)</li>
          </ul>

          <h2>6. Berbagi Data dengan Pihak Ketiga</h2>
          <p>
            Kami <strong>tidak</strong> menjual data pribadi Anda. Data Anda hanya
            dibagikan dengan:
          </p>
          <ul>
            <li>
              <strong>Google</strong> — untuk autentikasi OAuth dan AI processing
              (Gemini API)
            </li>
            <li>
              <strong>Supabase</strong> — untuk penyimpanan database
            </li>
            <li>
              <strong>Vercel</strong> — untuk hosting dan analytics
            </li>
            <li>
              <strong>Payment provider</strong> — untuk pemrosesan pembayaran
              (jika menggunakan paket berbayar)
            </li>
          </ul>

          <h2>7. Hak Anda</h2>
          <p>
            Sesuai dengan UU Perlindungan Data Pribadi Indonesia, Anda memiliki
            hak untuk:
          </p>
          <ul>
            <li>
              <strong>Akses</strong> — Melihat data pribadi yang kami simpan
            </li>
            <li>
              <strong>Koreksi</strong> — Meminta perbaikan data yang tidak akurat
            </li>
            <li>
              <strong>Penghapusan</strong> — Meminta penghapusan akun dan semua
              data terkait
            </li>
            <li>
              <strong>Portabilitas</strong> — Mengunduh data Anda dalam format
              yang dapat dibaca
            </li>
            <li>
              <strong>Keberatan</strong> — Menolak pemrosesan data untuk tujuan
              tertentu
            </li>
          </ul>

          <h2>8. Cookie</h2>
          <p>
            Kami menggunakan cookie yang diperlukan untuk fungsi autentikasi sesi.
            Kami tidak menggunakan cookie pelacakan iklan pihak ketiga. Vercel
            Analytics menggunakan data anonim tanpa cookie.
          </p>

          <h2>9. Retensi Data</h2>
          <p>
            Data akun Anda disimpan selama akun Anda aktif. Riwayat proposal
            disimpan tanpa batas waktu kecuali Anda menghapusnya. Jika Anda
            menghapus akun, semua data terkait akan dihapus secara permanen dalam
            30 hari.
          </p>

          <h2>10. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan material
            akan diberitahukan melalui email atau notifikasi di platform. Tanggal
            &quot;terakhir diperbarui&quot; di bagian atas halaman ini akan selalu
            mencerminkan revisi terbaru.
          </p>

          <h2>11. Kontak</h2>
          <p>
            Untuk pertanyaan atau permintaan terkait privasi, hubungi kami di:{" "}
            <strong style={{ color: "var(--primary)" }}>
              privacy@proposal.ai
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
