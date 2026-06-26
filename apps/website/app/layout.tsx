import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Accessly — Explainable access control for React",
  description:
    "Permission checks that explain themselves. Normalize any backend, gate any UI. Open-source, TypeScript, tree-shakeable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
