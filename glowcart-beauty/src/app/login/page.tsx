import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthLayout, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your GlowCart Beauty account.",
};

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your profile, orders, and saved addresses."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </AuthLayout>
  );
}
