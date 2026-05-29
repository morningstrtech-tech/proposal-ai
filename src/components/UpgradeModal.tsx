"use client";

import { X, Crown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  remainingGenerations: number | "unlimited";
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  remainingGenerations}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="flex items-center justify-center"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 31, 63, 0.85)",
        backdropFilter: "blur(8px)"}}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)", borderRadius: "12px",
          boxShadow: "var(--shadow-sm)",
          padding: "3.5rem",
          maxWidth: 520,
          width: "90%",
          position: "relative"}}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--primary)"}}
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            background: "var(--secondary)",
            border: "1px solid var(--border-color)", borderRadius: "12px",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "2rem"}}
        >
          <Zap size={36} color="#fff" strokeWidth={3} />
        </div>

        {/* Content */}
        <h2
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: "0.5rem",
            color: "var(--text-main)",
            letterSpacing: "-0.01em"
          }}
        >
          Limit Reached
        </h2>

        <p
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            marginBottom: "0.5rem"}}
        >
          Plan kamu saat ini:{" "}
          <strong style={{ color: "var(--primary)" }}>{currentPlan}</strong>
        </p>
        <p
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            marginBottom: "2rem"}}
        >
          Sisa generate:{" "}
          <strong style={{ color: "var(--secondary)" }}>
            {remainingGenerations === "unlimited"
              ? "UNLIMITED"
              : `${remainingGenerations} / ${currentPlan === "PRO" ? 5 : 1}`}
          </strong>
        </p>

        <p
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem"}}
        >
          Upgrade plan kamu untuk mendapatkan lebih banyak generate proposal
          dengan AI-powered output berkualitas tinggi.
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <Link href="/pricing" style={{ textDecoration: "none" }}>
            <button className="btn-material" style={{ width: "100%", justifyContent: "center" }}>
              <Crown size={20} strokeWidth={3} />
              LIHAT PRICING
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </Link>
          <button
            onClick={onClose}
            className="btn-material-secondary"
            style={{ width: "100%", textAlign: "center" }}
          >
            NANTI SAJA
          </button>
        </div>
      </div>
    </div>
  );
}
