import type { Order } from "@/types/order";

/**
 * Order API service layer.
 */
export async function getOrders(): Promise<Order[]> {
  // TODO: fetch from API / MongoDB
  return [];
}

export async function getOrderById(_id: string): Promise<Order | null> {
  // TODO: fetch from API / MongoDB
  return null;
}

export async function createOrder(_payload: unknown): Promise<Order> {
  // TODO: create order via API
  throw new Error("Order creation not implemented");
}
