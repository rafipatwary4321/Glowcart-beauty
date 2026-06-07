export type PlaceholderOrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type PlaceholderOrder = {
  id: string;
  orderNumber: string;
  date: string;
  status: PlaceholderOrderStatus;
  total: number;
  itemCount: number;
};

export const placeholderOrders: PlaceholderOrder[] = [
  {
    id: "ord_001",
    orderNumber: "GC-10482",
    date: "2026-05-28",
    status: "delivered",
    total: 3240,
    itemCount: 3,
  },
  {
    id: "ord_002",
    orderNumber: "GC-10501",
    date: "2026-06-02",
    status: "shipped",
    total: 1890,
    itemCount: 2,
  },
  {
    id: "ord_003",
    orderNumber: "GC-10519",
    date: "2026-06-05",
    status: "processing",
    total: 4560,
    itemCount: 4,
  },
];

export function formatOrderStatus(status: PlaceholderOrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
