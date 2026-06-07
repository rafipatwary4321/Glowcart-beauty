import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminSalesChartData } from "@/data/admin";
import { cn } from "@/lib/utils";

type AdminSalesChartProps = {
  className?: string;
};

export function AdminSalesChart({ className }: AdminSalesChartProps) {
  const maxSales = Math.max(...adminSalesChartData.map((point) => point.sales));

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Placeholder chart — connect analytics when backend is live.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-3 sm:gap-4">
          {adminSalesChartData.map((point) => {
            const height = `${Math.round((point.sales / maxSales) * 100)}%`;

            return (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/30 transition-all"
                    style={{ height }}
                    title={`৳${point.sales.toLocaleString("en-BD")}`}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{point.month}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
