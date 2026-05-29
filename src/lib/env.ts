/**
 * Environment variable validation.
 * Import this in layout.tsx or API routes to catch misconfigurations early.
 */

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${name}. Check your .env file.`
    );
  }
  return value;
}

function optionalEnv(name: string, fallback: string = ""): string {
  return process.env[name] || fallback;
}

/** Validate all critical env vars. Call once at app startup. */
export function validateEnv() {
  const errors: string[] = [];

  // Required
  if (!process.env.DATABASE_URL) errors.push("DATABASE_URL");
  if (!process.env.NEXTAUTH_SECRET) errors.push("NEXTAUTH_SECRET");
  if (!process.env.NEXTAUTH_URL) errors.push("NEXTAUTH_URL");

  // Warn (non-fatal)
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "⚠️  GEMINI_API_KEY not set. AI generation will use mock mode."
    );
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️  Google OAuth credentials not set. Google login will be disabled."
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${errors.join(", ")}. ` +
        `Please check your .env file against .env.example.`
    );
  }
}

export const env = {
  DATABASE_URL: requiredEnv("DATABASE_URL"),
  NEXTAUTH_SECRET: requiredEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: optionalEnv("NEXTAUTH_URL", "http://localhost:3000"),
  GEMINI_API_KEY: optionalEnv("GEMINI_API_KEY"),
  GOOGLE_CLIENT_ID: optionalEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: optionalEnv("GOOGLE_CLIENT_SECRET"),
  EMAIL_SERVER: optionalEnv("EMAIL_SERVER"),
  EMAIL_FROM: optionalEnv("EMAIL_FROM", "noreply@proposal.ai"),
};
