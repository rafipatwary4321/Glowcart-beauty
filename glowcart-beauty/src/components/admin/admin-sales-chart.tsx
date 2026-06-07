import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSalesChartData } from "@/data/admin";
import { cn } from "@/lib/utils";

type AdminSalesChartProps = {
  className?: string;
  data?: Array<{ label: string; value: number }>;
};

export function AdminSalesChart({ className, data }: AdminSalesChartProps) {
  const chartData =
    data && data.length > 0
      ? data
      : adminSalesChartData.map((point) => ({ label: point.month, value: point.sales }));

  const maxSales = Math.max(...chartData.map((point) => point.value), 1);

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Recent sales performance across the store.</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
