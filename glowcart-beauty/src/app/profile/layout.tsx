import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/common/container";
import { ProfileHeader, ProfileNav } from "@/components/profile";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your GlowCart Beauty account.",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(routes.login);
  }

  return (
    <section className="bg-beige-50/30 py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Account
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            My Profile
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ProfileNav />
          </aside>
          <div className="space-y-6">
            <ProfileHeader session={session} />
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
