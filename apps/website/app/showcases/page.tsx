import type { Metadata } from "next";
import { ShowcasesContent } from "./showcases-content";

export const metadata: Metadata = {
  title: "Showcases",
  description:
    "See Accessly in action: route guards, nav filtering, and list gating.",
};

export default function ShowcasesPage() {
  return <ShowcasesContent />;
}
