import type { MetadataRoute } from "next";
import { docsPageSlugs } from "@/data/docs-pages";

const SITE_URL = "https://accessly-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["", "/docs", "/docs/ai", "/docs/use-cases", "/lab"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority: path === "" ? 1 : 0.7,
    })),
    ...docsPageSlugs.map((slug) => ({
      url: `${SITE_URL}/docs/${slug}`,
      lastModified,
      priority: 0.6,
    })),
  ];
}
