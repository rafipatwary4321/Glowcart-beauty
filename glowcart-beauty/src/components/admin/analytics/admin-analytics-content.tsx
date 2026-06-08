"use client";

import { useCallback, useEffect, useState } from "react";
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
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-state";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsOverview, AnalyticsRange } from "@/types/analytics";

export function AdminAnalyticsContent() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (selectedRange: AnalyticsRange) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/overview?range=${selectedRange}`, { cache: "no-store" });
      const json = await response.json();
      if (json.success) {
        setData(json.data);
        if (json.data.source === "mock") {
          toast.message("Showing sample analytics — connect MongoDB for live data.");
        }
      } else {
        throw new Error("Analytics request failed.");
      }
    } catch {
      setError("Unable to load analytics. Please try again.");
      setData(null);
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
        <AdminLoadingState message="Loading analytics..." />
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => void loadData(range)} />
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
      ) : (
        <AdminErrorState message="No analytics data available." onRetry={() => void loadData(range)} />
      )}
    </div>
  );
}
