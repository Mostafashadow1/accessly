import type { Metadata } from "next";
import { LabShell } from "@/components/lab/lab-shell";

export const metadata: Metadata = {
  title: "Accessly Lab — Permission Debugging Playground",
  description:
    "Paste a backend response, choose a permission, and watch Accessly explain exactly why it's allowed or denied. A guided developer tool for understanding permission decisions.",
};

export default function LabPage() {
  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-6 md:py-12">
      <LabShell />
    </div>
  );
}
