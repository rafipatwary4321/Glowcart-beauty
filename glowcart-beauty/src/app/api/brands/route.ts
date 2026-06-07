import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { Brand } from "@/models";

export const GET = withDb(async () => {
  const brands = await Brand.find({ isActive: true }).sort({
    sortOrder: 1,
    name: 1,
  });

  return apiSuccess(serializeDocuments(brands));
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  if (!body.name || !body.slug) {
    throw new ApiRouteError("Name and slug are required.", 400);
  }

  const brand = await Brand.create(body);

  return apiSuccess(brand, {
    status: 201,
    message: "Brand created.",
  });
});
