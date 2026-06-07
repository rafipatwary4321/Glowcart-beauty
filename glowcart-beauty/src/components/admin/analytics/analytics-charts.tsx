"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types/analytics";
import { cn } from "@/lib/utils";

type AnalyticsBarChartProps = {
  title: string;
  description?: string;
  data: ChartPoint[];
  className?: string;
  valuePrefix?: string;
  horizontal?: boolean;
  colorClassName?: string;
};

export function AnalyticsBarChart({
  title,
  description,
  data,
  className,
  valuePrefix = "৳",
  horizontal = false,
  colorClassName = "from-primary/80 to-primary/30",
}: AnalyticsBarChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {horizontal ? (
          <div className="space-y-3">
            {data.map((point) => {
              const width = `${Math.round((point.value / maxValue) * 100)}%`;
              return (
                <div key={point.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{point.label}</span>
                    <span className="text-muted-foreground">
                      {valuePrefix}
                      {point.value.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", colorClassName)}
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-48 items-end gap-2 sm:gap-3">
            {data.map((point) => {
              const height = `${Math.round((point.value / maxValue) * 100)}%`;
              return (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end">
                    <div
                      className={cn("w-full rounded-t-lg bg-gradient-to-t", colorClassName)}
                      style={{ height }}
                      title={`${valuePrefix}${point.value.toLocaleString("en-BD")}`}
                    />
                  </div>
                  <span className="max-w-full truncate text-[10px] font-medium text-muted-foreground sm:text-xs">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RevenueOverviewChart(props: Omit<AnalyticsBarChartProps, "title" | "description">) {
  return (
    <AnalyticsBarChart
      title="Revenue Overview"
      description="Daily revenue across the selected period."
      valuePrefix="৳"
      {...props}
    />
  );
}

export function OrderStatusChart(props: Omit<AnalyticsBarChartProps, "title" | "description" | "valuePrefix" | "horizontal">) {
  return (
    <AnalyticsBarChart
      title="Order Status"
      description="Distribution of orders by fulfillment status."
      valuePrefix=""
      horizontal
      colorClassName="from-rose-400 to-pink-300"
      {...props}
    />
  );
}

export function TopProductsChart(props: Omit<AnalyticsBarChartProps, "title" | "description" | "valuePrefix" | "horizontal">) {
  return (
    <AnalyticsBarChart
      title="Top Selling Products"
      description="Units sold in the selected period."
      valuePrefix=""
      horizontal
      colorClassName="from-beige-400 to-rose-200"
      {...props}
    />
  );
}

export function CustomerGrowthChart(props: Omit<AnalyticsBarChartProps, "title" | "description" | "valuePrefix">) {
  return (
    <AnalyticsBarChart
      title="Customer Growth"
      description="New customer sign-ups over time."
      valuePrefix=""
      colorClassName="from-emerald-400 to-teal-200"
      {...props}
    />
  );
}

export function CategorySalesChart(props: Omit<AnalyticsBarChartProps, "title" | "description" | "horizontal">) {
  return (
    <AnalyticsBarChart
      title="Category Sales"
      description="Revenue contribution by product category."
      valuePrefix="৳"
      horizontal
      colorClassName="from-primary/70 to-primary/20"
      {...props}
    />
  );
}
