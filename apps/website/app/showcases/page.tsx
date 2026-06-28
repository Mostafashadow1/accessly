import type { Metadata } from "next";
import { ShowcasesContent } from "./showcases-content";

export const metadata: Metadata = {
  title: "Accessly Lab — Interactive Auth Playground",
  description:
    "Paste backend responses, inspect permission decisions, simulate loading, and copy-paste integration code. Accessly's interactive auth laboratory.",
};

export default function ShowcasesPage() {
  return <ShowcasesContent />;
}
