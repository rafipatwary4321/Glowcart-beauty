import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminLayoutShell } from "@/components/admin";
import { routes } from "@/constants/routes";
import { isAdmin } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | GlowCart Beauty",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(`${routes.login}?callbackUrl=${routes.admin.root}`);
  }

  if (!isAdmin(session)) {
    redirect(routes.home);
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
