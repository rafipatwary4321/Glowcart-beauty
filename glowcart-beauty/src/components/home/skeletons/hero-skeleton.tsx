import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-rose-50 via-beige-50 to-white py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-5">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-12 w-full max-w-lg" />
            <Skeleton className="h-12 w-3/4 max-w-md" />
            <Skeleton className="h-16 w-full max-w-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
            <div className="flex gap-8 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-7 w-14" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
        </div>
      </Container>
    </section>
  );
}
