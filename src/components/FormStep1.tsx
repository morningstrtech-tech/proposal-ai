"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wand2 } from "lucide-react";
import type { ProposalFormData, ProposalTypeKey } from "@/types/proposal";
import { PROPOSAL_TEMPLATES, type ProposalTemplate } from "@/lib/templates";

interface FormStep1Props {
  currentType: ProposalTypeKey;
  formData: ProposalFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLoadTemplate: (template: ProposalTemplate) => void;
  onNext: () => void;
}

const MAX_JUDUL = 200;
const MAX_ORG = 200;
const MAX_KEPADA = 200;
const MAX_DESC = 3000;

export default function FormStep1({
  currentType,
  formData,
  onInputChange,
  onLoadTemplate,
  onNext,
}: FormStep1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!formData.judul.trim()) {
      errs.judul = "Judul proposal wajib diisi.";
    } else if (formData.judul.trim().length < 3) {
      errs.judul = "Judul minimal 3 karakter.";
    }
    return errs;
  }, [formData.judul]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleNext = () => {
    const errs = validate();
    setErrors(errs);
    // Mark all required fields as touched
    setTouched({ judul: true });
    if (Object.keys(errs).length === 0) {
      onNext();
    }
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: "var(--font-main)",
    fontSize: "0.8rem",
    color: "var(--accent)",
    marginTop: "4px",
    fontWeight: 500,
  };

  const charCountStyle = (current: number, max: number): React.CSSProperties => ({
    fontFamily: "var(--font-main)",
    fontSize: "0.75rem",
    color: current > max * 0.9 ? "var(--accent)" : "var(--text-muted)",
    textAlign: "right" as const,
    marginTop: "4px",
    fontWeight: 500,
  });

  const availableTemplates = PROPOSAL_TEMPLATES.filter((t) => t.type === currentType);

  return (
    <motion.section
      key="step1"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="card-material"
      aria-label="Langkah 1: Konteks proposal"
    >
      {availableTemplates.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <label className="label-material" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Wand2 size={16} /> Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  onLoadTemplate(tpl);
                  setErrors({});
                  setTouched({});
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  background: "var(--active-bg)",
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "var(--primary)", e.currentTarget.style.color = "white")}
                onMouseOut={(e) => (e.currentTarget.style.background = "var(--active-bg)", e.currentTarget.style.color = "var(--primary)")}
              >
                {tpl.templateName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-2 gap-8">
        {/* Title */}
        <div className="flex flex-col gap-3 col-span-full">
          <label htmlFor="judul" className="label-material">
            Proposal Title <span aria-hidden="true" style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="judul"
            name="judul"
            value={formData.judul}
            onChange={onInputChange}
            onBlur={() => handleBlur("judul")}
            className="input-material"
            placeholder="E.G. RETAIL EXPANSION 2025"
            required
            aria-required="true"
            aria-invalid={touched.judul && !!errors.judul}
            aria-describedby="judul-error judul-count"
            maxLength={MAX_JUDUL}
            autoComplete="off"
            style={touched.judul && errors.judul ? { borderColor: "var(--accent)" } : undefined}
          />
          <div className="flex justify-between">
            {touched.judul && errors.judul ? (
              <span id="judul-error" role="alert" style={errorStyle}>
                {errors.judul}
              </span>
            ) : <span />}
            <span id="judul-count" style={charCountStyle(formData.judul.length, MAX_JUDUL)}>
              {formData.judul.length}/{MAX_JUDUL}
            </span>
          </div>
        </div>

        {/* Organization */}
        <div className="flex flex-col gap-3">
          <label htmlFor="org" className="label-material">
            Organization
          </label>
          <input
            id="org"
            name="org"
            value={formData.org}
            onChange={onInputChange}
            className="input-material"
            placeholder="CORP NAME"
            maxLength={MAX_ORG}
            autoComplete="organization"
          />
          <span style={charCountStyle(formData.org.length, MAX_ORG)}>
            {formData.org.length}/{MAX_ORG}
          </span>
        </div>

        {/* Recipient */}
        <div className="flex flex-col gap-3">
          <label htmlFor="kepada" className="label-material">
            Recipient
          </label>
          <input
            id="kepada"
            name="kepada"
            value={formData.kepada}
            onChange={onInputChange}
            className="input-material"
            placeholder="TARGET BOARD"
            maxLength={MAX_KEPADA}
            autoComplete="off"
          />
          <span style={charCountStyle(formData.kepada.length, MAX_KEPADA)}>
            {formData.kepada.length}/{MAX_KEPADA}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3 col-span-full">
          <label htmlFor="desc" className="label-material">
            Core Objectives
          </label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={onInputChange}
            className="input-material"
            style={{ minHeight: 150 }}
            placeholder="DEFINE THE MISSION PARAMETERS..."
            maxLength={MAX_DESC}
          />
          <span style={charCountStyle(formData.desc.length, MAX_DESC)}>
            {formData.desc.length}/{MAX_DESC}
          </span>
        </div>
      </div>

      <div className="flex justify-end" style={{ marginTop: "4rem" }}>
        <button onClick={handleNext} className="btn-material" type="button">
          NEXT PHASE <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </motion.section>
  );
}
