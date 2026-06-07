"use client";

import { CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ANALYTICS_RANGE_OPTIONS } from "@/lib/analytics/date-range";
import type { AnalyticsRange } from "@/types/analytics";
import { cn } from "@/lib/utils";

type AnalyticsDateFilterProps = {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
  className?: string;
};

export function AnalyticsDateFilter({ value, onChange, className }: AnalyticsDateFilterProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex flex-wrap gap-2">
        {ANALYTICS_RANGE_OPTIONS.map((option) => (
          <Button
            key={option.key}
            type="button"
            size="sm"
            variant={value === option.key ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              if (option.key === "custom") {
                window.alert("Custom date range picker is coming soon. Using last 30 days for now.");
                onChange("30d");
                return;
              }
              onChange(option.key);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarRange className="size-4" />
        <span>Custom range picker — coming soon</span>
      </div>
    </div>
  );
}
