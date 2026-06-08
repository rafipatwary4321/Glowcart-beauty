import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AdminSalesChartProps = {
  className?: string;
  data?: Array<{ label: string; value: number }>;
  loading?: boolean;
};

export function AdminSalesChart({ className, data, loading }: AdminSalesChartProps) {
  const chartData = data ?? [];
  const maxSales = Math.max(...chartData.map((point) => point.value), 1);

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Recent sales performance across the store.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-48 items-end gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-full flex-1 rounded-t-lg" />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground">
            No revenue data for this period yet.
          </div>
        ) : (
          <div className="flex h-48 items-end gap-3 sm:gap-4">
            {chartData.map((point) => {
              const height = `${Math.round((point.value / maxSales) * 100)}%`;

              return (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/30 transition-all"
                      style={{ height }}
                      title={`৳${point.value.toLocaleString("en-BD")}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{point.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
