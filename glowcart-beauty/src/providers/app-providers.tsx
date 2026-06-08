"use client";

import { SessionProvider } from "next-auth/react";

import { AppToaster } from "@/components/ui/sonner";
import type { PublicSiteSettings } from "@/lib/content/settings-service";
import { StoreSettingsProvider } from "@/providers/store-settings-provider";

type AppProvidersProps = {
  children: React.ReactNode;
  settings: PublicSiteSettings;
};

export function AppProviders({ children, settings }: AppProvidersProps) {
  return (
    <SessionProvider>
      <StoreSettingsProvider settings={settings}>
        {children}
        <AppToaster />
      </StoreSettingsProvider>
    </SessionProvider>
  );
}
