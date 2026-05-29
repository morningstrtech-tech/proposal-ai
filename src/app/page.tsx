"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Zap,
  Shield,
  Download,
  Clock,
  ChevronRight,
  ArrowRight,
  Star,
  Briefcase,
  FlaskConical,
  Handshake,
  Award,
  CalendarDays,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles size={24} />,
    title: "AI-Powered Generation",
    desc: "Didukung Google Gemini — cukup isi formulir, AI menulis proposal profesional untuk Anda.",
  },
  {
    icon: <FileText size={24} />,
    title: "6 Tipe Proposal",
    desc: "Bisnis, proyek, penelitian, kerjasama, sponsorship, dan acara — semua tersedia.",
  },
  {
    icon: <Download size={24} />,
    title: "Export PDF & Word",
    desc: "Unduh proposal langsung dalam format PDF atau Word yang siap cetak dan presentasi.",
  },
  {
    icon: <Shield size={24} />,
    title: "Aman & Terenkripsi",
    desc: "Data Anda dilindungi dengan enkripsi, autentikasi aman, dan rate limiting.",
  },
  {
    icon: <Zap size={24} />,
    title: "Hasil dalam Detik",
    desc: "Tidak perlu menulis dari nol. Dapatkan proposal lengkap dalam hitungan detik.",
  },
  {
    icon: <Clock size={24} />,
    title: "Riwayat & Template",
    desc: "Simpan, edit, dan gunakan ulang proposal. Tersedia template siap pakai.",
  },
];

const PROPOSAL_TYPES = [
  { icon: <Briefcase size={20} />, name: "Bisnis", color: "#1a73e8" },
  { icon: <FileText size={20} />, name: "Proyek", color: "#34a853" },
  { icon: <FlaskConical size={20} />, name: "Penelitian", color: "#ea4335" },
  { icon: <Handshake size={20} />, name: "Kerjasama", color: "#fbbc05" },
  { icon: <Award size={20} />, name: "Sponsorship", color: "#8e24aa" },
  { icon: <CalendarDays size={20} />, name: "Acara", color: "#00897b" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in, redirect to generator
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/generator");
    }
  }, [status, router]);

  // While checking session, show nothing (prevents flash)
  if (status === "loading" || status === "authenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-main)",
        }}
      >
        <div className="ai-box-material ai-box-animate" style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={28} color="white" strokeWidth={3} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* ==================== NAVBAR ==================== */}
      <nav
        className="landing-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/logopm.webp"
              alt="PROPOSAL.AI Logo"
              style={{ width: 40, height: 40, objectFit: "contain" }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
              }}
            >
              PROPOSAL.AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hide-on-mobile"
              style={{
                textDecoration: "none",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.5rem 1rem",
              }}
            >
              Pricing
            </Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                className="btn-material landing-nav-btn"
              >
                MULAI GRATIS
                <ArrowRight size={14} strokeWidth={3} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section
        style={{
          padding: "6rem 2rem 5rem",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div
              className="flex items-center justify-center gap-2"
              style={{ marginBottom: "2rem" }}
            >
              <span
                style={{
                  background: "var(--active-bg)",
                  color: "var(--primary)",
                  padding: "0.4rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Star size={14} fill="var(--primary)" />
                Powered by Anthropic AI
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-main)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "var(--text-main)",
                maxWidth: 800,
                margin: "0 auto 1.5rem",
              }}
            >
              Buat Proposal{" "}
              <span style={{ color: "var(--primary)" }}>Profesional</span>
              <br />
              dalam Hitungan Detik
            </h1>

            <p
              style={{
                fontSize: "1.2rem",
                color: "var(--text-muted)",
                maxWidth: 560,
                margin: "0 auto 3rem",
                lineHeight: 1.7,
              }}
            >
              Cukup isi beberapa detail, AI akan menulis proposal lengkap
              yang siap cetak dan presentasi. Gratis untuk dicoba.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex items-center justify-center gap-4"
              style={{ flexWrap: "wrap" }}
            >
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button
                  className="btn-material"
                  style={{
                    padding: "1rem 2.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  MULAI BUAT PROPOSAL
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </Link>
              <Link href="/pricing" style={{ textDecoration: "none" }}>
                <button
                  className="btn-material-secondary"
                  style={{
                    padding: "1rem 2.5rem",
                    fontSize: "1rem",
                  }}
                >
                  LIHAT PRICING
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      {/* ==================== PROPOSAL TYPES BAR ==================== */}
      <section
        style={{
          padding: "0 2rem 4rem",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          className="flex items-center justify-center gap-3"
          style={{ flexWrap: "wrap" }}
        >
          {PROPOSAL_TYPES.map((type) => (
            <div
              key={type.name}
              className="flex items-center gap-2"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--text-main)",
              }}
            >
              <span style={{ color: type.color }}>{type.icon}</span>
              {type.name}
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FEATURES GRID ==================== */}
      <section
        style={{
          padding: "5rem 2rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            className="subheading-material"
            style={{ fontSize: "0.75rem" }}
          >
            FITUR UNGGULAN
          </span>
          <h2
            className="heading-material"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Semua yang Anda Butuhkan untuk{" "}
            <span>Proposal Sempurna</span>
          </h2>
        </div>

        <div
          className="grid grid-3 gap-6"
          style={{ maxWidth: 1000, margin: "0 auto" }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="card-material"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "var(--active-bg)",
                  color: "var(--primary)",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "var(--text-main)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span
            className="subheading-material"
            style={{ fontSize: "0.75rem" }}
          >
            CARA KERJA
          </span>
          <h2
            className="heading-material"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Tiga Langkah <span>Sederhana</span>
          </h2>

          <div
            className="grid grid-3 gap-8"
            style={{ marginTop: "3rem", textAlign: "center" }}
          >
            {[
              {
                step: "01",
                title: "Isi Detail",
                desc: "Masukkan judul, deskripsi, organisasi, dan pilih tone serta panjang dokumen.",
              },
              {
                step: "02",
                title: "AI Generate",
                desc: "Klik generate — AI akan menyusun proposal lengkap dengan struktur profesional.",
              },
              {
                step: "03",
                title: "Edit & Export",
                desc: "Edit hasilnya, lalu unduh sebagai PDF atau Word. Siap untuk dikirim!",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "3.5rem",
                    height: "3.5rem",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    borderRadius: "50%",
                    marginBottom: "1.5rem",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-main)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h2
          className="heading-material"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.5rem)",
            marginBottom: "1rem",
          }}
        >
          Siap Membuat <span>Proposal</span> Pertama?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.1rem",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
          }}
        >
          Gratis untuk dicoba. Tidak perlu kartu kredit. Langsung buat
          proposal profesional pertama Anda hari ini.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button
              className="btn-material"
              style={{
                padding: "1.1rem 3rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              DAFTAR GRATIS SEKARANG
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "5rem 2rem 2rem",
          background: "var(--bg-card)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Main Footer Content */}
          <div className="grid grid-3 gap-8" style={{ marginBottom: "4rem" }}>
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: "1rem" }}>
                <img
                  src="/logopm.webp"
                  alt="PROPOSAL.AI Logo"
                  style={{ width: 36, height: 36, objectFit: "contain" }}
                />
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "var(--text-main)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  PROPOSAL.AI
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "300px" }}>
                Buat proposal yang lebih rapi, cepat, dan siap pakai untuk bisnis, proyek, dan penelitian dengan bantuan AI.
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", marginBottom: "1.2rem" }}>Produk</h4>
              <div className="flex flex-col gap-3">
                <Link href="/generator" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Generator Proposal
                </Link>
                <Link href="/pricing" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Pricing & Paket
                </Link>
                <Link href="/login" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Mulai Gratis
                </Link>
              </div>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", marginBottom: "1.2rem" }}>Informasi</h4>
              <div className="flex flex-col gap-3">
                <Link href="/terms" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Syarat & Ketentuan
                </Link>
                <Link href="/privacy" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                  Kebijakan Privasi
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Branding */}
          <div
            style={{
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* MS.Tech Branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>Built by</span>
              <Image
                src="/logo.webp"
                alt="MS.Tech Logo"
                width={72}
                height={72}
                style={{ objectFit: "contain" }}
              />
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} PROPOSAL.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
