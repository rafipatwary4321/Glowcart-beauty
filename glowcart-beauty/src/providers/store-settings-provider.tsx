"use client";

import { createContext, useContext } from "react";

import type { PublicSiteSettings } from "@/lib/content/settings-service";

const StoreSettingsContext = createContext<PublicSiteSettings | null>(null);

type StoreSettingsProviderProps = {
  settings: PublicSiteSettings;
  children: React.ReactNode;
};

export function StoreSettingsProvider({ settings, children }: StoreSettingsProviderProps) {
  return (
    <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>
  );
}

export function useStoreSettings(): PublicSiteSettings {
  const settings = useContext(StoreSettingsContext);
  if (!settings) {
    throw new Error("useStoreSettings must be used within StoreSettingsProvider");
  }
  return settings;
}

export function useDeliveryPricing() {
  const settings = useStoreSettings();
  return {
    deliveryCharge: settings.deliveryCharge,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
  };
}
