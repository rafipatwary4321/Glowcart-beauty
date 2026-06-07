import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPostLoginRedirect } from "@/lib/auth/redirect";
import { isAdminPath, isAuthPath, isProtectedPath } from "@/lib/auth/protected-routes";
import { routes } from "@/constants/routes";

const authRedirectPath = "/auth/redirect";

function isAuthRedirectPath(pathname: string): boolean {
  return pathname === authRedirectPath;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.auth);
  const userRole = request.auth?.user?.role;

  if (isAdminPath(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL(routes.login, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL(routes.profile, request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && isAuthenticated && !isAuthRedirectPath(pathname)) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const destination = getPostLoginRedirect(userRole ?? "customer", callbackUrl);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/cart",
    "/wishlist",
    "/checkout",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/redirect",
  ],
};
