"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { routes } from "@/constants/routes";
import { formatPrice } from "@/lib/format";
import { formatOrderStatus, formatPaymentStatus } from "@/lib/orders/mappers";
import { fetchOrderById } from "@/lib/orders/service";
import { TRACKING_STATUS_LABELS } from "@/types/tracking";
import type { OrderSummary } from "@/types/order";
import type { TrackingStatus } from "@/types/tracking";

const trackingStatuses = Object.keys(TRACKING_STATUS_LABELS) as TrackingStatus[];

type AdminOrderDetailProps = {
  orderId: string;
};

export function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TrackingStatus>("pending");
  const [note, setNote] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setStatus(data.trackingStatus ?? "pending");
      setTrackingCode(data.trackingCode ?? "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  async function handleUpdateTracking() {
    setSaving(true);
    try {
      const response = await fetch("/api/orders/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          note,
          trackingCode,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error ?? "Update failed.");
      toast.success("Tracking updated.");
      setNote("");
      await loadOrder();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading order...</p>;
  }

  if (!order) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Order not found</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={routes.admin.orders}>Back to orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={order.orderNumber}
        description={`${order.customerName} · ${order.customerEmail}`}
        backHref={routes.admin.orders}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Tracking Timeline</CardTitle>
            <CardDescription>Customer-visible delivery updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(order.trackingEvents ?? []).map((event, index) => (
              <div key={`${event.status}-${index}`} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{TRACKING_STATUS_LABELS[event.status]}</p>
                {event.note ? <p className="text-sm text-muted-foreground">{event.note}</p> : null}
                <p className="text-xs text-muted-foreground">
                  {new Date(event.at).toLocaleString("en-BD")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Update Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={status}
                onChange={(event) => setStatus(event.target.value as TrackingStatus)}
                className="h-10"
              >
                {trackingStatuses.map((value) => (
                  <option key={value} value={value}>
                    {TRACKING_STATUS_LABELS[value]}
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Tracking code"
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
              />
              <Textarea
                placeholder="Tracking note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <Button
                type="button"
                className="w-full rounded-full"
                disabled={saving}
                onClick={() => void handleUpdateTracking()}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save tracking update
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Order Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Status:</span> {formatOrderStatus(order.orderStatus)}</p>
              <p><span className="text-muted-foreground">Payment:</span> {formatPaymentStatus(order.paymentStatus)}</p>
              <p><span className="text-muted-foreground">Total:</span> {formatPrice(order.total)}</p>
              {order.transactionId ? (
                <p className="break-all"><span className="text-muted-foreground">Transaction:</span> {order.transactionId}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
