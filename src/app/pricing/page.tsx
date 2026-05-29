"use client";

import { PLAN_DETAILS, type Plan } from "@/lib/subscription";
import { Check, ArrowLeft, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";
import { useState } from "react";

const PLAN_ICONS: Record<Plan, React.ReactNode> = {
  FREE: <Sparkles size={28} strokeWidth={3} />,
  PRO: <Crown size={28} strokeWidth={3} />,
  ULTRA: <Zap size={28} strokeWidth={3} />};

export default function PricingPage() {
  const { data: session, update } = useSession();
  const currentPlan = (session?.user?.plan as Plan) || null;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (!session) {
      toast.error("Silakan login terlebih dahulu!");
      return;
    }
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi server");
      }
      
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            toast.success("Pembayaran berhasil! Mengupgrade akun Anda...");
            update({ plan }); // Update session to trigger UI change
          },
          onPending: function (result: any) {
            toast("Selesaikan pembayaran Anda", { icon: "⏳" });
          },
          onError: function (result: any) {
            toast.error("Pembayaran gagal.");
          },
          onClose: function () {
            setLoadingPlan(null);
          },
        });
      } else {
        toast.error("Gagal memuat sistem pembayaran");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      // Don't set loading to null if success, wait for onClose or success to reload
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* Midtrans Snap Script */}
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.includes("sandbox") || !process.env.NODE_ENV || process.env.NODE_ENV !== "production" 
          ? "https://app.sandbox.midtrans.com/snap/snap.js" 
          : "https://app.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <Toaster position="top-center" />
      {/* Nav */}
      <div className="flex items-center justify-between pricing-nav">
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{
            textDecoration: "none",
            color: "var(--primary)",
            fontFamily: "var(--font-main)",
            fontWeight: 700,
            fontSize: "0.85rem"}}
        >
          <ArrowLeft size={16} strokeWidth={3} />
          KEMBALI KE GENERATOR
        </Link>
        <span
          style={{
            fontFamily: "var(--font-main)",
            fontWeight: 900,
            fontSize: "1.25rem",
            color: "var(--primary)"}}
        >
          PROPOSAL.AI
        </span>
      </div>

      {/* Header */}
      <div className="pricing-header">
        <span
          className="subheading-material"
          style={{ fontSize: "0.75rem" }}
        >
          PILIH PLAN YANG COCOK
        </span>
        <h1 className="heading-material" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1 }}>
          Pricing
        </h1>
        <p
          style={{
            fontFamily: "var(--font-main)",
            color: "var(--text-muted)",
            fontSize: "1.1rem",
            maxWidth: 550}}
        >
          Mulai gratis, upgrade kapan saja. Semua plan termasuk akses ke 6 tipe
          proposal generator.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-3 gap-8 pricing-grid">
        {(Object.keys(PLAN_DETAILS) as Plan[]).map((plan) => {
          const details = PLAN_DETAILS[plan];
          const isCurrentPlan = currentPlan === plan;
          const isRecommended = details.recommended;

          return (
            <div
              key={plan}
              style={{
                border: isRecommended
                  ? "2px solid var(--primary)"
                  : "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: "3rem 2.5rem",
                background: "var(--bg-card)",
                boxShadow: isRecommended
                  ? "var(--shadow-md)"
                  : "var(--shadow-sm)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"}}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "0.4rem 1.2rem",
                    fontFamily: "var(--font-main)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    borderRadius: "1rem",
                    boxShadow: "var(--shadow-sm)"}}
                >
                  RECOMMENDED
                </div>
              )}

              {/* Icon */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  background:
                    plan === "ULTRA"
                      ? "var(--secondary)"
                      : plan === "PRO"
                      ? "var(--primary)"
                      : "var(--active-bg)",
                  color: plan === "FREE" ? "var(--primary)" : "#fff",
                  borderRadius: "50%",
                  marginBottom: "1.5rem"}}
              >
                {PLAN_ICONS[plan]}
              </div>

              {/* Plan Name */}
              <h3
                style={{
                  fontFamily: "var(--font-main)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem"}}
              >
                {details.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: "2rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "var(--primary)"}}
                >
                  {details.price}
                </span>
                <br />
                <span
                  style={{
                    fontFamily: "var(--font-main)",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)"}}
                >
                  {details.priceNote}
                </span>
              </div>

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  flex: 1}}
              >
                {details.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-main)",
                      fontSize: "0.85rem",
                      padding: "0.6rem 0",
                      borderBottom: "1px solid rgba(0,31,63,0.1)"}}
                  >
                    <Check
                      size={18}
                      strokeWidth={2.5}
                      color={"var(--primary)"}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div style={{ marginTop: "2.5rem" }}>
                {isCurrentPlan ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      padding: "1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "100px",
                      fontFamily: "var(--font-main)",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      background: "var(--bg-main)"}}
                  >
                    PLAN AKTIF
                  </div>
                ) : plan === "FREE" ? (
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <button
                      className="btn-material-secondary"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      MULAI GRATIS
                    </button>
                  </Link>
                ) : (
                  <button
                    className="btn-material"
                    disabled={loadingPlan === plan}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      opacity: loadingPlan === plan ? 0.7 : 1,
                      cursor: loadingPlan === plan ? "wait" : "pointer",
                      background: isRecommended
                        ? "var(--secondary)"
                        : "var(--primary)"}}
                    onClick={() => handleCheckout(plan)}
                  >
                    {loadingPlan === plan ? "MEMPROSES..." : `UPGRADE KE ${plan}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
