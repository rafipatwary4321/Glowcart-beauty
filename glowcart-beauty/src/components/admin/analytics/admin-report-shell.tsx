"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

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

  const loadData = useCallback(async (selectedRange: AnalyticsRange) => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoint}?range=${selectedRange}`, { cache: "no-store" });
      const json = await response.json();
      if (json.success) setData(json.data);
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
        <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading report...
        </div>
      ) : data ? (
        children(data)
      ) : null}
    </div>
  );
}
