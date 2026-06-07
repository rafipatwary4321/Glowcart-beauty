"use client";

import { SessionProvider } from "next-auth/react";

import { AppToaster } from "@/components/ui/sonner";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <AppToaster />
    </SessionProvider>
  );
}
