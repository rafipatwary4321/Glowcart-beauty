import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAdminPath, isAuthPath, isProtectedPath } from "@/lib/auth/protected-routes";
import { routes } from "@/constants/routes";

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
      return NextResponse.redirect(new URL(routes.home, request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && isAuthenticated) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && isAdminPath(callbackUrl) && userRole === "admin") {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.redirect(new URL(routes.profile, request.url));
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
  ],
};
