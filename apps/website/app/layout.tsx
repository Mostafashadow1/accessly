import type { Metadata, Viewport } from "next";
import type React from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/* ── Font Loading ───────────────────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://accessly.dev"),
  title: {
    default: "Accessly — Explainable access control for React",
    template: "%s | Accessly",
  },
  description:
    "Permission checks that explain themselves. Normalize any backend, gate any UI. Open-source, TypeScript, tree-shakeable.",
  keywords: [
    "react",
    "access control",
    "permissions",
    "RBAC",
    "feature flags",
    "TypeScript",
    "open source",
    "authorization",
  ],
  authors: [{ name: "Accessly" }],
  creator: "Accessly",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Accessly",
    title: "Accessly — Explainable access control for React",
    description:
      "Permission checks that explain themselves. Normalize any backend, gate any UI. Open-source, TypeScript, tree-shakeable.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Accessly — Explainable access control for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessly — Explainable access control for React",
    description:
      "Permission checks that explain themselves. Normalize any backend, gate any UI.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

/* ── Layout ─────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
