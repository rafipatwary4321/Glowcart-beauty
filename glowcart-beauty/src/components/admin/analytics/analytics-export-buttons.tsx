"use client";

import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { downloadCsv, exportPdfPlaceholder } from "@/lib/analytics/export";

type AnalyticsExportButtonsProps = {
  reportName: string;
  csvHeaders: string[];
  csvRows: string[][];
  className?: string;
};

export function AnalyticsExportButtons({
  reportName,
  csvHeaders,
  csvRows,
  className,
}: AnalyticsExportButtonsProps) {
  function handleCsvExport() {
    if (!csvRows.length) {
      toast.message("No data available to export.");
      return;
    }
    downloadCsv(`${reportName.toLowerCase().replace(/\s+/g, "-")}.csv`, csvHeaders, csvRows);
    toast.success("CSV exported.");
  }

  function handlePdfExport() {
    exportPdfPlaceholder(reportName);
    toast.message("PDF export is a placeholder for now.");
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={handleCsvExport}>
          <Download className="size-4" />
          Export CSV
        </Button>
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={handlePdfExport}>
          <FileText className="size-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
