"use client";

import Link from "next/link";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminLowStockProducts, adminRecentOrders } from "@/data/admin";
import type { AdminOrderRow, AdminProductRow } from "@/types/admin";

const recentOrderColumns = (
  orderDetailHref?: (id: string) => string
): AdminTableColumn<AdminOrderRow>[] => [
  {
    key: "order",
    header: "Order",
    cell: (row) => (
      <div>
        {orderDetailHref ? (
          <Link href={orderDetailHref(row.id)} className="font-medium hover:text-primary">
            {row.orderNumber}
          </Link>
        ) : (
          <p className="font-medium">{row.orderNumber}</p>
        )}
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

const lowStockColumns: AdminTableColumn<AdminProductRow & { threshold?: number }>[] = [
  {
    key: "product",
    header: "Product",
    cell: (row) => row.name,
  },
  {
    key: "stock",
    header: "Available",
    cell: (row) => row.stockCount,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge
        label={row.stockCount === 0 ? "Out of stock" : "Low stock"}
        variant={row.stockCount === 0 ? "destructive" : "outline"}
      />
    ),
  },
];

type LowStockItem = {
  id: string;
  name: string;
  stockCount: number;
  threshold?: number;
};

type RecentOrderItem = {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
};

type AdminLowStockCardProps = {
  items?: LowStockItem[];
  inventoryHref?: string;
};

export function AdminLowStockCard({ items, inventoryHref }: AdminLowStockCardProps) {
  const data: Array<AdminProductRow & { threshold?: number }> = items
    ? items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.id,
        sku: item.id,
        category: "",
        brand: "",
        price: 0,
        stockCount: item.stockCount,
        inStock: item.stockCount > 0,
        skinConcerns: [],
        imageGradient: "",
        isActive: true,
        updatedAt: new Date().toISOString(),
        threshold: item.threshold,
      }))
    : adminLowStockProducts;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
        <CardDescription>
          Products that need restocking soon.
          {inventoryHref ? (
            <>
              {" "}
              <Link href={inventoryHref} className="text-primary hover:underline">
                View inventory
              </Link>
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminDataTable
          columns={lowStockColumns}
          data={data}
          emptyMessage="All products are well stocked."
        />
      </CardContent>
    </Card>
  );
}

type AdminRecentOrdersCardProps = {
  orders?: RecentOrderItem[];
  ordersHref?: string;
  orderDetailHref?: (id: string) => string;
};

export function AdminRecentOrdersCard({
  orders,
  ordersHref,
  orderDetailHref,
}: AdminRecentOrdersCardProps) {
  const data: AdminOrderRow[] = orders
    ? orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer,
        customerEmail: "",
        total: order.total,
        status: order.status as AdminOrderRow["status"],
        paymentStatus: "pending",
        paymentMethod: "cod",
        createdAt: new Date().toISOString(),
        itemCount: 1,
      }))
    : adminRecentOrders;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest customer orders across the store.
          {ordersHref ? (
            <>
              {" "}
              <Link href={ordersHref} className="text-primary hover:underline">
                View all
              </Link>
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminDataTable columns={recentOrderColumns(orderDetailHref)} data={data} />
      </CardContent>
    </Card>
  );
}
