/**
 * NextAuth configuration and helpers.
 * Wire up when auth providers are configured.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
} as const;
