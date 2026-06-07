import { Product, StockHistory } from "@/models";
import type { ProductDocument } from "@/models/Product";
import type { OrderDocument } from "@/models/Order";
import type { Types } from "mongoose";

type OrderItemRef = {
  product: Types.ObjectId | string;
  quantity: number;
};

type HistoryMeta = {
  orderId?: string;
  note?: string;
  createdBy?: string;
  changeType: "reserve" | "release" | "commit" | "adjustment";
};

function getStockValues(product: ProductDocument) {
  const stock = product.stock ?? product.stockCount ?? 0;
  const reserved = product.reservedStock ?? 0;
  return { stock, reserved, available: Math.max(0, stock - reserved) };
}

async function recordStockHistory(
  product: ProductDocument,
  meta: HistoryMeta & {
    quantity: number;
    stockBefore: number;
    stockAfter: number;
    reservedBefore: number;
    reservedAfter: number;
  }
) {
  await StockHistory.create({
    product: product._id,
    order: meta.orderId,
    changeType: meta.changeType,
    quantity: meta.quantity,
    stockBefore: meta.stockBefore,
    stockAfter: meta.stockAfter,
    reservedBefore: meta.reservedBefore,
    reservedAfter: meta.reservedAfter,
    note: meta.note,
    createdBy: meta.createdBy,
  });
}

export function getAvailableStock(product: Pick<ProductDocument, "stock" | "stockCount" | "reservedStock">): number {
  const stock = product.stock ?? product.stockCount ?? 0;
  const reserved = product.reservedStock ?? 0;
  return Math.max(0, stock - reserved);
}

export function isLowStock(product: Pick<ProductDocument, "stock" | "stockCount" | "reservedStock" | "lowStockThreshold">): boolean {
  const available = getAvailableStock(product);
  const threshold = product.lowStockThreshold ?? 10;
  return available > 0 && available <= threshold;
}

export function isOutOfStock(product: Pick<ProductDocument, "stock" | "stockCount" | "reservedStock">): boolean {
  return getAvailableStock(product) <= 0;
}

export async function reserveStockForOrder(
  items: OrderItemRef[],
  orderId: string
): Promise<void> {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const before = getStockValues(product);
    if (before.available < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}.`);
    }

    product.reservedStock = before.reserved + item.quantity;
    product.inStock = getAvailableStock(product) > 0;
    product.stockCount = product.stock;
    await product.save();

    const after = getStockValues(product);
    await recordStockHistory(product, {
      orderId,
      changeType: "reserve",
      quantity: item.quantity,
      stockBefore: before.stock,
      stockAfter: after.stock,
      reservedBefore: before.reserved,
      reservedAfter: after.reserved,
      note: `Reserved for order`,
    });
  }
}

export async function releaseStockForOrder(
  items: OrderItemRef[],
  orderId: string,
  note = "Order cancelled — stock released"
): Promise<void> {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const before = getStockValues(product);
    const releaseQty = Math.min(item.quantity, before.reserved);
    if (releaseQty <= 0) continue;

    product.reservedStock = Math.max(0, before.reserved - releaseQty);
    product.inStock = getAvailableStock(product) > 0;
    product.stockCount = product.stock;
    await product.save();

    const after = getStockValues(product);
    await recordStockHistory(product, {
      orderId,
      changeType: "release",
      quantity: releaseQty,
      stockBefore: before.stock,
      stockAfter: after.stock,
      reservedBefore: before.reserved,
      reservedAfter: after.reserved,
      note,
    });
  }
}

export async function commitStockForOrder(
  items: OrderItemRef[],
  orderId: string,
  note = "Order delivered — stock committed"
): Promise<void> {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const before = getStockValues(product);
    const commitQty = Math.min(item.quantity, before.reserved, before.stock);

    product.stock = Math.max(0, before.stock - commitQty);
    product.reservedStock = Math.max(0, before.reserved - commitQty);
    product.stockCount = product.stock;
    product.inStock = getAvailableStock(product) > 0;
    await product.save();

    const after = getStockValues(product);
    await recordStockHistory(product, {
      orderId,
      changeType: "commit",
      quantity: commitQty,
      stockBefore: before.stock,
      stockAfter: after.stock,
      reservedBefore: before.reserved,
      reservedAfter: after.reserved,
      note,
    });
  }
}

export async function adjustProductStock(
  productId: string,
  stock: number,
  meta: { note?: string; createdBy?: string }
): Promise<ProductDocument> {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found.");
  }

  const before = getStockValues(product);
  product.stock = Math.max(0, stock);
  product.stockCount = product.stock;
  product.inStock = getAvailableStock(product) > 0;
  await product.save();

  const after = getStockValues(product);
  await recordStockHistory(product, {
    changeType: "adjustment",
    quantity: after.stock - before.stock,
    stockBefore: before.stock,
    stockAfter: after.stock,
    reservedBefore: before.reserved,
    reservedAfter: after.reserved,
    note: meta.note ?? "Manual stock adjustment",
    createdBy: meta.createdBy,
  });

  return product;
}

export async function reserveOrderInventory(order: OrderDocument): Promise<void> {
  if (order.stockReserved) return;

  await reserveStockForOrder(
    order.items.map((item) => ({ product: item.product, quantity: item.quantity })),
    order._id.toString()
  );

  order.stockReserved = true;
  await order.save();
}

export async function releaseOrderInventory(order: OrderDocument): Promise<void> {
  if (!order.stockReserved || order.stockCommitted) return;

  await releaseStockForOrder(
    order.items.map((item) => ({ product: item.product, quantity: item.quantity })),
    order._id.toString()
  );

  order.stockReserved = false;
  await order.save();
}

export async function commitOrderInventory(order: OrderDocument): Promise<void> {
  if (order.stockCommitted) return;

  if (!order.stockReserved) {
    await reserveStockForOrder(
      order.items.map((item) => ({ product: item.product, quantity: item.quantity })),
      order._id.toString()
    );
    order.stockReserved = true;
  }

  await commitStockForOrder(
    order.items.map((item) => ({ product: item.product, quantity: item.quantity })),
    order._id.toString()
  );

  order.stockCommitted = true;
  order.stockFulfilled = true;
  await order.save();
}

export async function getLowStockProducts(limit = 20) {
  const products = await Product.find({ isActive: true }).sort({ stock: 1 }).limit(100);
  return products
    .filter((product) => isLowStock(product) || isOutOfStock(product))
    .slice(0, limit);
}

export async function getInventorySnapshot() {
  const products = await Product.find({ isActive: true })
    .populate("category", "name")
    .populate("brand", "name")
    .sort({ name: 1 });

  return products.map((product) => {
    const { stock, reserved } = getStockValues(product);
    const available = getAvailableStock(product);
    return {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      stock,
      reservedStock: reserved,
      availableStock: available,
      lowStockThreshold: product.lowStockThreshold ?? 10,
      inStock: available > 0,
      isLowStock: isLowStock(product),
      isOutOfStock: isOutOfStock(product),
      category: typeof product.category === "object" && product.category && "name" in product.category
        ? String((product.category as { name: string }).name)
        : "",
      brand: typeof product.brand === "object" && product.brand && "name" in product.brand
        ? String((product.brand as { name: string }).name)
        : "",
    };
  });
}
