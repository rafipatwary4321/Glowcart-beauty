"use client";

import Link from "next/link";

import { AdminReportShell } from "@/components/admin/analytics/admin-report-shell";
import { OrderStatusChart } from "@/components/admin/analytics/analytics-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/constants/routes";
import type { OrdersReport } from "@/types/analytics";

export function AdminOrdersReportContent() {
  return (
    <AdminReportShell
      endpoint="/api/analytics/orders"
      reportName="Orders Report"
      csvHeaders={["Order Number", "Customer", "Total", "Status", "Date"]}
      buildCsvRows={(raw) => {
        const data = raw as OrdersReport;
        return data.recent.map((row) => [
          row.orderNumber,
          row.customerName,
          String(row.total),
          row.status,
          row.createdAt,
        ]);
      }}
    >
      {(raw) => {
        const data = raw as OrdersReport;
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <AdminStatCard label="Total Orders" value={String(data.summary.total)} trend="neutral" />
              <AdminStatCard label="Pending" value={String(data.summary.pending)} trend="neutral" />
              <AdminStatCard label="Completed" value={String(data.summary.completed)} trend="up" />
              <AdminStatCard label="Cancelled" value={String(data.summary.cancelled)} trend="down" />
              <AdminStatCard label="Fulfillment Rate" value={`${data.summary.fulfillmentRate}%`} trend="up" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <OrderStatusChart data={data.byStatus} />
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.recent.map((order) => (
                    <Link
                      key={order.id}
                      href={routes.admin.orderDetail(order.id)}
                      className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 transition-colors hover:border-primary/30"
                    >
                      <div>
                        <p className="font-medium text-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{adminFormatCurrency(order.total)}</p>
                        <p className="text-xs capitalize text-muted-foreground">{order.status}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }}
    </AdminReportShell>
  );
}
