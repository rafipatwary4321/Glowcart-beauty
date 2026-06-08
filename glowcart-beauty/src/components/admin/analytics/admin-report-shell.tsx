"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-state";
import { AnalyticsDateFilter } from "@/components/admin/analytics/analytics-date-filter";
import { AnalyticsExportButtons } from "@/components/admin/analytics/analytics-export-buttons";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsRange } from "@/types/analytics";

type AdminReportShellProps = {
  endpoint: string;
  reportName: string;
  csvHeaders: string[];
  buildCsvRows: (data: unknown) => string[][];
  children: (data: unknown) => ReactNode;
};

export function AdminReportShell({
  endpoint,
  reportName,
  csvHeaders,
  buildCsvRows,
  children,
}: AdminReportShellProps) {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (selectedRange: AnalyticsRange) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${endpoint}?range=${selectedRange}`, { cache: "no-store" });
      const json = await response.json();
      if (json.success) {
        setData(json.data);
      } else {
        throw new Error("Report request failed.");
      }
    } catch {
      setError("Unable to load this report. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void loadData(range);
  }, [range, loadData]);

  const reportData = data as { source?: string; range?: { label: string } } | null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <AnalyticsDateFilter value={range} onChange={setRange} />
        <AnalyticsExportButtons
          reportName={reportName}
          csvHeaders={csvHeaders}
          csvRows={data ? buildCsvRows(data) : []}
        />
      </div>

      {reportData ? (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full capitalize">
            {reportData.range?.label}
          </Badge>
          <Badge variant="secondary" className="rounded-full capitalize">
            {reportData.source === "database" ? "Live data" : "Sample data"}
          </Badge>
        </div>
      ) : null}

      {loading ? (
        <AdminLoadingState message="Loading report..." />
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => void loadData(range)} />
      ) : data ? (
        children(data)
      ) : (
        <AdminErrorState message="No report data available." onRetry={() => void loadData(range)} />
      )}
    </div>
  );
}
