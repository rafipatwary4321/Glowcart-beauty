import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAuthPath, isProtectedPath } from "@/lib/auth/protected-routes";
import { routes } from "@/constants/routes";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.auth);

  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(routes.profile, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
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
