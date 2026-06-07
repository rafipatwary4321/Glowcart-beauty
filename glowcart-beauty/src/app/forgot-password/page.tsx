import type { Metadata } from "next";

import { AuthLayout, ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your GlowCart Beauty account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
