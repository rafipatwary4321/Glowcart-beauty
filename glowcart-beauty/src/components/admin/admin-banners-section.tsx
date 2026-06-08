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
import { AdminErrorState } from "@/components/admin/admin-state";
import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { FormField } from "@/components/admin/form-field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminBanner,
  deleteAdminBanner,
  fetchAdminBanners,
  updateAdminBanner,
} from "@/lib/admin/services";
import { bannerFormSchema, type BannerFormValues } from "@/lib/admin/schemas";
import { notifyFallbackRead, notifyMutationResult } from "@/lib/admin/toast";
import type { AdminBannerRow } from "@/types/admin";

const defaultValues: BannerFormValues = {
  title: "",
  subtitle: "",
  description: "",
  type: "promo",
  imageUrl: "",
  imageGradient: "from-rose-100 to-pink-50",
  ctaLabel: "",
  ctaHref: "",
  sortOrder: 0,
  isActive: true,
};

export function AdminBannersSection() {
  const [items, setItems] = useState<AdminBannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminBanners();
      setItems(result.data);
      notifyFallbackRead(result.source);
    } catch {
      setError("Unable to load banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function startEdit(row: AdminBannerRow) {
    setEditingId(row.id);
    reset({
      title: row.title,
      subtitle: row.subtitle ?? "",
      description: row.description ?? "",
      type: row.type,
      imageUrl: row.imageUrl ?? "",
      imageGradient: row.imageGradient,
      ctaLabel: row.ctaLabel ?? "",
      ctaHref: row.ctaHref ?? "",
      sortOrder: row.sortOrder,
      isActive: row.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(defaultValues);
  }

  async function onSubmit(values: BannerFormValues) {
    const result = editingId
      ? await updateAdminBanner(editingId, values)
      : await createAdminBanner(values);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: editingId ? "Banner updated." : "Banner created.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      cancelEdit();
      await loadItems();
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Archive this banner?")) return;
    setDeletingId(id);
    const result = await deleteAdminBanner(id);
    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Banner archived.",
      error: result.error,
      message: result.message,
    });
    if (result.ok) await loadItems();
    setDeletingId(null);
  }

  const columns: AdminTableColumn<AdminBannerRow>[] = [
    {
      key: "banner",
      header: "Banner",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <AdminImagePreview
            imageUrl={row.imageUrl}
            imageGradient={row.imageGradient}
            alt={row.title}
            size="md"
          />
          <div>
            <p className="font-medium">{row.title}</p>
            {row.subtitle ? <p className="text-xs text-muted-foreground">{row.subtitle}</p> : null}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => <AdminStatusBadge label={row.type} variant="outline" />,
    },
    { key: "sort", header: "Order", cell: (row) => row.sortOrder },
    {
      key: "status",
      header: "Status",
      cell: (row) => <AdminStatusBadge label={row.isActive ? "Active" : "Inactive"} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <AdminTableActions onEdit={() => startEdit(row)} />
          <Button variant="ghost" size="sm" className="h-8 text-destructive" disabled={deletingId === row.id} onClick={() => void handleDelete(row.id)} aria-label={`Archive ${row.title}`}>
            {deletingId === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      ),
    },
  ];

  const isActive = watch("isActive");
  const imageUrl = watch("imageUrl") ?? "";
  const imageGradient = watch("imageGradient") ?? "from-rose-100 to-pink-50";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      {loading ? (
        <AdminTableSkeleton />
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => void loadItems()} />
      ) : (
        <div className="order-2 min-w-0 xl:order-1">
          <AdminDataTable columns={columns} data={items} emptyMessage="No banners yet. Create one using the form." />
        </div>
      )}
      <Card className="order-1 h-fit border-border/60 xl:order-2 xl:sticky xl:top-24">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Banner" : "Add Banner"}</CardTitle>
          <CardDescription>Create homepage hero, promo, and announcement banners.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField label="Title" htmlFor="title" error={errors.title?.message}>
              <Input id="title" className="h-10 rounded-lg" {...register("title")} />
            </FormField>
            <FormField label="Subtitle" htmlFor="subtitle" error={errors.subtitle?.message}>
              <Input id="subtitle" className="h-10 rounded-lg" {...register("subtitle")} />
            </FormField>
            <FormField label="Type" htmlFor="type" error={errors.type?.message}>
              <Select id="type" className="h-10" {...register("type")}>
                <option value="hero">Hero</option>
                <option value="promo">Promo</option>
                <option value="announcement">Announcement</option>
              </Select>
            </FormField>
            <FormField label="Sort order" htmlFor="sortOrder" error={errors.sortOrder?.message}>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                className="h-10 rounded-lg"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Description" htmlFor="description" error={errors.description?.message}>
              <Textarea id="description" {...register("description")} />
            </FormField>
            <FormField label="CTA label" htmlFor="ctaLabel" error={errors.ctaLabel?.message}>
              <Input id="ctaLabel" className="h-10 rounded-lg" {...register("ctaLabel")} />
            </FormField>
            <FormField label="CTA link" htmlFor="ctaHref" error={errors.ctaHref?.message}>
              <Input id="ctaHref" className="h-10 rounded-lg" {...register("ctaHref")} />
            </FormField>
            <ImageUploadField
              folder="banners"
              label="Banner image"
              description="Wide banner artwork. Gradient is used when empty."
              aspectClassName="aspect-[16/9]"
              value={imageUrl ? [imageUrl] : []}
              onChange={(urls) => setValue("imageUrl", urls[0] ?? "", { shouldDirty: true })}
              fallbackGradient={imageGradient}
            />
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
