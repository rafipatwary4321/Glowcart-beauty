"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  CategorySalesChart,
  CustomerGrowthChart,
  OrderStatusChart,
  RevenueOverviewChart,
  TopProductsChart,
} from "@/components/admin/analytics/analytics-charts";
import { AnalyticsDateFilter } from "@/components/admin/analytics/analytics-date-filter";
import { AnalyticsExportButtons } from "@/components/admin/analytics/analytics-export-buttons";
import { AnalyticsInsightsGrid } from "@/components/admin/analytics/analytics-insights-grid";
import { AnalyticsMetricsGrid } from "@/components/admin/analytics/analytics-metrics-grid";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsOverview, AnalyticsRange } from "@/types/analytics";

export function AdminAnalyticsContent() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (selectedRange: AnalyticsRange) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/overview?range=${selectedRange}`, { cache: "no-store" });
      const json = await response.json();
      if (json.success) {
        setData(json.data);
        if (json.data.source === "mock") {
          toast.message("Showing sample analytics — connect MongoDB for live data.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(range);
  }, [range, loadData]);

  const csvRows =
    data?.charts.revenueOverview.map((point) => [point.label, String(point.value)]) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <AnalyticsDateFilter value={range} onChange={setRange} />
        <AnalyticsExportButtons
          reportName="Analytics Overview"
          csvHeaders={["Period", "Revenue"]}
          csvRows={csvRows}
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading analytics...
        </div>
      ) : data ? (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full capitalize">
              {data.range.label}
            </Badge>
            <Badge variant="secondary" className="rounded-full capitalize">
              {data.source === "database" ? "Live data" : "Sample data"}
            </Badge>
          </div>

          <AnalyticsMetricsGrid metrics={data.metrics} />

          <div className="grid gap-6 xl:grid-cols-2">
            <RevenueOverviewChart data={data.charts.revenueOverview} />
            <OrderStatusChart data={data.charts.orderStatus} />
            <TopProductsChart data={data.charts.topProducts} />
            <CustomerGrowthChart data={data.charts.customerGrowth} />
            <CategorySalesChart data={data.charts.categorySales} className="xl:col-span-2" />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-heading text-xl font-medium text-foreground">Business Insights</h2>
              <p className="text-sm text-muted-foreground">
                Smart highlights to help you act on sales, inventory, and customer trends.
              </p>
            </div>
            <AnalyticsInsightsGrid insights={data.insights} />
          </div>
        </>
      ) : null}
    </div>
  );
}
