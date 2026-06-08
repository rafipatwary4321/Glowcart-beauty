import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Container } from "@/components/common/container";
import {
  ProductGallery,
  ProductInfo,
  RelatedProducts,
  ReviewList,
} from "@/components/product";
import { Separator } from "@/components/ui/separator";
import { getReviewsForProduct } from "@/data/product-reviews";
import {
  getPublicProductBySlug,
  getPublicProducts,
  getPublicRelatedProducts,
} from "@/lib/catalog/service";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) notFound();

  const reviews = getReviewsForProduct(slug);
  const related = await getPublicRelatedProducts(product);

  return (
    <div className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30">
      <Container className="py-8 sm:py-12 lg:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/products" className="transition-colors hover:text-primary">
            Products
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>

        <Separator className="my-12 bg-border/60" />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium text-foreground">
              Ingredients
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.ingredients}
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium text-foreground">
              How to Use
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.howToUse}
            </p>
          </div>
        </div>

        <Separator className="my-12 bg-border/60" />

        <ReviewList
          reviews={reviews}
          averageRating={product.rating}
          totalCount={product.reviewCount}
        />

        <Separator className="my-12 bg-border/60" />

        <RelatedProducts products={related} />
      </Container>
    </div>
  );
}
