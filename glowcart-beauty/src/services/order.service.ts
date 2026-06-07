import {
  createOrder,
  fetchAdminOrders,
  fetchMyOrders,
  fetchOrderById,
  updateOrderStatus,
} from "@/lib/orders/service";
import type { OrderSummary } from "@/types/order";

export type { OrderSummary as Order };

export async function getOrders(): Promise<OrderSummary[]> {
  return fetchMyOrders();
}

export async function getOrderById(id: string): Promise<OrderSummary | null> {
  try {
    return await fetchOrderById(id);
  } catch {
    return null;
  }
}

export { createOrder, fetchAdminOrders, updateOrderStatus };
