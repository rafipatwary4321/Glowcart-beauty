/**
 * Typed environment variables.
 * Add validation (e.g. zod) when backend is wired up.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "",
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
  authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? "",
  googleClientSecret:
    process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? "",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  sslcommerzStoreId: process.env.SSLCOMMERZ_STORE_ID ?? "",
  sslcommerzStorePassword: process.env.SSLCOMMERZ_STORE_PASSWORD ?? "",
  bkashAppKey: process.env.BKASH_APP_KEY ?? "",
  bkashAppSecret: process.env.BKASH_APP_SECRET ?? "",
} as const;

export function isProduction(): boolean {
  return env.nodeEnv === "production";
}
