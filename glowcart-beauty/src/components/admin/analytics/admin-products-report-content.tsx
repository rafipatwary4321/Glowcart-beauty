"use client";

import { AdminReportShell } from "@/components/admin/analytics/admin-report-shell";
import { CategorySalesChart, TopProductsChart } from "@/components/admin/analytics/analytics-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductsReport } from "@/types/analytics";

export function AdminProductsReportContent() {
  return (
    <AdminReportShell
      endpoint="/api/analytics/products"
      reportName="Products Report"
      csvHeaders={["Product", "Units Sold", "Revenue"]}
      buildCsvRows={(raw) => {
        const data = raw as ProductsReport;
        return data.topSelling.map((row) => [row.name, String(row.unitsSold), String(row.revenue)]);
      }}
    >
      {(raw) => {
        const data = raw as ProductsReport;
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard label="Total Products" value={String(data.summary.totalProducts)} trend="neutral" />
              <AdminStatCard label="Active Products" value={String(data.summary.activeProducts)} trend="up" />
              <AdminStatCard label="Low Stock" value={String(data.summary.lowStock)} trend="down" />
              <AdminStatCard label="Out of Stock" value={String(data.summary.outOfStock)} trend="down" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <TopProductsChart
                data={data.topSelling.map((row) => ({
                  label: row.name.length > 14 ? `${row.name.slice(0, 14)}…` : row.name,
                  value: row.unitsSold,
                }))}
              />
              <CategorySalesChart data={data.categoryBreakdown} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.topSelling.map((product) => (
                    <div key={product.name} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.unitsSold} units sold</p>
                      </div>
                      <p className="text-sm font-medium">{adminFormatCurrency(product.revenue)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Slow Moving Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.slowMoving.map((product) => (
                    <div key={product.name} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.unitsSold} units sold</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                    </div>
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
