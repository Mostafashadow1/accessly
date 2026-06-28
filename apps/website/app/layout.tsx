import type { Metadata, Viewport } from "next";
import type React from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://accessly.dev"),
  title: {
    default: "Accessly — Explainable access control for React",
    template: "%s | Accessly",
  },
  description:
    "React-first access control with backend adapters, permission components, hooks, navigation filtering, and explainable allow/deny decisions.",
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
  icons: {
    icon: "/brand/accesly-logo.webp",
    shortcut: "/brand/accesly-logo.webp",
    apple: "/brand/accesly-logo.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Accessly",
    title: "Accessly — Explainable access control for React",
    description:
      "React-first access control with backend adapters, permission components, hooks, navigation filtering, and explainable allow/deny decisions.",
    images: [
      {
        url: "/og/accessly-og.webp",
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
      "React-first access control with backend adapters, permission components, hooks, navigation filtering, and explainable allow/deny decisions.",
    images: ["/og/accessly-og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

/* ── Layout ── */

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
