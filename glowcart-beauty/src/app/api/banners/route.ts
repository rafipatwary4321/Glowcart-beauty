import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { Banner } from "@/models";

function isBannerActive(banner: {
  isActive: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
}): boolean {
  if (!banner.isActive) return false;

  const now = new Date();
  if (banner.startsAt && banner.startsAt > now) return false;
  if (banner.expiresAt && banner.expiresAt < now) return false;

  return true;
}

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const filter: Record<string, unknown> = { isActive: true };
  if (type) filter.type = type;

  const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  const activeBanners = banners.filter(isBannerActive);

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
