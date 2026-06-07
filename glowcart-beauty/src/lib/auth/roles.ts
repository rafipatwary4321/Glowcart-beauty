import type { Session } from "next-auth";

import type { UserRole } from "@/types/user";

export function getUserRole(session: Session | null | undefined): UserRole | null {
  return session?.user?.role ?? null;
}

export function hasRole(
  session: Session | null | undefined,
  role: UserRole
): boolean {
  return getUserRole(session) === role;
}

export function isAdmin(session: Session | null | undefined): boolean {
  return hasRole(session, "admin");
}

export function isCustomer(session: Session | null | undefined): boolean {
  return hasRole(session, "customer");
}

export function requireRole(
  session: Session | null | undefined,
  role: UserRole
): boolean {
  return hasRole(session, role);
}
