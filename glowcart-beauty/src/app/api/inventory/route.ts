export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import {
  adjustProductStock,
  getInventorySnapshot,
  getLowStockProducts,
} from "@/lib/inventory";
import { StockHistory } from "@/models";
import { z } from "zod";

export const GET = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");

  if (view === "history") {
    const productId = searchParams.get("productId");
    const filter = productId ? { product: productId } : {};
    const history = await StockHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("product", "name slug")
      .populate("order", "orderNumber");

    return apiSuccess({ items: serializeDocuments(history) });
  }

  if (view === "low-stock") {
    const products = await getLowStockProducts(20);
    return apiSuccess({
      items: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        stock: product.stock,
        reservedStock: product.reservedStock,
        availableStock: product.availableStock,
        lowStockThreshold: product.lowStockThreshold,
      })),
    });
  }

  const items = await getInventorySnapshot();
  return apiSuccess({ items });
});

const updateSchema = z.object({
  productId: z.string().min(1),
  stock: z.number().int().min(0),
  note: z.string().optional(),
});

export const PATCH = withDb(async (request: Request) => {
  const session = await auth();
  if (!isAdmin(session)) throw new ApiRouteError("Admin access required.", 403);

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) throw new ApiRouteError("Invalid inventory payload.", 400);

  const product = await adjustProductStock(parsed.data.productId, parsed.data.stock, {
    note: parsed.data.note,
    createdBy: session?.user?.id,
  });

  return apiSuccess({
    id: product._id.toString(),
    stock: product.stock,
    reservedStock: product.reservedStock,
    availableStock: product.availableStock,
  }, { message: "Stock updated." });
});
