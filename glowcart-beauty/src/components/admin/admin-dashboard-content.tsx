"use client";

import { useEffect, useState } from "react";

import {
  AdminLowStockCard,
  AdminRecentOrdersCard,
  AdminSalesChart,
  AdminStatCard,
} from "@/components/admin";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-state";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";

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

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export function AdminDashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error("Dashboard request failed.");
      }

      setData(json.data);
    } catch {
      setError("Unable to load dashboard data. Check your database connection and try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8" data-testid="admin-dashboard">
        <DashboardStatsSkeleton />
        <AdminLoadingState message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="admin-dashboard">
        <AdminErrorState message={error} onRetry={() => void loadDashboard()} />
      </div>
    );
  }

  const widgets = data?.widgets;

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Today's Orders"
          value={String(widgets?.todayOrders ?? 0)}
          trend="neutral"
        />
        <AdminStatCard
          label="Today's Sales"
          value={adminFormatCurrency(widgets?.todaySales ?? 0)}
          trend="up"
        />
        <AdminStatCard
          label="Pending Orders"
          value={String(widgets?.pendingOrders ?? 0)}
          trend="neutral"
        />
        <AdminStatCard
          label="Low Stock Products"
          value={String(widgets?.lowStockCount ?? 0)}
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
