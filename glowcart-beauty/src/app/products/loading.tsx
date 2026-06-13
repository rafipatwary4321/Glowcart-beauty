import { Container } from "@/components/common/container";
import { ProductGridSkeleton } from "@/components/home/skeletons";

export default function ProductsLoading() {
  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-3 sm:mb-10">
          <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-56 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-lg bg-muted" />
        </div>
        <ProductGridSkeleton />
      </Container>
    </section>
  );
}
