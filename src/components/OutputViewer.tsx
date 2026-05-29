"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Copy, FileDown, Download, RotateCcw } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface OutputViewerProps {
  content: string;
  title: string;
  onContentChange: (content: string) => void;
  onReset: () => void;
  onRegisterExportPDF?: (fn: () => void) => void;
  onRegisterExportWord?: (fn: () => void) => void;
  logo?: string;
  signature?: string;
  signatureName?: string;
}

export default function OutputViewer({
  content,
  title,
  onContentChange,
  onReset,
  onRegisterExportPDF,
  onRegisterExportWord,
  logo,
  signature,
  signatureName,
}: OutputViewerProps) {
  const [copied, setCopied] = useState(false);

  // Compose full document HTML with branding for export
  const fullDocumentHtml = useMemo(() => {
    let html = "";
    if (logo) {
      html += `<div style="text-align:right;margin-bottom:2rem;"><img src="${logo}" alt="Company Logo" style="max-height:80px;object-fit:contain;" /></div>`;
    }
    html += content;
    if (signature) {
      const name = signatureName || "Tanda Tangan";
      html += `<div style="margin-top:3rem;"><p>Hormat kami,</p><img src="${signature}" alt="${name}" style="max-height:100px;object-fit:contain;display:block;margin:0.5rem 0;" /><p><strong>${name}</strong></p></div>`;
    }
    return html;
  }, [content, logo, signature, signatureName]);

  const copyToClipboard = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fullDocumentHtml;
    navigator.clipboard.writeText(tempDiv.innerText).then(() => {
      setCopied(true);
      toast.success("Disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportPDF = async () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const el = document.createElement("div");
      el.className = "prose-material"; // Apply global CSS styles
      el.innerHTML = fullDocumentHtml;
      el.style.padding = "40px";
      el.style.fontFamily = "sans-serif";
      
      await html2pdf().set({
        margin: [0.5, 0.5, 0.5, 0.5], 
        filename: `${title || "proposal"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        // @ts-ignore - Definisi tipe (typings) html2pdf.js belum diupdate untuk properti pagebreak
        pagebreak: { mode: ['css', 'legacy'], before: 'h2', avoid: ['h3', 'h4', 'p', 'li', 'img', 'table'] }
      }).from(el).save();
      toast.success("PDF berhasil diunduh", { id: toastId });
    } catch { toast.error("Gagal export PDF", { id: toastId }); }
  };

  const exportWord = async () => {
    const toastId = toast.loading("Generating Word Document...");
    try {
      const { asBlob } = await import("html-docx-js-typescript");
      const { saveAs } = await import("file-saver");
      
      // Fix for MS Word page breaks: inject <br clear="all"> before all <h2> EXCEPT the first one
      const parts = fullDocumentHtml.split(/<h2/i);
      let wordContent = fullDocumentHtml;
      if (parts.length > 1) {
        wordContent = parts.join('<br clear="all" style="page-break-before:always" />\n<h2').replace('<br clear="all" style="page-break-before:always" />\n<h2', '<h2');
      }

      const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>body{font-family:sans-serif;line-height:1.6}h1,h2,h3{color:#202124}h2{margin-top:24pt;margin-bottom:12pt;font-size:18pt}h3{margin-top:16pt;margin-bottom:8pt;font-size:14pt}p{margin-bottom:12pt;font-size:11pt}img{max-width:100%}</style></head><body>${wordContent}</body></html>`;
      const blob = await asBlob(html);
      saveAs(blob as Blob, `${title || "proposal"}.docx`);
      toast.success("Word document berhasil diunduh", { id: toastId });
    } catch { toast.error("Gagal export Word", { id: toastId }); }
  };

  // Register export functions for keyboard shortcuts
  useEffect(() => {
    onRegisterExportPDF?.(exportPDF);
    onRegisterExportWord?.(exportWord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, logo, signature, signatureName]);

  const brandingContainerStyle: React.CSSProperties = {
    padding: "1.5rem",
    background: "var(--bg-card)",
  };

  return (
    <motion.section key="step3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: "relative" }} aria-label="Hasil proposal">
      <div style={{ marginBottom: "2rem", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", background: "var(--bg-card)" }} className="success-shimmer">

        {/* Logo — rendered above the editor as native HTML */}
        {logo && (
          <div style={{ ...brandingContainerStyle, borderBottom: "1px solid var(--border-color)", textAlign: "right" }}>
            <img src={logo} alt="Company Logo" style={{ maxHeight: "80px", objectFit: "contain" }} />
          </div>
        )}

        {/* Rich Text Editor — only AI text, no images to strip */}
        <RichTextEditor content={content} onChange={onContentChange} />

        {/* Signature — rendered below the editor as native HTML */}
        {signature && (
          <div style={{ ...brandingContainerStyle, borderTop: "1px solid var(--border-color)" }}>
            <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>Hormat kami,</p>
            <img src={signature} alt={signatureName || "Tanda Tangan"} style={{ maxHeight: "100px", objectFit: "contain", display: "block", marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, fontWeight: 700, color: "var(--text-main)" }}>{signatureName || "Tanda Tangan"}</p>
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          fontFamily: "var(--font-main)",
        }}
      >
        <span style={{ opacity: 0.7 }}>
          ⌨️ Ctrl+S = PDF &nbsp;·&nbsp; Ctrl+Shift+S = Word &nbsp;·&nbsp; Ctrl+N = Baru &nbsp;·&nbsp; ? = Bantuan
        </span>
      </div>

      <div className="floating-actions-container" role="toolbar" aria-label="Aksi dokumen">
        <button onClick={copyToClipboard} className="btn-material" style={{ padding: "1rem", borderRadius: "50%", background: copied ? "var(--secondary)" : "var(--primary)", color: "white", border: "none", boxShadow: "var(--shadow-md)" }} aria-label="Salin teks ke clipboard" title="Copy (Ctrl+C)">
          <Copy size={28} strokeWidth={3} aria-hidden="true" />
        </button>
        <button onClick={exportPDF} className="btn-material" style={{ padding: "1rem", borderRadius: "50%", background: "var(--bg-card)", color: "#c5221f", border: "1px solid #c5221f", boxShadow: "var(--shadow-md)" }} aria-label="Unduh sebagai PDF" title="Export PDF (Ctrl+S)">
          <FileDown size={28} strokeWidth={3} aria-hidden="true" />
        </button>
        <button onClick={exportWord} className="btn-material" style={{ padding: "1rem", borderRadius: "50%", background: "var(--bg-card)", color: "#185abc", border: "1px solid #185abc", boxShadow: "var(--shadow-md)" }} aria-label="Unduh sebagai Word" title="Export Word (Ctrl+Shift+S)">
          <Download size={28} strokeWidth={3} aria-hidden="true" />
        </button>
        <button onClick={onReset} className="btn-material" style={{ padding: "1rem", borderRadius: "50%", background: "var(--bg-card)", color: "var(--text-muted)", border: `1px solid var(--border-color)`, boxShadow: "var(--shadow-sm)" }} aria-label="Buat proposal baru" title="Buat Baru (Ctrl+N)">
          <RotateCcw size={28} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </motion.section>
  );
}
