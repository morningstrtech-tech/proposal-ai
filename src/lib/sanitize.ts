/**
 * Input sanitization utilities for API routes.
 * Prevents prompt injection and ensures safe, bounded input.
 */

/** Strip HTML tags and limit string length */
export function sanitizeText(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")        // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // Strip control chars
    .trim()
    .slice(0, maxLength);
}

/** Sanitize base64 image strings (max ~3MB) */
export function sanitizeBase64Image(input: unknown): string {
  if (typeof input !== "string") return "";
  if (!input.startsWith("data:image/")) return "";
  if (input.length > 3_000_000) return ""; 
  return input;
}

/** Validate that a value is one of allowed options */
export function sanitizeEnum<T extends string>(
  input: unknown,
  allowed: T[],
  fallback: T
): T {
  if (typeof input !== "string") return fallback;
  return allowed.includes(input as T) ? (input as T) : fallback;
}

/** Validate and sanitize the full proposal form data */
export interface SanitizedFormData {
  type: string;
  judul: string;
  org: string;
  kepada: string;
  desc: string;
  tone: string;
  length: string;
  lang: string;
  extra: string;
  logo: string;
  signature: string;
  signatureName: string;
}

const VALID_TYPES = [
  "bisnis", "proyek", "penelitian", "kerjasama", "sponsorship", "acara",
] as const;

const VALID_TONES = [
  "formal", "persuasif", "profesional", "akademik", "inovatif", "tegas",
] as const;

const VALID_LENGTHS = ["ringkas", "standar", "detail"] as const;
const VALID_LANGS = ["Indonesia", "Inggris"] as const;

export function sanitizeFormData(body: Record<string, unknown>): SanitizedFormData {
  return {
    type: sanitizeEnum(body.type, [...VALID_TYPES], "bisnis"),
    judul: sanitizeText(body.judul, 200),
    org: sanitizeText(body.org, 200),
    kepada: sanitizeText(body.kepada, 200),
    desc: sanitizeText(body.desc, 3000),
    tone: sanitizeEnum(body.tone, [...VALID_TONES], "formal"),
    length: sanitizeEnum(body.length, [...VALID_LENGTHS], "standar"),
    lang: sanitizeEnum(body.lang, [...VALID_LANGS], "Indonesia"),
    extra: sanitizeText(body.extra, 2000),
    logo: sanitizeBase64Image(body.logo),
    signature: sanitizeBase64Image(body.signature),
    signatureName: sanitizeText(body.signatureName, 100),
  };
}

/** Validate that required fields are present */
export function validateFormData(
  data: SanitizedFormData
): { valid: boolean; error?: string } {
  if (!data.judul || data.judul.length < 3) {
    return { valid: false, error: "Judul proposal minimal 3 karakter." };
  }
  return { valid: true };
}
