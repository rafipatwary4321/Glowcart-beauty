import { SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/types";

type RelatedProductsProps = {
  products: Product[];
  className?: string;
};

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className={className}>
      <SectionHeader
        title="You May Also Like"
        subtitle="Curated picks based on this product"
        href="/products"
      />
      <ProductGrid products={products} />
    </section>
  );
}
