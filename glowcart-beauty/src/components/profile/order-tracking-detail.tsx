"use client";

import { CheckCircle2, Circle, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";
import { formatPrice } from "@/lib/format";
import { getPaymentMethodLabel } from "@/lib/orders/constants";
import { formatOrderStatus, formatPaymentStatus } from "@/lib/orders/mappers";
import { fetchOrderById } from "@/lib/orders/service";
import { TRACKING_STATUS_LABELS, TRACKING_STATUS_ORDER } from "@/types/tracking";
import type { OrderSummary } from "@/types/order";
import type { TrackingStatus } from "@/types/tracking";

type OrderTrackingDetailProps = {
  orderId: string;
};

export function OrderTrackingDetail({ orderId }: OrderTrackingDetailProps) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setOrder(await fetchOrderById(orderId));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Order not found.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Order unavailable</CardTitle>
          <CardDescription>{error ?? "We could not find this order."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="rounded-full">
            <Link href={routes.profile + "/orders"}>Back to orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = order.trackingStatus ?? "pending";
  const events = order.trackingEvents ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Order Tracking</p>
          <h1 className="mt-2 font-heading text-3xl font-medium">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString("en-BD")}
          </p>
        </div>
        <Badge variant="outline">{formatOrderStatus(order.orderStatus)}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="size-5 text-primary" />
              Delivery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {TRACKING_STATUS_ORDER.filter((status) => status !== "cancelled").map((status) => {
              const reached =
                TRACKING_STATUS_ORDER.indexOf(status) <=
                TRACKING_STATUS_ORDER.indexOf(currentStatus as TrackingStatus);
              const event = events.find((item) => item.status === status);

              return (
                <div key={status} className="flex gap-3">
                  {reached ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{TRACKING_STATUS_LABELS[status]}</p>
                    {event?.note ? (
                      <p className="text-sm text-muted-foreground">{event.note}</p>
                    ) : null}
                    {event?.at ? (
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.at).toLocaleString("en-BD")}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{formatPaymentStatus(order.paymentStatus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tracking code</span>
                <span className="text-right font-medium break-all">
                  {order.trackingCode ?? "Not assigned yet"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.items.map((item) => (
                <div key={item.productId + item.slug} className="flex justify-between gap-3">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
