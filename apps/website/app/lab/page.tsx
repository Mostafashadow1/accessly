import type { Metadata } from "next";
import { ShowcasesContent } from "../showcases/showcases-content";

export const metadata: Metadata = {
  title: "Accessly Lab",
  description:
    "Interactive playground — test permissions against any backend JSON.",
};

export default function LabPage() {
  return <ShowcasesContent />;
}
