/**
 * Local embedded MongoDB for development when MONGODB_URI is not configured.
 * Keeps running until stopped (Ctrl+C). Writes MONGODB_URI to .env.local.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { MongoMemoryServer } from "mongodb-memory-server";

function upsertEnvLocal(key: string, value: string) {
  const envPath = resolve(process.cwd(), ".env.local");
  const line = `${key}=${value}`;
  let content = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    content = content.replace(pattern, line);
  } else {
    content = `${content.trimEnd()}\n${line}\n`;
  }

  writeFileSync(envPath, content, "utf8");
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  upsertEnvLocal("MONGODB_URI", uri);

  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    upsertEnvLocal("AUTH_SECRET", "glowcart-dev-auth-secret-local");
  }

  console.log("[dev-mongo] Embedded MongoDB started.");
  console.log("[dev-mongo] MONGODB_URI saved to .env.local");
  console.log("[dev-mongo] Restart `npm run dev`, then run `npm run seed`.");
  console.log("[dev-mongo] Press Ctrl+C to stop.");

  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error("[dev-mongo] Failed:", error);
  process.exit(1);
});
