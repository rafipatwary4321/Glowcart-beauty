import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { authConfig } from "@/auth.config";
import { authenticateUser, findOrCreateOAuthUser, findUserById } from "@/lib/auth/user-service";
import { connectDB } from "@/lib/db";
import type { UserRole } from "@/types/user";

function getAuthSecret(): string {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? "glowcart-dev-auth-secret" : "");

  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  if (!secret && process.env.NODE_ENV === "production" && !isBuildPhase) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be set in production.");
  }

  return secret || "glowcart-build-auth-secret-placeholder";
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

      try {
        await connectDB();
        const user = await authenticateUser(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      } catch {
        return null;
      }
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.unshift(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: false,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getAuthSecret(),
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email ?? profile?.email;
      if (!email || typeof email !== "string") {
        return false;
      }

      try {
        await connectDB();
        const dbUser = await findOrCreateOAuthUser({
          email,
          name: user.name ?? profile?.name,
          image: user.image ?? (typeof profile?.picture === "string" ? profile.picture : null),
        });

        user.id = dbUser.id;
        user.role = dbUser.role;
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "customer";
        token.email = user.email ?? token.email;
      }

      if (account?.provider === "google" && user?.email && !token.id) {
        try {
          await connectDB();
          const dbUser = await findOrCreateOAuthUser({
            email: user.email,
            name: user.name,
            image: user.image,
          });
          token.id = dbUser.id;
          token.role = dbUser.role;
        } catch {
          token.role = "customer";
        }
      }

      if (trigger === "update" && token.id) {
        try {
          await connectDB();
          const dbUser = await findUserById(String(token.id));
          if (dbUser) {
            token.role = dbUser.role as UserRole;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
          }
        } catch {
          // Keep existing token on refresh failure.
        }
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
});
