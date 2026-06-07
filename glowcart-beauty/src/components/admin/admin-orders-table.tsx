"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { Select } from "@/components/ui/select";
import { routes } from "@/constants/routes";
import { getPaymentMethodLabel } from "@/lib/orders/constants";
import { mapOrderSummaryToAdminRow } from "@/lib/orders/mappers";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/orders/service";
import type { AdminOrderRow } from "@/types/admin";
import type { OrderStatus, PaymentStatus } from "@/types/order";

const paymentVariant = {
  pending: "outline",
  paid: "default",
  failed: "destructive",
  cancelled: "outline",
  refunded: "outline",
} as const;

function OrderStatusSelect({
  order,
  onUpdated,
}: {
  order: AdminOrderRow;
  onUpdated: () => Promise<void>;
}) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  async function handleChange(nextStatus: OrderStatus) {
    setStatus(nextStatus);
    setSaving(true);

    try {
      await updateOrderStatus(order.id, { orderStatus: nextStatus });
      toast.success("Order status updated.");
      await onUpdated();
    } catch (error) {
      setStatus(order.status);
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onChange={(event) => void handleChange(event.target.value as OrderStatus)}
        className="h-8 min-w-32 text-xs"
        disabled={saving}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </Select>
      {saving ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

function PaymentStatusSelect({
  order,
  onUpdated,
}: {
  order: AdminOrderRow;
  onUpdated: () => Promise<void>;
}) {
  const [status, setStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(nextStatus: PaymentStatus) {
    setStatus(nextStatus);
    setSaving(true);

    try {
      await updateOrderStatus(order.id, { paymentStatus: nextStatus });
      toast.success("Payment status updated.");
      await onUpdated();
    } catch (error) {
      setStatus(order.paymentStatus);
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onChange={(event) => void handleChange(event.target.value as PaymentStatus)}
        className="h-8 min-w-28 text-xs"
        disabled={saving}
      >
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
        <option value="refunded">Refunded</option>
      </Select>
      {saving ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

export function AdminOrdersTable() {
  const [items, setItems] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const orders = await fetchAdminOrders();
      setItems(orders.map(mapOrderSummaryToAdminRow));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const columns: AdminTableColumn<AdminOrderRow>[] = [
    {
      key: "order",
      header: "Order",
      cell: (row) => (
        <div>
          <Link href={routes.admin.orderDetail(row.id)} className="font-medium hover:text-primary">
            {row.orderNumber}
          </Link>
          <p className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleDateString("en-BD")}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.customerName}</p>
          <p className="text-xs text-muted-foreground">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      cell: (row) => adminFormatCurrency(row.total),
    },
    {
      key: "payment",
      header: "Payment",
      cell: (row) => (
        <div className="space-y-2">
          <PaymentStatusSelect order={row} onUpdated={loadItems} />
          <p className="text-xs text-muted-foreground">
            {getPaymentMethodLabel(row.paymentMethod)}
          </p>
          {row.transactionId ? (
            <p className="max-w-40 truncate text-xs text-muted-foreground" title={row.transactionId}>
              TXN: {row.transactionId}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "Order Status",
      cell: (row) => <OrderStatusSelect order={row} onUpdated={loadItems} />,
    },
  ];

  if (loading) {
    return <AdminTableSkeleton />;
  }

  return <AdminDataTable columns={columns} data={items} emptyMessage="No orders yet." />;
}
