"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
type SocialLoginProps = {
  callbackUrl?: string;
  googleEnabled?: boolean;
};

export function SocialLogin({ callbackUrl = "/profile", googleEnabled = false }: SocialLoginProps) {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
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
        Continue with Google
      </Button>

      {!googleEnabled ? (
        <p className="text-center text-xs text-muted-foreground">
          Google sign-in is configured but requires{" "}
          <code className="rounded bg-muted px-1 py-0.5">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5">GOOGLE_CLIENT_SECRET</code> in your
          environment.
        </p>
      ) : null}
    </div>
  );
}
