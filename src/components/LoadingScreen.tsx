"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Estimated progress (asymptotic — never reaches 100 until actually done)
  const progress = Math.min(95, Math.round((1 - Math.exp(-elapsed / 25)) * 100));

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
      style={{ padding: "6rem 0" }}
      role="status"
      aria-live="polite"
      aria-label="Sedang memproses proposal"
    >
      <img 
        src="/logopm.webp" 
        alt="Loading..." 
        className="ai-box-animate" 
        style={{ width: "80px", height: "80px", objectFit: "contain" }} 
        aria-hidden="true" 
      />

      <h2
        className="heading-material"
        style={{
          fontSize: "1.5rem",
          marginTop: "2rem",
          color: "var(--text-main)",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {message}
      </h2>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          height: 4,
          background: "var(--skeleton-bg)",
          borderRadius: "var(--radius-full)",
          marginTop: "2rem",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${progress}%`}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "var(--primary)",
            borderRadius: "var(--radius-full)",
          }}
        />
      </div>

      {/* Stats Row */}
      <div
        className="flex items-center justify-between"
        style={{
          width: "100%",
          maxWidth: 360,
          marginTop: "0.75rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          ⏱ {formatTime(elapsed)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "0.8rem",
            color: "var(--primary)",
            fontWeight: 600,
          }}
        >
          {progress}%
        </span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-main)",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          marginTop: "1.5rem",
          textAlign: "center",
        }}
      >
        Powered by Gemini AI — biasanya memakan waktu 5-15 detik
      </p>
    </motion.div>
  );
}
