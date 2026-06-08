import type { HeroContent } from "@/types";

export const heroContent: HeroContent = {
  badge: "Spring Collection 2026",
  title: "Where luxury meets",
  titleAccent: "everyday radiance",
  description:
    "Premium skincare, makeup, and fragrances — thoughtfully curated for skin that glows and confidence that lasts.",
  primaryCta: { label: "Shop Collection", href: "/shop" },
  secondaryCta: { label: "Skincare Essentials", href: "/shop/skincare" },
  stats: [
    { value: "500+", label: "Premium Products" },
    { value: "50K+", label: "Happy Customers" },
    { value: "4.9★", label: "Average Rating" },
  ],
  featured: {
    eyebrow: "Editor's Pick",
    title: "Velvet Rose Hydrating Serum",
    description: "Deep hydration with a dewy, luminous finish",
  },
};
