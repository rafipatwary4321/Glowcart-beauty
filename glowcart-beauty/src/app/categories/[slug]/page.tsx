import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/common/container";
import { ProductListing } from "@/components/product";
import {
  getPublicBrands,
  getPublicCategories,
  getPublicCategoryBySlug,
  getPublicProductsByCategorySlug,
  toBrandOptions,
  toCategoryOptions,
} from "@/lib/catalog/service";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
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
  const category = await getPublicCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories, brands] = await Promise.all([
    getPublicProductsByCategorySlug(category.slug),
    getPublicCategories(),
    getPublicBrands(),
  ]);

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
          products={products}
          categories={toCategoryOptions(categories)}
          brands={toBrandOptions(brands)}
          initialFilters={{ category: category.slug, brand: "", skinConcern: "", sort: "latest" }}
        />
      </Container>
    </section>
  );
}
