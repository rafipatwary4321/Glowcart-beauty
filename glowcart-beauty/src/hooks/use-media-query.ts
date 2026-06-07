"use client";

import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
