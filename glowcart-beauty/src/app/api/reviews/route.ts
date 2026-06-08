export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { Product, Review } from "@/models";

export const GET = withDb(async () => {
  const session = await auth();
  if (!isAdmin(session)) {
    throw new ApiRouteError("Admin access required.", 403);
  }

  const reviews = await Review.find()
    .populate({ path: "product", select: "name slug", model: Product })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const items = reviews.map((review) => {
    const product = review.product as { name?: string; slug?: string } | null;

    return {
      id: review._id.toString(),
      productName: product?.name ?? "Unknown product",
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      verified: review.verified,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
    };
  });

  return apiSuccess({ items });
});
