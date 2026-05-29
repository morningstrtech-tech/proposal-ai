"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Crown, User } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="auth-button-skeleton">
        <div className="skeleton-pulse" style={{ width: 32, height: 32 }} />
        <div className="skeleton-pulse" style={{ width: 80, height: 16 }} />
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="btn-material"
        style={{ width: "100%", justifyContent: "center" }}
      >
        <LogIn size={20} strokeWidth={2.5} />
        <span>Login</span>
      </button>
    );
  }

  const planBadge = session.user.plan || "FREE";

  return (
    <div className="flex flex-col gap-2" style={{ width: "100%" }}>
      {/* User Info */}
      <div
        className="flex items-center gap-4"
        style={{
          padding: "0.75rem 1rem",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-sm)"}}
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover"}}
          />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem"}}
          >
            <User size={18} />
          </div>
        )}
        <div className="flex flex-col" style={{ overflow: "hidden" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.85rem",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "var(--text-main)",
              maxWidth: 140}}
          >
            {session.user.name || session.user.email?.split("@")[0]}
          </span>
          <span
            className="flex items-center gap-2"
            style={{
              fontSize: "0.65rem",
              fontFamily: "var(--font-main)",
              color: "var(--text-muted)"}}
          >
            <Crown size={10} />
            {planBadge}
          </span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => signOut()}
        className="btn-material-secondary"
        style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "0.5rem" }}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}
