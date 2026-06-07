import type { AnalyticsRange } from "@/types/analytics";

export const ANALYTICS_RANGE_OPTIONS: Array<{ key: AnalyticsRange; label: string }> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "month", label: "This month" },
  { key: "custom", label: "Custom range" },
];

export function parseAnalyticsRange(value?: string | null): AnalyticsRange {
  if (value === "today" || value === "7d" || value === "30d" || value === "month" || value === "custom") {
    return value;
  }
  return "30d";
}

export function getDateRange(range: AnalyticsRange) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      break;
    case "7d":
      start.setDate(start.getDate() - 6);
      break;
    case "30d":
      start.setDate(start.getDate() - 29);
      break;
    case "month":
      start.setDate(1);
      break;
    case "custom":
      start.setDate(start.getDate() - 29);
      break;
  }

  const label = ANALYTICS_RANGE_OPTIONS.find((option) => option.key === range)?.label ?? "Last 30 days";

  return {
    key: range,
    label,
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}
