import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { Category } from "@/models";

export const GET = withDb(async () => {
  const categories = await Category.find({ isActive: true }).sort({
    sortOrder: 1,
    name: 1,
  });

  return apiSuccess(serializeDocuments(categories));
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  if (!body.name || !body.slug) {
    throw new ApiRouteError("Name and slug are required.", 400);
  }

  const category = await Category.create(body);

  return apiSuccess(category, {
    status: 201,
    message: "Category created.",
  });
});
