"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Crown,
  Zap,
  Settings,
  History,
  Menu,
  X,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";
import Image from "next/image";
import { PROPOSAL_TYPES, type ProposalTypeKey } from "@/types/proposal";
import type { Plan } from "@/lib/subscription";

interface SidebarProps {
  currentType: ProposalTypeKey;
  activeTab: "generator" | "history";
  session: any;
  userPlan: Plan;
  remaining: number | "unlimited";
  onSelectType: (type: ProposalTypeKey) => void;
  onSelectHistory: () => void;
}

export default function Sidebar({
  currentType,
  activeTab,
  session,
  userPlan,
  remaining,
  onSelectType,
  onSelectHistory,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer when a navigation occurs
  const handleSelectType = (type: ProposalTypeKey) => {
    onSelectType(type);
    setMobileOpen(false);
  };

  const handleSelectHistory = () => {
    onSelectHistory();
    setMobileOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex flex-col gap-2">
        <img
          src="/logopm.webp"
          alt="PROPOSAL.AI Logo"
          style={{ width: 64, height: 64, objectFit: "contain", alignSelf: "flex-start" }}
        />
        <span
          className="font-bold uppercase sidebar-brand"
          style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "1rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}
        >
          PROPOSAL.AI
        </span>
      </div>

      {/* Module Navigation */}
      <nav className="flex flex-col" style={{ marginTop: "2rem" }} aria-label="Pilih modul proposal">
        <span
          className="subheading-material"
          style={{ fontSize: "0.7rem", paddingLeft: "1.25rem" }}
          id="module-label"
        >
          Select Module
        </span>
        <div role="group" aria-labelledby="module-label">
          {(Object.keys(PROPOSAL_TYPES) as ProposalTypeKey[]).map((type) => (
            <button
              key={type}
              onClick={() => handleSelectType(type)}
              className={`nav-item-material ${currentType === type && activeTab === "generator" ? "active" : ""}`}
              aria-current={currentType === type && activeTab === "generator" ? "page" : undefined}
            >
              {PROPOSAL_TYPES[type].icon}
              <span>{PROPOSAL_TYPES[type].title}</span>
            </button>
          ))}
        </div>

        <div style={{ margin: "1rem 0", height: "1px", background: "var(--border-color)" }} role="separator" />

        <button
          onClick={handleSelectHistory}
          className={`nav-item-material ${activeTab === "history" ? "active" : ""}`}
          aria-current={activeTab === "history" ? "page" : undefined}
        >
          <History size={24} aria-hidden="true" />
          <span>Riwayat Proposal</span>
        </button>
      </nav>

      {/* Usage Badge */}
      {session && (
        <div
          style={{ padding: "1.25rem", background: "var(--bg-main)", borderRadius: "12px", marginTop: "auto", border: "1px solid var(--border-color)" }}
          aria-label={`Sisa kredit: ${remaining === "unlimited" ? "unlimited" : remaining}`}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              CREDITS
            </span>
            <span className="flex items-center gap-2" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>
              <Crown size={12} aria-hidden="true" />
              {userPlan}
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: remaining === 0 ? "var(--accent)" : "var(--text-main)", lineHeight: 1, marginTop: "0.5rem" }}>
            {remaining === "unlimited" ? "∞" : remaining}
            <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: "0.25rem", textTransform: "lowercase" }}>
              REMAINING
            </span>
          </div>
          {remaining === 0 && (
            <Link href="/pricing" style={{ textDecoration: "none" }}>
              <button
                className="btn-material"
                style={{ width: "100%", justifyContent: "center", padding: "0.75rem", fontSize: "0.7rem", marginTop: "0.75rem", background: "var(--secondary)" }}
              >
                <Zap size={14} strokeWidth={3} aria-hidden="true" />
                UPGRADE
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Auth Section */}
      <div style={{ marginTop: session ? "1rem" : "auto" }}>
        <AuthButton />
        {session && (
          <Link href="/pricing" style={{ textDecoration: "none" }}>
            <button className="nav-item-material" style={{ width: "100%", marginTop: "0.5rem" }}>
              <Settings size={20} aria-hidden="true" />
              <span>PRICING</span>
            </button>
          </Link>
        )}
      </div>

      {/* MS.Tech Branding */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>Made by</span>
        <Image
          src="/logo.webp"
          alt="MS.Tech Logo"
          width={72}
          height={72}
          style={{ objectFit: "contain" }}
        />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu navigasi"
      >
        <Menu size={24} strokeWidth={2.5} />
      </button>

      {/* Desktop Sidebar — always visible on desktop */}
      <aside className="sidebar-material sidebar-desktop" role="navigation" aria-label="Navigasi utama">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar-material sidebar-mobile ${mobileOpen ? "sidebar-mobile-open" : ""}`}
        role="navigation"
        aria-label="Navigasi utama"
      >
        <button
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup menu navigasi"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
