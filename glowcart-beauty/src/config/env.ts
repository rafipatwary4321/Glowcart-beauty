/**
 * Typed environment variables.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI ?? "",
  databaseUrl: process.env.DATABASE_URL ?? process.env.MONGODB_URI ?? "",
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
  authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? "",
  googleClientSecret:
    process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? "",
  adminEmail:
    process.env.ADMIN_EMAIL ??
    process.env.ADMIN_SEED_EMAIL ??
    "admin@glowcart.com",
  adminPassword:
    process.env.ADMIN_PASSWORD ??
    process.env.ADMIN_SEED_PASSWORD ??
    "admin1234",
  adminName: process.env.ADMIN_SEED_NAME ?? "GlowCart Admin",
  cloudinaryCloudName:
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  sslcommerzStoreId: process.env.SSLCOMMERZ_STORE_ID ?? "",
  sslcommerzStorePassword: process.env.SSLCOMMERZ_STORE_PASSWORD ?? "",
  bkashAppKey: process.env.BKASH_APP_KEY ?? "",
  bkashAppSecret: process.env.BKASH_APP_SECRET ?? "",
} as const;

export function isProduction(): boolean {
  return env.nodeEnv === "production";
}

export function isDevelopment(): boolean {
  return env.nodeEnv === "development";
}
