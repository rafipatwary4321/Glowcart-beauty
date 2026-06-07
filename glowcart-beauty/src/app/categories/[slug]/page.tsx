import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/common/container";
import { ProductListing } from "@/components/product";
import { featuredCategories } from "@/data/categories";
import { products } from "@/data/products";
import { connectDB } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Category } from "@/models";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCategory(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (category) {
      return {
        name: category.name,
        slug: category.slug,
        description: category.description || `Shop ${category.name} at GlowCart Beauty.`,
        imageUrl: category.imageUrl,
      };
    }
  } catch {
    // fallback below
  }

  const fallback = featuredCategories.find((item) => item.slug === slug);
  if (!fallback) return null;

  return {
    name: fallback.name,
    slug: fallback.slug,
    description: fallback.description,
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return buildPageMetadata({
    title: `${category.name} Products`,
    description: category.description,
    path: `/categories/${category.slug}`,
    image: category.imageUrl ?? undefined,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const filtered = products.filter(
    (product) => product.categorySlug === category.slug || product.category.toLowerCase().replace(/\s+/g, "-") === category.slug
  );

  const categories = featuredCategories.map((item) => ({
    name: item.name,
    slug: item.slug,
  }));

  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-2 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Category</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {category.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{category.description}</p>
        </div>
        <ProductListing
          products={filtered.length ? filtered : products}
          categories={categories}
          initialFilters={{ category: category.slug, brand: "", skinConcern: "", sort: "latest" }}
        />
      </Container>
    </section>
  );
}
