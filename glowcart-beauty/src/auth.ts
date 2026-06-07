import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { authConfig } from "@/lib/auth";
import { findMockUserByEmail } from "@/lib/auth/mock-users";
import type { UserRole } from "@/types/user";

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "glowcart-dev-auth-secret" : "")
  );
}

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email;
      const password = credentials?.password;

      if (typeof email !== "string" || typeof password !== "string") {
        return null;
      }

      const user = findMockUserByEmail(email);

      if (!user || user.password !== password) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.unshift(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getAuthSecret(),
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "customer";
      }

      if (account?.provider === "google" && !token.role) {
        token.role = "customer" satisfies UserRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = (token.role as UserRole | undefined) ?? "customer";
      }
      return session;
    },
  },
});
