import { Suspense } from "react";

import { AuthRedirectContent } from "@/components/auth/auth-redirect-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-3 text-center">
            <Skeleton className="mx-auto size-10 rounded-full" />
            <Skeleton className="mx-auto h-4 w-40" />
            <p className="text-sm text-muted-foreground">Signing you in...</p>
          </div>
        </section>
      }
    >
      <AuthRedirectContent />
    </Suspense>
  );
}
