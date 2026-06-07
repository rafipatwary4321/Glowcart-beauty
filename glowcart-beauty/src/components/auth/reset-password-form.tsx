"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { validateResetPasswordForm } from "@/lib/auth/validation";

function ResetPasswordFormInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateResetPasswordForm({ password, confirmPassword });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (!token) {
      toast.error("Reset token is missing or invalid.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Unable to reset password.");
      }
      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">Your password has been updated.</p>
        <Button asChild className="w-full rounded-full">
          <Link href={routes.login}>Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          New password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          placeholder="At least 8 characters"
          className="h-10 rounded-full px-4"
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm new password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          placeholder="Repeat your password"
          className="h-10 rounded-full px-4"
        />
        {errors.confirmPassword ? (
          <p className="text-xs text-destructive">{errors.confirmPassword}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full rounded-full" disabled={loading || !token}>
        {loading ? "Updating..." : "Reset Password"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading reset form...</p>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
