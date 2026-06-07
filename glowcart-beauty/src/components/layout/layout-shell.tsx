"use client";

import { usePathname } from "next/navigation";

import { StorefrontLayout } from "@/components/layout/storefront-layout";

type LayoutShellProps = {
  children: React.ReactNode;
};

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <StorefrontLayout>{children}</StorefrontLayout>;
}
