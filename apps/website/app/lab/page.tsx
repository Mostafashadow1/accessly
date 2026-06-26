import type { Metadata } from "next";
import { LabContent } from "./lab-content";

export const metadata: Metadata = {
  title: "Accessly Lab",
  description:
    "Interactive playground — test permissions against any backend JSON.",
};

export default function LabPage() {
  return <LabContent />;
}
