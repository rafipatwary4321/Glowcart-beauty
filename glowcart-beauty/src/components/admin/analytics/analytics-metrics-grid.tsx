"use client";

import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import type { AnalyticsMetrics } from "@/types/analytics";

type AnalyticsMetricsGridProps = {
  metrics: AnalyticsMetrics;
};

export function AnalyticsMetricsGrid({ metrics }: AnalyticsMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      <AdminStatCard label="Total Revenue" value={adminFormatCurrency(metrics.totalRevenue)} trend="up" />
      <AdminStatCard label="Total Orders" value={String(metrics.totalOrders)} trend="neutral" />
      <AdminStatCard label="Total Products" value={String(metrics.totalProducts)} trend="neutral" />
      <AdminStatCard label="Total Customers" value={String(metrics.totalCustomers)} trend="up" />
      <AdminStatCard label="Average Order Value" value={adminFormatCurrency(metrics.averageOrderValue)} trend="neutral" />
      <AdminStatCard label="Pending Orders" value={String(metrics.pendingOrders)} trend="neutral" />
      <AdminStatCard label="Completed Orders" value={String(metrics.completedOrders)} trend="up" />
      <AdminStatCard label="Cancelled Orders" value={String(metrics.cancelledOrders)} trend={metrics.cancelledOrders > 0 ? "down" : "neutral"} />
      <AdminStatCard label="Low Stock Count" value={String(metrics.lowStockCount)} trend={metrics.lowStockCount > 0 ? "down" : "neutral"} />
    </div>
  );
}
