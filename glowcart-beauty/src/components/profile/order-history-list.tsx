"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";
import { placeholderOrders, formatOrderStatus } from "@/data/placeholder-orders";
import { formatPrice } from "@/lib/format";
import { getPaymentMethodLabel } from "@/lib/orders/constants";
import { formatOrderStatus as formatApiOrderStatus, formatPaymentStatus } from "@/lib/orders/mappers";
import { fetchMyOrders } from "@/lib/orders/service";
import type { OrderSummary } from "@/types/order";

function statusVariant(status: string): "default" | "outline" {
  return status === "delivered" ? "default" : "outline";
}

function OrderCard({ order }: { order: OrderSummary }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge variant={statusVariant(order.orderStatus)}>
          {formatApiOrderStatus(order.orderStatus)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground">
            {order.itemCount} item{order.itemCount === 1 ? "" : "s"} · {getPaymentMethodLabel(order.paymentMethod)}
          </p>
          <p className="font-medium text-foreground">{formatPrice(order.total)}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
          <span>Payment: {formatPaymentStatus(order.paymentStatus)}</span>
          {order.trackingCode ? <span>Tracking: {order.trackingCode}</span> : null}
          {order.transactionId ? (
            <span className="truncate" title={order.transactionId}>
              TXN: {order.transactionId}
            </span>
          ) : null}
        </div>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href={routes.orderSuccess(order.id)}>View order</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function PlaceholderOrderCard({
  order,
}: {
  order: (typeof placeholderOrders)[number];
}) {
  return (
    <Card className="border-border/60 opacity-80">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.date).toLocaleDateString("en-BD", {
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
        <p className="font-medium text-foreground">{formatPrice(order.total)}</p>
      </CardContent>
    </Card>
  );
}

export function OrderHistoryList() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      if (status === "loading") return;

      if (!session?.user) {
        setShowPlaceholder(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchMyOrders();
        setOrders(data);
        setShowPlaceholder(false);
      } catch {
        setShowPlaceholder(true);
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, [session, status]);

  if (loading || status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  if (orders.length > 0) {
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  }

  if (session?.user && !showPlaceholder) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center">
        <p className="font-medium text-foreground">No orders yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          When you place an order, it will appear here.
        </p>
        <Button className="mt-4 rounded-full" asChild>
          <Link href={routes.products}>Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Sample orders shown below. Sign in and checkout to create real orders.
      </p>
      {placeholderOrders.map((order) => (
        <PlaceholderOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
