"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(`Login gagal: ${error}. Pastikan konfigurasi .env sudah benar.`, {
        duration: 5000,
        style: {
          borderRadius: "8px",
          background: "var(--bg-card)",
          color: "var(--text-main)",
          fontFamily: "var(--font-main)",
          fontSize: "0.9rem",
        },
      });
    }
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Quick validation to prevent silent failure if EMAIL_SERVER isn't set (handled implicitly by next-auth, but good for UX)
    const res = await signIn("email", { email, callbackUrl: "/", redirect: false });
    
    if (res?.error) {
       toast.error("Gagal mengirim magic link. Apakah SMTP sudah disetting di .env?");
    } else if (res?.ok) {
       setEmailSent(true);
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        padding: "2rem"}}
    >
      <Toaster position="top-center" />
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* Header */}
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{
            textDecoration: "none",
            color: "var(--primary)",
            fontFamily: "var(--font-main)",
            fontSize: "0.85rem",
            fontWeight: 700,
            marginBottom: "3rem"}}
        >
          <ArrowLeft size={16} strokeWidth={3} />
          KEMBALI
        </Link>

        {/* Logo */}
        <img
          src="/logopm.webp"
          alt="PROPOSAL.AI Logo"
          style={{ width: 80, height: 80, objectFit: "contain", marginBottom: "2.5rem" }}
        />

        <h1 className="heading-material" style={{ marginBottom: "0.5rem" }}>
          Login
        </h1>
        <p
          style={{
            fontFamily: "var(--font-main)",
            color: "var(--text-muted)",
            fontSize: "1rem",
            marginBottom: "3rem"}}
        >
          Masuk untuk mulai generate proposal profesional.
        </p>

        {/* Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="btn-material"
          style={{
            width: "100%",
            justifyContent: "center",
            marginBottom: "1.5rem",
            background: "var(--bg-card)",
            color: "var(--primary)",
            fontSize: "1rem"}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          MASUK DENGAN GOOGLE
        </button>



        {/* Footer */}
        <p
          style={{
            fontFamily: "var(--font-main)",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            marginTop: "3rem",
            lineHeight: 1.6}}
        >
          Dengan login, kamu menyetujui{" "}
          <Link href="/terms" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>Terms of Service</Link>{" "}
          dan{" "}
          <Link href="/privacy" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>Privacy Policy</Link>{" "}
          kami.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-main)", color: "var(--text-muted)" }}>Memuat halaman login...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
