import { routes } from "@/constants/routes";
import type { UserRole } from "@/types/user";

import { isAdminPath } from "./protected-routes";

function isSafeInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export function getPostLoginRedirect(
  role: UserRole,
  callbackUrl?: string | null
): string {
  if (callbackUrl && isSafeInternalPath(callbackUrl)) {
    if (role === "admin") {
      if (isAdminPath(callbackUrl) || !isAdminPath(callbackUrl)) {
        return callbackUrl;
      }
    } else if (!isAdminPath(callbackUrl)) {
      return callbackUrl;
    }
  }

  return role === "admin" ? routes.admin.root : routes.profile;
}

export function getDefaultAuthCallbackUrl(role: UserRole): string {
  return role === "admin" ? routes.admin.root : routes.profile;
}
