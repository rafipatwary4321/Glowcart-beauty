"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminCoupon,
  deleteAdminCoupon,
  fetchAdminCoupons,
  updateAdminCoupon,
} from "@/lib/admin/services";
import { couponFormSchema, type CouponFormValues } from "@/lib/admin/schemas";
import { notifyFallbackRead, notifyMutationResult } from "@/lib/admin/toast";
import type { AdminCouponRow } from "@/types/admin";

const defaultValues: CouponFormValues = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscountAmount: undefined,
  usageLimit: undefined,
  expiresAt: "",
  isActive: true,
};

export function AdminCouponsSection() {
  const [items, setItems] = useState<AdminCouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const loadItems = useCallback(async () => {
    setLoading(true);
    const result = await fetchAdminCoupons();
    setItems(result.data);
    notifyFallbackRead(result.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function startEdit(row: AdminCouponRow) {
    setEditingId(row.id);
    reset({
      code: row.code,
      description: row.description,
      discountType: row.discountType,
      discountValue: row.discountValue,
      minOrderAmount: row.minOrderAmount,
      usageLimit: row.usageLimit,
      expiresAt: row.expiresAt ?? "",
      isActive: row.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(defaultValues);
  }

  async function onSubmit(values: CouponFormValues) {
    const result = editingId
      ? await updateAdminCoupon(editingId, values)
      : await createAdminCoupon(values);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: editingId ? "Coupon updated." : "Coupon created.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      cancelEdit();
      await loadItems();
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Archive this coupon?")) return;
    setDeletingId(id);
    const result = await deleteAdminCoupon(id);
    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Coupon archived.",
      error: result.error,
      message: result.message,
    });
    if (result.ok) await loadItems();
    setDeletingId(null);
  }

  const columns: AdminTableColumn<AdminCouponRow>[] = [
    {
      key: "code",
      header: "Code",
      cell: (row) => <span className="font-mono font-semibold">{row.code}</span>,
    },
    {
      key: "discount",
      header: "Discount",
      cell: (row) =>
        row.discountType === "percentage" ? `${row.discountValue}%` : `৳${row.discountValue}`,
    },
    {
      key: "usage",
      header: "Usage",
      cell: (row) =>
        row.usageLimit ? `${row.usageCount}/${row.usageLimit}` : `${row.usageCount}`,
    },
    {
      key: "expires",
      header: "Expires",
      cell: (row) =>
        row.expiresAt ? new Date(row.expiresAt).toLocaleDateString("en-BD") : "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          label={row.isActive ? "Active" : "Inactive"}
          variant={row.isActive ? "default" : "outline"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <AdminTableActions onEdit={() => startEdit(row)} />
          <Button variant="ghost" size="sm" className="h-8 text-destructive" disabled={deletingId === row.id} onClick={() => void handleDelete(row.id)}>
            {deletingId === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      ),
    },
  ];

  const isActive = watch("isActive");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      {loading ? <AdminTableSkeleton /> : <AdminDataTable columns={columns} data={items} />}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Coupon" : "Create Coupon"}</CardTitle>
          <CardDescription>Connected to POST/PUT /api/coupons with fallback support.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField label="Coupon code" htmlFor="code" error={errors.code?.message}>
              <Input id="code" className="h-10 rounded-lg uppercase" {...register("code")} />
            </FormField>
            <FormField label="Discount type" htmlFor="discountType" error={errors.discountType?.message}>
              <Select id="discountType" className="h-10" {...register("discountType")}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </Select>
            </FormField>
            <FormField label="Discount value" htmlFor="discountValue" error={errors.discountValue?.message}>
              <Input id="discountValue" type="number" className="h-10 rounded-lg" {...register("discountValue", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Minimum order (৳)" htmlFor="minOrderAmount" error={errors.minOrderAmount?.message}>
              <Input id="minOrderAmount" type="number" className="h-10 rounded-lg" {...register("minOrderAmount", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Expires at" htmlFor="expiresAt" error={errors.expiresAt?.message}>
              <Input id="expiresAt" type="date" className="h-10 rounded-lg" {...register("expiresAt")} />
            </FormField>
            <FormField label="Description" htmlFor="description" error={errors.description?.message}>
              <Textarea id="description" {...register("description")} />
            </FormField>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : editingId ? "Update" : "Create"}
              </Button>
              {editingId ? <Button type="button" variant="outline" className="rounded-full" onClick={cancelEdit}>Cancel</Button> : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
