"use client";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLowStockProducts, adminRecentOrders } from "@/data/admin";
import type { AdminOrderRow, AdminProductRow } from "@/types/admin";

const recentOrderColumns: AdminTableColumn<AdminOrderRow>[] = [
  {
    key: "order",
    header: "Order",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.orderNumber}</p>
        <p className="text-xs text-muted-foreground">{row.customerName}</p>
      </div>
    ),
  },
  {
    key: "total",
    header: "Total",
    cell: (row) => adminFormatCurrency(row.total),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge label={row.status} variant="outline" />,
  },
];

const lowStockColumns: AdminTableColumn<AdminProductRow>[] = [
  {
    key: "product",
    header: "Product",
    cell: (row) => row.name,
  },
  {
    key: "stock",
    header: "Stock",
    cell: (row) => row.stockCount,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge
        label={row.inStock ? "Low stock" : "Out of stock"}
        variant={row.inStock ? "outline" : "destructive"}
      />
    ),
  },
];

export function AdminLowStockCard() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
        <CardDescription>Products that need restocking soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminDataTable
          columns={lowStockColumns}
          data={adminLowStockProducts}
          emptyMessage="All products are well stocked."
        />
      </CardContent>
    </Card>
  );
}

export function AdminRecentOrdersCard() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders across the store.</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminDataTable columns={recentOrderColumns} data={adminRecentOrders} />
      </CardContent>
    </Card>
  );
}
