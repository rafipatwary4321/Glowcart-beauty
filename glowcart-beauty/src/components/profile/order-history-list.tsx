import { formatOrderStatus, placeholderOrders } from "@/data/placeholder-orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function statusVariant(status: string): "default" | "outline" {
  return status === "delivered" ? "default" : "outline";
}

export function OrderHistoryList() {
  return (
    <div className="space-y-4">
      {placeholderOrders.map((order) => (
        <Card key={order.id} className="border-border/60">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.date).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant={statusVariant(order.status)}>{formatOrderStatus(order.status)}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">
              {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </p>
            <p className="font-medium text-foreground">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
