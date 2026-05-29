"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, FileText, Clock, Download, Keyboard } from "lucide-react";

interface OnboardingOverlayProps {
  onDismiss: () => void;
}

const STORAGE_KEY = "proposal-onboarding-seen";

/** Check if onboarding should show */
export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(STORAGE_KEY);
}

/** Mark onboarding as seen */
export function markOnboardingSeen(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}

export default function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Sparkles size={40} color="var(--primary)" />,
      title: "Selamat Datang di Proposal.AI",
      desc: "Buat proposal profesional dalam hitungan detik menggunakan kecerdasan buatan. Tidak perlu menulis dari nol lagi.",
    },
    {
      icon: <FileText size={40} color="var(--secondary)" />,
      title: "Pilih Tipe Proposal",
      desc: "Tersedia 6 modul khusus: Bisnis, Proyek, Penelitian, Kerjasama, Sponsorship, dan Acara — masing-masing dioptimalkan untuk konteksnya.",
    },
    {
      icon: <Clock size={40} color="#fbbc04" />,
      title: "Isi Form, AI yang Menulis",
      desc: "Cukup isi judul, deskripsi, dan pilih gaya penulisan. AI akan menghasilkan dokumen lengkap dengan struktur profesional.",
    },
    {
      icon: <Download size={40} color="#ea4335" />,
      title: "Export PDF & Word",
      desc: "Hasil proposal bisa langsung diedit, lalu diunduh sebagai PDF atau Word. Siap presentasi!",
    },
    {
      icon: <Keyboard size={40} color="var(--primary)" />,
      title: "Tips Cepat",
      desc: "Tekan Ctrl+Enter untuk generate, Ctrl+S untuk export PDF, dan ? untuk melihat semua keyboard shortcuts.",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      markOnboardingSeen();
      onDismiss();
    }
  };

  const handleSkip = () => {
    markOnboardingSeen();
    onDismiss();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Panduan pengguna baru"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px",
          padding: "3rem 2.5rem",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Progress dots */}
        <div
          className="flex items-center justify-center gap-2"
          style={{ marginBottom: "2rem" }}
        >
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentSlide ? 24 : 8,
                height: 8,
                borderRadius: "var(--radius-full)",
                background: i === currentSlide ? "var(--primary)" : "var(--border-color)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--bg-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              {slides[currentSlide].icon}
            </div>

            <h2
              style={{
                fontFamily: "var(--font-main)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-main)",
                marginBottom: "1rem",
                lineHeight: 1.3,
              }}
            >
              {slides[currentSlide].title}
            </h2>

            <p
              style={{
                fontFamily: "var(--font-main)",
                fontSize: "1rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
              }}
            >
              {slides[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-main)",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
              padding: "0.5rem 1rem",
            }}
          >
            Lewati
          </button>

          <button
            onClick={handleNext}
            className="btn-material"
            style={{
              padding: "0.75rem 1.75rem",
              fontSize: "0.9rem",
            }}
          >
            {currentSlide === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        {/* Slide counter */}
        <p
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "1.5rem",
          }}
        >
          {currentSlide + 1} / {slides.length}
        </p>
      </motion.div>
    </div>
  );
}
