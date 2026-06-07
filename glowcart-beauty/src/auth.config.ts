import type { NextAuthConfig } from "next-auth";

import type { UserRole } from "@/types/user";

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "glowcart-dev-auth-secret" : "")
  );
}

/**
 * Edge-compatible Auth.js config.
 * Used by middleware only — no database, bcrypt, or Node-only modules.
 */
export const authConfig = {
  secret: getAuthSecret(),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "customer";
        token.email = user.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = (token.role as UserRole | undefined) ?? "customer";
        if (typeof token.name === "string") session.user.name = token.name;
        if (typeof token.email === "string") session.user.email = token.email;
        if (typeof token.picture === "string") session.user.image = token.picture;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
