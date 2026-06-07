"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { validateResetPasswordForm } from "@/lib/auth/validation";

export function ResetPasswordForm() {
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

    setErrors({});
    setLoading(true);

    /**
     * Placeholder only — token validation and password update come with backend auth.
     */
    await new Promise((resolve) => setTimeout(resolve, 600));

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your password has been updated in this placeholder flow.
        </p>
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

      <Button type="submit" className="w-full rounded-full" disabled={loading}>
        {loading ? "Updating..." : "Reset Password"}
      </Button>
    </form>
  );
}
