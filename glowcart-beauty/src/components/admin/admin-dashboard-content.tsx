"use client";

import { useEffect, useState } from "react";

import {
  AdminLowStockCard,
  AdminRecentOrdersCard,
  AdminSalesChart,
  AdminStatCard,
} from "@/components/admin";
import { routes } from "@/constants/routes";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";

type DashboardData = {
  widgets: {
    todayOrders: number;
    todaySales: number;
    pendingOrders: number;
    lowStockCount: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    availableStock: number;
    lowStockThreshold: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt?: string;
  }>;
  revenueOverview: Array<{ date: string; revenue: number; orders: number }>;
};

export function AdminDashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const json = await response.json();
      if (json.success) setData(json.data);
    }
    void load();
  }, []);

  const widgets = data?.widgets;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Today's Orders"
          value={String(widgets?.todayOrders ?? "—")}
          trend="neutral"
        />
        <AdminStatCard
          label="Today's Sales"
          value={widgets ? adminFormatCurrency(widgets.todaySales) : "—"}
          trend="up"
        />
        <AdminStatCard
          label="Pending Orders"
          value={String(widgets?.pendingOrders ?? "—")}
          trend="neutral"
        />
        <AdminStatCard
          label="Low Stock Products"
          value={String(widgets?.lowStockCount ?? "—")}
          trend={widgets && widgets.lowStockCount > 0 ? "down" : "neutral"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AdminSalesChart
          data={(data?.revenueOverview ?? []).map((row) => ({
            label: row.date.slice(5),
            value: row.revenue,
          }))}
        />
        <AdminLowStockCard
          items={(data?.lowStockProducts ?? []).map((product) => ({
            id: product.id,
            name: product.name,
            stockCount: product.availableStock,
            threshold: product.lowStockThreshold,
          }))}
          inventoryHref={routes.admin.inventory}
        />
      </div>

      <AdminRecentOrdersCard
        orders={(data?.recentOrders ?? []).map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.customerName,
          total: order.total,
          status: order.status,
        }))}
        ordersHref={routes.admin.orders}
        orderDetailHref={(id) => routes.admin.orderDetail(id)}
      />
    </div>
  );
}
