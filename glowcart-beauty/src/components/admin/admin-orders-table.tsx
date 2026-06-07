"use client";

import { useState } from "react";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Select } from "@/components/ui/select";
import { adminOrders } from "@/data/admin";
import type { AdminOrderRow } from "@/types/admin";

function OrderStatusSelect({ order }: { order: AdminOrderRow }) {
  const [status, setStatus] = useState(order.status);

  return (
    <Select
      value={status}
      onChange={(event) => setStatus(event.target.value as AdminOrderRow["status"])}
      className="h-8 min-w-32 text-xs"
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </Select>
  );
}

const paymentVariant = {
  pending: "outline",
  paid: "default",
  failed: "destructive",
  refunded: "outline",
} as const;

const columns: AdminTableColumn<AdminOrderRow>[] = [
  {
    key: "order",
    header: "Order",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.orderNumber}</p>
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
      <div className="space-y-1">
        <AdminStatusBadge
          label={row.paymentStatus}
          variant={paymentVariant[row.paymentStatus]}
        />
        <p className="text-xs text-muted-foreground">{row.paymentMethod}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <OrderStatusSelect order={row} />,
  },
  {
    key: "actions",
    header: "",
    className: "text-right",
    cell: () => <AdminTableActions onEdit={() => undefined} />,
  },
];

export function AdminOrdersTable() {
  return <AdminDataTable columns={columns} data={adminOrders} />;
}
