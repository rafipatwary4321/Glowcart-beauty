"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { validateForgotPasswordForm } from "@/lib/auth/validation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateForgotPasswordForm({ email });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    /**
     * Placeholder only — no email is sent until backend auth is implemented.
     */
    await new Promise((resolve) => setTimeout(resolve, 600));

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{email}</span>,
          you&apos;ll receive a password reset link shortly.
        </p>
        <p className="text-xs text-muted-foreground">
          This is a placeholder flow. Email delivery will be wired up with the backend.
        </p>
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href={routes.login}>Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          placeholder="you@example.com"
          className="h-10 rounded-full px-4"
        />
        {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
      </div>

      <Button type="submit" className="w-full rounded-full" disabled={loading}>
        {loading ? "Sending link..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href={routes.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
