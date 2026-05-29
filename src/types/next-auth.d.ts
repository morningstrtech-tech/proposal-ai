// Type augmentation for NextAuth session
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: "FREE" | "PRO" | "ULTRA";
      generationCount: number;
    };
  }

  interface User {
    plan: "FREE" | "PRO" | "ULTRA";
    generationCount: number;
  }
}
