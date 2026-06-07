"use client";

import { CheckCircle2, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";
import { formatPrice } from "@/lib/format";
import { formatOrderStatus, formatPaymentStatus } from "@/lib/orders/mappers";
import { getPaymentMethodLabel } from "@/lib/orders/constants";
import { fetchOrderById } from "@/lib/orders/service";
import { useCartStore } from "@/store/cart-store";
import type { OrderSummary } from "@/types/order";

type OrderSuccessContentProps = {
  orderId: string;
};

export function OrderSuccessContent({ orderId }: OrderSuccessContentProps) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);

        if (data.paymentMethod === "cod" || data.paymentStatus === "paid") {
          clearCart();
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Order not found.");
      } finally {
        setLoading(false);
      }
    }

    void loadOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card className="mx-auto max-w-xl border-border/60">
        <CardHeader>
          <CardTitle>Order unavailable</CardTitle>
          <CardDescription>{error ?? "We could not find this order."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="rounded-full" asChild>
            <Link href={routes.products}>Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-rose-50 p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mt-5 font-heading text-3xl font-medium tracking-tight text-foreground">
          Thank you for your order
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order {order.orderNumber} has been received. We&apos;ll notify you when it ships.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="size-5 text-primary" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Order number</p>
            <p className="font-medium">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total paid</p>
            <p className="font-heading text-lg font-medium">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment method</p>
            <p className="font-medium">{getPaymentMethodLabel(order.paymentMethod)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment status</p>
            <p className="font-medium">{formatPaymentStatus(order.paymentStatus)}</p>
          </div>
          {order.transactionId ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Transaction ID</p>
              <p className="font-medium break-all">{order.transactionId}</p>
            </div>
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Order status</p>
            <p className="font-medium">{formatOrderStatus(order.orderStatus)}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tracking</p>
            <p className="font-medium">
              {order.trackingCode ?? "Tracking code will appear once your order ships."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="size-5 text-primary" />
            Delivery Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
          </p>
          <p className="text-muted-foreground">
            {order.shippingAddress.city} {order.shippingAddress.postalCode}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="rounded-full" asChild>
          <Link href={routes.products}>Continue Shopping</Link>
        </Button>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href={routes.profile + "/orders"}>View Order History</Link>
        </Button>
      </div>
    </div>
  );
}
