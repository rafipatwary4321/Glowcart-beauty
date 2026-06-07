import type { Metadata } from "next";

import { AuthLayout, RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your GlowCart Beauty account.",
};

export default function RegisterPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <AuthLayout
      title="Create your account"
      description="Join GlowCart Beauty for a personalized skincare and makeup experience."
    >
      <RegisterForm googleEnabled={googleEnabled} />
    </AuthLayout>
  );
}
