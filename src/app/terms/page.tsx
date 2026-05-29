"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function TermsOfServicePage() {
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
              background: "var(--primary)",
              borderRadius: "12px",
            }}
          >
            <Shield size={24} color="white" strokeWidth={2.5} />
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
              Terms of Service
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
          <h2>1. Penerimaan Persyaratan</h2>
          <p>
            Dengan mengakses dan menggunakan layanan PROPOSAL.AI (&quot;Layanan&quot;), Anda
            menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak
            setuju dengan salah satu persyaratan ini, harap jangan menggunakan
            Layanan kami.
          </p>

          <h2>2. Deskripsi Layanan</h2>
          <p>
            PROPOSAL.AI adalah platform berbasis kecerdasan buatan (AI) yang membantu
            pengguna membuat proposal bisnis, proyek, penelitian, kerjasama,
            sponsorship, dan acara secara otomatis. Layanan ini mencakup:
          </p>
          <ul>
            <li>Pembuatan proposal menggunakan AI (Google Gemini)</li>
            <li>Penyuntingan dan format dokumen</li>
            <li>Ekspor ke format PDF dan Word</li>
            <li>Penyimpanan riwayat proposal</li>
          </ul>

          <h2>3. Akun Pengguna</h2>
          <p>
            Untuk menggunakan Layanan, Anda harus membuat akun melalui Google OAuth
            atau Email Magic Link. Anda bertanggung jawab untuk:
          </p>
          <ul>
            <li>Menjaga kerahasiaan akun Anda</li>
            <li>Semua aktivitas yang terjadi melalui akun Anda</li>
            <li>Memberikan informasi yang akurat dan terkini</li>
          </ul>

          <h2>4. Paket Layanan & Pembayaran</h2>
          <p>
            PROPOSAL.AI menawarkan tiga paket layanan: FREE, PRO, dan ULTRA. Dengan
            menggunakan paket berbayar, Anda setuju untuk membayar sesuai harga yang
            tertera pada halaman pricing. Pembayaran bersifat non-refundable kecuali
            dinyatakan lain.
          </p>

          <h2>5. Penggunaan yang Dilarang</h2>
          <p>Anda dilarang menggunakan Layanan untuk:</p>
          <ul>
            <li>Membuat konten yang melanggar hukum, menyesatkan, atau berbahaya</li>
            <li>Menyalahgunakan API atau mencoba mengakses sistem secara tidak sah</li>
            <li>Mendistribusikan malware atau konten berbahaya</li>
            <li>Melanggar hak kekayaan intelektual pihak ketiga</li>
            <li>Melakukan spam atau penyalahgunaan sistem generate</li>
          </ul>

          <h2>6. Hak Kekayaan Intelektual</h2>
          <p>
            Konten proposal yang dihasilkan oleh AI menjadi milik Anda sebagai
            pengguna. Namun, platform PROPOSAL.AI, termasuk desain, kode, dan merek
            dagang, tetap menjadi milik kami. Anda diberikan lisensi terbatas untuk
            menggunakan Layanan sesuai ketentuan ini.
          </p>

          <h2>7. Batasan Tanggung Jawab</h2>
          <p>
            PROPOSAL.AI disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apapun. Kami
            tidak bertanggung jawab atas:
          </p>
          <ul>
            <li>Ketidakakuratan konten yang dihasilkan AI</li>
            <li>Kerugian yang timbul dari penggunaan konten yang dihasilkan</li>
            <li>Gangguan layanan atau kehilangan data</li>
            <li>Keputusan bisnis berdasarkan proposal yang dihasilkan</li>
          </ul>

          <h2>8. Perubahan Persyaratan</h2>
          <p>
            Kami berhak mengubah persyaratan ini kapan saja. Perubahan akan
            diumumkan melalui email atau notifikasi di platform. Penggunaan
            berkelanjutan setelah perubahan berarti Anda menyetujui persyaratan baru.
          </p>

          <h2>9. Penghentian</h2>
          <p>
            Kami berhak menangguhkan atau menghentikan akun Anda jika Anda
            melanggar persyaratan ini. Anda juga dapat menghapus akun Anda kapan
            saja melalui pengaturan akun.
          </p>

          <h2>10. Hukum yang Berlaku</h2>
          <p>
            Persyaratan ini diatur oleh dan ditafsirkan sesuai dengan hukum
            Republik Indonesia. Setiap sengketa akan diselesaikan melalui
            musyawarah mufakat, dan jika tidak tercapai, melalui pengadilan yang
            berwenang di Indonesia.
          </p>

          <h2>11. Kontak</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang persyaratan ini, silakan hubungi
            kami melalui email di{" "}
            <strong style={{ color: "var(--primary)" }}>
              support@proposal.ai
            </strong>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
