import { toast } from "sonner";

import type { DataSource } from "@/lib/admin/api-client";

let hasShownFallbackReadToast = false;

export function notifyMutationResult(options: {
  ok: boolean;
  source: DataSource;
  successMessage: string;
  error?: string;
  message?: string;
}) {
  if (!options.ok) {
    toast.error(options.error ?? "Something went wrong.");
    return;
  }

  if (options.source === "fallback") {
    toast.warning(options.message ?? "Saved locally — database unavailable.");
    return;
  }

  toast.success(options.message ?? options.successMessage);
}

export function notifyFallbackRead(source: DataSource) {
  if (source === "fallback" && !hasShownFallbackReadToast) {
    hasShownFallbackReadToast = true;
    toast.message("Showing sample data — database unavailable.");
  }
}
