import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30">
      <Container className="py-8 sm:py-12 lg:py-16">
        <Skeleton className="mb-8 h-4 w-64 rounded-lg" />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}
