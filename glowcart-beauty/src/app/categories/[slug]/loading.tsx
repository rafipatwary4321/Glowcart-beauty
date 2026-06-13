import { Container } from "@/components/common/container";
import { ProductGridSkeleton } from "@/components/home/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-3 sm:mb-10">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded-lg" />
        </div>
        <ProductGridSkeleton />
      </Container>
    </section>
  );
}
