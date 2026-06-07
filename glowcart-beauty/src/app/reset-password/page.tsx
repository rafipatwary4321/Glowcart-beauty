import type { Metadata } from "next";

import { AuthLayout, ResetPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your GlowCart Beauty account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter a new password for your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
