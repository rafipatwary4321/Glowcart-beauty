import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { Banner } from "@/models";

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const type = searchParams.get("type");

  const filter: Record<string, unknown> = isAdmin ? {} : { isActive: true };
  if (type) filter.type = type;

  const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });

  if (isAdmin) {
    return apiSuccess(serializeDocuments(banners));
  }

  const now = new Date();
  const activeBanners = banners.filter((banner) => {
    if (!banner.isActive) return false;
    if (banner.startsAt && banner.startsAt > now) return false;
    if (banner.expiresAt && banner.expiresAt < now) return false;
    return true;
  });

  return apiSuccess(serializeDocuments(activeBanners));
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  if (!body.title) {
    throw new ApiRouteError("Banner title is required.", 400);
  }

  const banner = await Banner.create(body);

  return apiSuccess(banner, {
    status: 201,
    message: "Banner created.",
  });
});
