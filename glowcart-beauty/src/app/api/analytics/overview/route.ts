export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { parseAnalyticsRange } from "@/lib/analytics/date-range";
import { getAnalyticsOverview } from "@/lib/analytics/service";

export const GET = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const { searchParams } = new URL(request.url);
  const range = parseAnalyticsRange(searchParams.get("range"));
  const data = await getAnalyticsOverview(range);

  return apiSuccess(data);
});
