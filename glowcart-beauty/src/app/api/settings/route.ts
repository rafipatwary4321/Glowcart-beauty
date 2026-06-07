export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { getSiteSettings, upsertSiteSettings } from "@/lib/content/settings-service";
import type { PublicSiteSettings } from "@/lib/content/settings-service";

export const GET = withDb(async () => {
  const settings = await getSiteSettings();
  return apiSuccess(settings);
});

export const PUT = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const body = (await request.json()) as Partial<PublicSiteSettings>;
  await upsertSiteSettings(body);
  const settings = await getSiteSettings();

  return apiSuccess(settings, { message: "Settings saved." });
});
