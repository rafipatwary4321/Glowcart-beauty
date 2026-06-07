"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-border/60 shadow-lg",
        },
      }}
    />
  );
}
