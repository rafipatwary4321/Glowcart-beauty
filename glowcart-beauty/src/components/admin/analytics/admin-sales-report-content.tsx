"use client";

import Link from "next/link";

import { AdminReportShell } from "@/components/admin/analytics/admin-report-shell";
import { RevenueOverviewChart } from "@/components/admin/analytics/analytics-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/constants/routes";
import type { SalesReport } from "@/types/analytics";

export function AdminSalesReportContent() {
  return (
    <AdminReportShell
      endpoint="/api/analytics/sales"
      reportName="Sales Report"
      csvHeaders={["Date", "Revenue", "Orders"]}
      buildCsvRows={(raw) => {
        const data = raw as SalesReport;
        return data.daily.map((row) => [row.date, String(row.revenue), String(row.orders)]);
      }}
    >
      {(raw) => {
        const data = raw as SalesReport;
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard label="Revenue" value={adminFormatCurrency(data.summary.revenue)} trend="up" />
              <AdminStatCard label="Orders" value={String(data.summary.orders)} trend="neutral" />
              <AdminStatCard label="AOV" value={adminFormatCurrency(data.summary.averageOrderValue)} trend="neutral" />
              <AdminStatCard
                label="Growth"
                value={`${data.summary.growthRate}%`}
                change={data.summary.growthRate > 0 ? "vs previous period" : undefined}
                trend={data.summary.growthRate >= 0 ? "up" : "down"}
              />
            </div>

            <RevenueOverviewChart
              data={data.daily.map((row) => ({ label: row.date.slice(5), value: row.revenue }))}
            />

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Revenue</th>
                      <th className="pb-3 font-medium">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.map((row) => (
                      <tr key={row.date} className="border-b border-border/40">
                        <td className="py-3 pr-4">{row.date}</td>
                        <td className="py-3 pr-4">{adminFormatCurrency(row.revenue)}</td>
                        <td className="py-3">{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
              Need deeper order context?{" "}
              <Link href={routes.admin.reportsOrders} className="font-medium text-primary hover:underline">
                View orders report
              </Link>
            </p>
          </div>
        );
      }}
    </AdminReportShell>
  );
}
