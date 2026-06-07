"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/constants/routes";

type SocialLoginProps = {
  callbackUrl?: string;
  googleEnabled?: boolean;
};

export function SocialLogin({
  callbackUrl = routes.authRedirect,
  googleEnabled = false,
}: SocialLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
          or continue with
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-full"
        onClick={handleGoogleSignIn}
        disabled={loading || !googleEnabled}
      >
        {loading ? "Connecting..." : "Continue with Google"}
      </Button>

      {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

      {!googleEnabled ? (
        <p className="text-center text-xs text-muted-foreground">
          Google sign-in requires{" "}
          <code className="rounded bg-muted px-1 py-0.5">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5">GOOGLE_CLIENT_SECRET</code> in your
          environment.
        </p>
      ) : null}
    </div>
  );
}
