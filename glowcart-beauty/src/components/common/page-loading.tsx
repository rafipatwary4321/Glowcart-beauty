import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

type PageLoadingProps = {
  title?: string;
};

export function PageLoading({ title = "Loading" }: PageLoadingProps) {
  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30 py-16 sm:py-20">
      <Container className="max-w-4xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-md rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <p className="sr-only">{title}</p>
      </Container>
    </section>
  );
}
