import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/common/container";
import { ProductListing } from "@/components/product";
import { topBrands } from "@/data/brands";
import { featuredCategories } from "@/data/categories";
import { products } from "@/data/products";
import { connectDB } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Brand } from "@/models";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

async function getBrand(slug: string) {
  try {
    await connectDB();
    const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (brand) {
      return {
        name: brand.name,
        slug: brand.slug,
        description: brand.tagline || `Discover ${brand.name} at GlowCart Beauty.`,
        imageUrl: brand.imageUrl,
      };
    }
  } catch {
    // fallback below
  }

  const fallback = topBrands.find((item) => item.slug === slug);
  if (!fallback) return null;

  return {
    name: fallback.name,
    slug: fallback.slug,
    description: fallback.tagline,
  };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Brand Not Found" };

  return buildPageMetadata({
    title: `${brand.name} Collection`,
    description: brand.description,
    path: `/brands/${brand.slug}`,
    image: brand.imageUrl ?? undefined,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const filtered = products.filter(
    (product) => product.brandSlug === brand.slug || product.brand.toLowerCase().replace(/\s+/g, "-") === brand.slug
  );

  const categories = featuredCategories.map((item) => ({
    name: item.name,
    slug: item.slug,
  }));

  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-2 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Brand</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {brand.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{brand.description}</p>
        </div>
        <ProductListing
          products={filtered.length ? filtered : products}
          categories={categories}
          initialFilters={{ category: "", brand: brand.slug, skinConcern: "", sort: "latest" }}
        />
      </Container>
    </section>
  );
}
