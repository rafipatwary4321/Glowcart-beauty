export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { getAdminDashboardStats } from "@/lib/admin/dashboard-service";

export const GET = withDb(async () => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const stats = await getAdminDashboardStats();
  return apiSuccess(stats);
});
