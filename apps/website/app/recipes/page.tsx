import type { Metadata } from "next";
import { RecipesContent } from "./recipes-content";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Practical Accessly patterns for real applications.",
};

export default function RecipesPage() {
  return <RecipesContent />;
}
