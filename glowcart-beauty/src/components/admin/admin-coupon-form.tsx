"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function AdminCouponForm() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Create Coupon</CardTitle>
        <CardDescription>Placeholder form — backend integration coming soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {saved ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:col-span-2">
              Coupon created in placeholder mode.
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="code">Coupon code</Label>
            <Input id="code" placeholder="GLOW20" className="h-10 rounded-lg uppercase" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountType">Discount type</Label>
            <Select id="discountType" defaultValue="percentage">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">Discount value</Label>
            <Input id="discountValue" type="number" placeholder="10" className="h-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minOrder">Minimum order (৳)</Label>
            <Input id="minOrder" type="number" placeholder="1500" className="h-10 rounded-lg" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Coupon description..." />
          </div>
          <div className="flex items-center justify-between gap-3 sm:col-span-2">
            <Label htmlFor="active">Active</Label>
            <Switch defaultChecked />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="rounded-full">
              Create Coupon
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
