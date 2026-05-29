"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { HistoryItem } from "@/types/proposal";

interface HistoryPanelProps {
  items: HistoryItem[];
  loading: boolean;
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem?: (id: string) => void;
}

function SkeletonCard() {
  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        padding: "1.25rem",
        background: "var(--bg-card)",
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
        <div className="skeleton-pulse" style={{ width: 60, height: 20, borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ width: 80, height: 16, borderRadius: 4 }} />
      </div>
      <div className="skeleton-pulse" style={{ width: "75%", height: 20, borderRadius: 4, marginBottom: "1rem" }} />
      <div className="skeleton-pulse" style={{ width: "100%", height: 36, borderRadius: 20 }} />
    </div>
  );
}

export default function HistoryPanel({ items, loading, onLoadItem, onDeleteItem }: HistoryPanelProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }

    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/proposals?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Proposal dihapus");
        onDeleteItem?.(id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus");
      }
    } catch {
      toast.error("Gagal menghapus proposal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="card-material" aria-label="Riwayat proposal">
      <h2 className="heading-material" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Riwayat Anda
      </h2>

      {loading ? (
        <div className="grid grid-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "var(--bg-main)",
            borderRadius: "var(--radius-lg)",
            border: "1px dashed var(--border-color)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--active-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
            }}
            aria-hidden="true"
          >
            📄
          </div>
          <p
            style={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "var(--text-main)",
              marginBottom: "0.5rem",
            }}
          >
            Belum ada proposal
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Proposal yang kamu buat akan muncul di sini. Yuk mulai buat!
          </p>
        </div>
      ) : (
        <div className="grid grid-2 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                background: "var(--bg-card)",
                transition: "box-shadow 0.2s ease",
                position: "relative",
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    background: "var(--active-bg)",
                    color: "var(--primary)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.type}
                </span>
                <time
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  dateTime={item.createdAt}
                >
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </time>
              </div>

              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "var(--text-main)",
                  paddingRight: "2rem",
                }}
              >
                {item.title}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => onLoadItem(item)}
                  className="btn-material-secondary"
                  style={{ flex: 1, padding: "0.6rem", justifyContent: "center" }}
                >
                  BUKA
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  style={{
                    padding: "0.6rem 0.75rem",
                    border: "1px solid",
                    borderColor: confirmDeleteId === item.id ? "var(--accent)" : "var(--border-color)",
                    borderRadius: "var(--radius-full)",
                    background: confirmDeleteId === item.id ? "var(--accent-bg)" : "transparent",
                    color: confirmDeleteId === item.id ? "var(--accent)" : "var(--text-muted)",
                    cursor: deletingId === item.id ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    opacity: deletingId === item.id ? 0.5 : 1,
                  }}
                  aria-label={
                    confirmDeleteId === item.id
                      ? "Klik lagi untuk konfirmasi hapus"
                      : "Hapus proposal"
                  }
                  title={
                    confirmDeleteId === item.id
                      ? "Klik lagi untuk konfirmasi"
                      : "Hapus"
                  }
                >
                  <Trash2 size={16} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
