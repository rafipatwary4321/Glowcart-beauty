import { routes } from "@/constants/routes";

export const protectedRoutes = [
  routes.profile,
  routes.cart,
  routes.wishlist,
  routes.checkout,
] as const;

export const authRoutes = [
  routes.login,
  routes.register,
  routes.forgotPassword,
  routes.resetPassword,
] as const;

export const adminRoutePrefix = routes.admin.root;

export function isAdminPath(pathname: string): boolean {
  return pathname === adminRoutePrefix || pathname.startsWith(`${adminRoutePrefix}/`);
}

export function isProtectedPath(pathname: string): boolean {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isAuthPath(pathname: string): boolean {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
