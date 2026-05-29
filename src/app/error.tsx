"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#fce8e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2rem",
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-main)",
            marginBottom: "1rem",
          }}
        >
          Terjadi Kesalahan
        </h1>

        <p
          style={{
            fontFamily: "var(--font-main)",
            color: "var(--text-muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          Maaf, terjadi kesalahan yang tidak terduga.
          Silakan coba lagi atau hubungi tim dukungan jika masalah berlanjut.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-material"
            style={{ padding: "1rem 2rem", fontSize: "0.9rem" }}
          >
            COBA LAGI
          </button>
          <a href="/" style={{ textDecoration: "none" }}>
            <button
              className="btn-material-secondary"
              style={{ padding: "1rem 2rem", fontSize: "0.9rem" }}
            >
              KE BERANDA
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
