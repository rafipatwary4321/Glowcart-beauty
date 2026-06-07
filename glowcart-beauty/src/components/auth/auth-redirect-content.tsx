"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { routes } from "@/constants/routes";
import { getPostLoginRedirect } from "@/lib/auth/redirect";

export function AuthRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.replace(routes.login);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    const destination = getPostLoginRedirect(session.user.role, callbackUrl);
    router.replace(destination);
    router.refresh();
  }, [session, status, searchParams, router]);

  return (
    <section className="flex min-h-[50vh] items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </section>
  );
}
