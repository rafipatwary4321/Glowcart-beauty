import { ApiRouteError, apiError, apiSuccess, withDb } from "@/lib/api";
import {
  isBannerActive,
  serializeBanner,
  serializeBanners,
} from "@/lib/api/banner-serializer";
import { connectDB, DbConnectionError } from "@/lib/db";

export const runtime = "nodejs";

import { Banner } from "@/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const type = searchParams.get("type");

  try {
    await connectDB();

    const filter: Record<string, unknown> = isAdmin ? {} : { isActive: true };
    if (type) filter.type = type;

    const banners = await Banner.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
    const serialized = serializeBanners(banners);

    if (isAdmin) {
      return apiSuccess(serialized);
    }

    const activeBanners = serialized.filter((banner) => isBannerActive(banner));
    return apiSuccess(activeBanners);
  } catch (error) {
    if (error instanceof DbConnectionError) {
      return apiSuccess([]);
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[api/banners] GET failed:", error);
    }

    return apiError("Failed to load banners", {
      status: 500,
      details:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : undefined,
    });
  }
}

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  if (!body.title) {
    throw new ApiRouteError("Banner title is required.", 400);
  }

  const banner = await Banner.create(body);
  const serialized = serializeBanner(banner);

  if (!serialized) {
    throw new ApiRouteError("Unable to serialize created banner.", 500);
  }

  return apiSuccess(serialized, {
    status: 201,
    message: "Banner created.",
  });
});
