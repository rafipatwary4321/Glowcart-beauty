/**
 * Typed environment variables.
 * Add validation (e.g. zod) when backend is wired up.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  sslcommerzStoreId: process.env.SSLCOMMERZ_STORE_ID ?? "",
  sslcommerzStorePassword: process.env.SSLCOMMERZ_STORE_PASSWORD ?? "",
  bkashAppKey: process.env.BKASH_APP_KEY ?? "",
  bkashAppSecret: process.env.BKASH_APP_SECRET ?? "",
} as const;

export function isProduction(): boolean {
  return env.nodeEnv === "production";
}
