"use client";

import { AdminReportShell } from "@/components/admin/analytics/admin-report-shell";
import { CustomerGrowthChart } from "@/components/admin/analytics/analytics-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomersReport } from "@/types/analytics";

export function AdminCustomersReportContent() {
  return (
    <AdminReportShell
      endpoint="/api/analytics/customers"
      reportName="Customers Report"
      csvHeaders={["Customer", "Email", "Orders", "Spent"]}
      buildCsvRows={(raw) => {
        const data = raw as CustomersReport;
        return data.topCustomers.map((row) => [row.name, row.email, String(row.orders), String(row.spent)]);
      }}
    >
      {(raw) => {
        const data = raw as CustomersReport;
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard label="Total Customers" value={String(data.summary.totalCustomers)} trend="up" />
              <AdminStatCard label="New Customers" value={String(data.summary.newCustomers)} trend="up" />
              <AdminStatCard label="Repeat Customers" value={String(data.summary.repeatCustomers)} trend="neutral" />
              <AdminStatCard label="Repeat Rate" value={`${data.summary.repeatRate}%`} trend="up" />
            </div>

            <CustomerGrowthChart data={data.growth} />

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Customer</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Orders</th>
                      <th className="pb-3 font-medium">Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCustomers.map((customer) => (
                      <tr key={customer.email} className="border-b border-border/40">
                        <td className="py-3 pr-4 font-medium text-foreground">{customer.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{customer.email}</td>
                        <td className="py-3 pr-4">{customer.orders}</td>
                        <td className="py-3">{adminFormatCurrency(customer.spent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        );
      }}
    </AdminReportShell>
  );
}
