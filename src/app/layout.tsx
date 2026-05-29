import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "PROPOSAL.AI — Generator Proposal Profesional",
  description:
    "Buat proposal bisnis, proyek, dan penelitian kelas dunia dalam hitungan detik dengan AI.",
  keywords: [
    "proposal",
    "generator",
    "AI",
    "bisnis",
    "proyek",
    "penelitian",
    "proposal maker",
    "proposal generator",
  ],
  authors: [{ name: "PROPOSAL.AI" }],
  creator: "PROPOSAL.AI",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "PROPOSAL.AI — Generator Proposal Profesional",
    description:
      "Buat proposal bisnis, proyek, dan penelitian kelas dunia dalam hitungan detik.",
    type: "website",
    locale: "id_ID",
    siteName: "PROPOSAL.AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PROPOSAL.AI — Generator Proposal Profesional",
    description:
      "Buat proposal bisnis, proyek, dan penelitian kelas dunia dalam hitungan detik.",
  },
  icons: {
    icon: [
      { url: "/logopm.webp", type: "image/webp" },
    ],
    apple: "/logopm.webp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
