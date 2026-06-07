"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";

import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { getPostLoginRedirect } from "@/lib/auth/redirect";
import { validateLoginForm } from "@/lib/auth/validation";

const REMEMBER_EMAIL_KEY = "glowcart-remember-email";

type LoginFormProps = {
  googleEnabled?: boolean;
};

export function LoginForm({ googleEnabled = false }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const registered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(REMEMBER_EMAIL_KEY));
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validation = validateLoginForm({ email, password });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    if (rememberMe) {
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
    } else {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setFormError("Invalid email or password.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role ?? "customer";
    const destination = getPostLoginRedirect(role, callbackUrl);

    setLoading(false);
    router.push(destination);
    router.refresh();
  }

  const socialCallbackUrl = callbackUrl
    ? `${routes.authRedirect}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : routes.authRedirect;

  return (
    <div className="space-y-6">
      {registered ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Account created successfully. Sign in to continue.
        </p>
      ) : null}

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href={routes.forgotPassword}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            placeholder="••••••••"
            className="h-10 rounded-full px-4"
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password}</p>
          ) : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="size-4 rounded border-input accent-primary"
          />
          Remember me
        </label>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <SocialLogin callbackUrl={socialCallbackUrl} googleEnabled={googleEnabled} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={routes.register} className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
