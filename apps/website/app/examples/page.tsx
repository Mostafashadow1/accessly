import type { Metadata } from "next";
import { GalleryPage } from "@/components/examples/gallery-page";

export const metadata: Metadata = {
  title: "Integration Gallery",
  description:
    "Real-world Accessly usage across multiple app patterns. Each example tests different APIs through practical mini applications.",
};

export default function ExamplesPage() {
  return <GalleryPage />;
}
