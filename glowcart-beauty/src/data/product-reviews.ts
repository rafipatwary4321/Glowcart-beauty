import type { ProductReview } from "@/types/product";

export const productReviews: Record<string, ProductReview[]> = {
  "velvet-rose-hydrating-serum": [
    {
      id: "r1",
      author: "Aisha R.",
      rating: 5,
      date: "2026-05-12",
      comment:
        "My skin feels plump and dewy within a week. The texture is silky and absorbs beautifully.",
      verified: true,
    },
    {
      id: "r2",
      author: "Nadia K.",
      rating: 5,
      date: "2026-04-28",
      comment:
        "Perfect under makeup. No pilling at all. Already on my third bottle.",
      verified: true,
    },
    {
      id: "r3",
      author: "Sarah M.",
      rating: 4,
      date: "2026-04-10",
      comment: "Lovely rose scent and visible glow. Slightly pricey but worth it.",
      verified: true,
    },
  ],
  "luminous-silk-foundation": [
    {
      id: "r4",
      author: "Priya S.",
      rating: 5,
      date: "2026-05-01",
      comment: "Buildable coverage with a natural finish. Lasts all day in humidity.",
      verified: true,
    },
    {
      id: "r5",
      author: "Emma L.",
      rating: 4,
      date: "2026-03-22",
      comment: "Great shade range feel on skin. Blends effortlessly.",
      verified: true,
    },
  ],
  "cloud-soft-cleansing-balm": [
    {
      id: "r6",
      author: "Fatima H.",
      rating: 5,
      date: "2026-05-18",
      comment: "Melts makeup away without stripping. Skin feels soft after rinsing.",
      verified: true,
    },
  ],
};

export function getReviewsForProduct(slug: string): ProductReview[] {
  return productReviews[slug] ?? [
    {
      id: "default-1",
      author: "Verified Buyer",
      rating: 5,
      date: "2026-05-01",
      comment: "Beautiful product quality and packaging. Would recommend to friends.",
      verified: true,
    },
    {
      id: "default-2",
      author: "GlowCart Customer",
      rating: 4,
      date: "2026-04-15",
      comment: "Fast delivery and exactly as described. Happy with my purchase.",
      verified: true,
    },
  ];
}
