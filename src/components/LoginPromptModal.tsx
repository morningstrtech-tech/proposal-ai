"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface LoginPromptModalProps {
  onClose: () => void;
}

export default function LoginPromptModal({ onClose }: LoginPromptModalProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0, 31, 63, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", borderRadius: "16px", boxShadow: "var(--shadow-lg)", padding: "3rem", maxWidth: 440, width: "90%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <div className="flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--active-bg)", color: "var(--primary)", marginBottom: "1.5rem" }} aria-hidden="true">
          <Sparkles size={32} color="var(--primary)" strokeWidth={2.5} />
        </div>
        <h2 id="login-prompt-title" style={{ fontFamily: "var(--font-main)", fontSize: "1.75rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>
          LOGIN REQUIRED
        </h2>
        <p style={{ fontFamily: "var(--font-main)", fontSize: "1rem", color: "var(--text-muted)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Kamu harus login terlebih dahulu untuk generate proposal menggunakan AI.
        </p>
        <div className="flex flex-col gap-4">
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn-material" style={{ width: "100%", justifyContent: "center" }}>
              LOGIN SEKARANG <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </Link>
          <button onClick={onClose} className="btn-material-secondary" style={{ width: "100%", textAlign: "center" }}>
            NANTI SAJA
          </button>
        </div>
      </div>
    </div>
  );
}
