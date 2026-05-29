"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { ProposalFormData } from "@/types/proposal";

const TONE_OPTIONS = [
  "formal",
  "persuasif",
  "profesional",
  "akademik",
  "inovatif",
  "tegas",
];

interface FormStep2Props {
  formData: ProposalFormData;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
  isLoggedIn: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => void;
  onFileChange: (id: string, base64: string) => void;
  onToneChange: (tone: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export default function FormStep2({
  formData,
  sessionStatus,
  isLoggedIn,
  onInputChange,
  onFileChange,
  onToneChange,
  onBack,
  onGenerate,
}: FormStep2Props) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      e.target.value = ""; // Reset input
      return;
    }

    const targetId = e.target.id;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileChange(targetId, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <motion.section
      key="step2"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="card-material"
      aria-label="Langkah 2: Pengaturan gaya penulisan"
    >
      <div className="grid grid-2 gap-8">
        {/* Tone Archetype */}
        <div className="flex flex-col gap-3 col-span-full">
          <span className="label-material" id="tone-group-label">
            Tone Archetype
          </span>
          <div className="grid grid-3 gap-4" role="radiogroup" aria-labelledby="tone-group-label">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                onClick={() => onToneChange(tone)}
                role="radio"
                aria-checked={formData.tone === tone}
                style={{
                  padding: "1rem",
                  border: "1px solid",
                  borderColor: formData.tone === tone ? "var(--primary)" : "var(--border-color)",
                  borderRadius: "8px",
                  background: formData.tone === tone ? "var(--active-bg)" : "transparent",
                  color: formData.tone === tone ? "var(--primary)" : "var(--text-main)",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {tone.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Magnitude */}
        <div className="flex flex-col gap-3">
          <label htmlFor="length" className="label-material">
            Magnitude
          </label>
          <select
            id="length"
            name="length"
            value={formData.length}
            onChange={onInputChange}
            className="input-material"
          >
            <option value="ringkas">COMPACT (1-2 PGS)</option>
            <option value="standar">STANDARD (3-5 PGS)</option>
            <option value="detail">EXTENDED (10+ PGS)</option>
          </select>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-3">
          <label htmlFor="lang" className="label-material">
            Dialect
          </label>
          <select
            id="lang"
            name="lang"
            value={formData.lang}
            onChange={onInputChange}
            className="input-material"
          >
            <option value="Indonesia">INDONESIAN</option>
            <option value="Inggris">ENGLISH</option>
          </select>
        </div>

        {/* Extra data */}
        <div className="flex flex-col gap-3 col-span-full">
          <label htmlFor="extra" className="label-material">
            Critical Data (Budget/Timeline)
          </label>
          <textarea
            id="extra"
            name="extra"
            value={formData.extra}
            onChange={onInputChange}
            className="input-material"
            style={{ minHeight: 120 }}
            placeholder="ANGGARAN: $XXX, TIMELINE: 6 MONTHS..."
          />
        </div>

        {/* Branding & Signature */}
        <div className="flex flex-col gap-3 col-span-full">
          <span className="label-material" id="branding-label">
            Branding & Signature (Optional)
          </span>
          <div className="grid grid-2 gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="logo" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Company Logo</label>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", marginBottom: "4px" }}>
                  Disarankan format PNG transparan. Tinggi di hasil: maks 80px.
                </p>
              </div>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="input-material"
                style={{ padding: "0.5rem" }}
              />
              {formData.logo && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img src={formData.logo} alt="Logo preview" style={{ height: "40px", objectFit: "contain" }} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <label htmlFor="signature" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Digital Signature</label>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", marginBottom: "4px" }}>
                  Disarankan format PNG transparan. Tinggi di hasil: maks 100px.
                </p>
              </div>
              <input
                id="signature"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="input-material"
                style={{ padding: "0.5rem" }}
              />
              {formData.signature && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img src={formData.signature} alt="Signature preview" style={{ height: "40px", objectFit: "contain" }} />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2" style={{ marginTop: "0.5rem" }}>
            <label htmlFor="signatureName" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Signature Name / Title</label>
            <input
              id="signatureName"
              name="signatureName"
              value={formData.signatureName}
              onChange={onInputChange}
              className="input-material"
              placeholder="e.g. John Doe, CEO"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4" style={{ marginTop: "4rem" }}>
        <button onClick={onBack} className="btn-material-secondary" type="button">
          BACK
        </button>
        <button onClick={onGenerate} className="btn-material" type="button">
          {sessionStatus === "loading" ? (
            "LOADING..."
          ) : !isLoggedIn ? (
            <>
              LOGIN TO GENERATE{" "}
              <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
            </>
          ) : (
            <>
              INITIALIZE{" "}
              <Sparkles size={20} strokeWidth={2} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}
