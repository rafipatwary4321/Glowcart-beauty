import type { Metadata } from "next";

import { BlogListing } from "@/components/blog/blog-listing";
import { Container } from "@/components/common/container";
import { getPublishedBlogs } from "@/lib/blog/service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Beauty Blog",
    description:
      "Skincare routines, makeup tips, and glow guides from the GlowCart Beauty editorial team.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Beauty Journal</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Tips, Trends & Glow Guides
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Expert beauty advice, ingredient spotlights, and routines curated for radiant skin.
          </p>
        </div>
        <BlogListing posts={posts} />
      </Container>
    </section>
  );
}
