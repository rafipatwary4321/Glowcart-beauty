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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminBrand,
  deleteAdminBrand,
  fetchAdminBrands,
  updateAdminBrand,
} from "@/lib/admin/services";
import { brandFormSchema, type BrandFormValues } from "@/lib/admin/schemas";
import { notifyFallbackRead, notifyMutationResult } from "@/lib/admin/toast";
import type { AdminBrandRow } from "@/types/admin";

const defaultValues: BrandFormValues = {
  name: "",
  slug: "",
  tagline: "",
  imageUrl: "",
  imageGradient: "from-beige-100 to-nude-100",
  isActive: true,
};

export function AdminBrandsSection() {
  const [items, setItems] = useState<AdminBrandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminBrands();
      setItems(result.data);
      notifyFallbackRead(result.source);
    } catch {
      setError("Unable to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function startEdit(row: AdminBrandRow) {
    setEditingId(row.id);
    reset({
      name: row.name,
      slug: row.slug,
      tagline: row.tagline,
      imageUrl: row.imageUrl ?? "",
      imageGradient: row.imageGradient,
      isActive: row.isActive,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(defaultValues);
  }

  async function onSubmit(values: BrandFormValues) {
    const result = editingId
      ? await updateAdminBrand(editingId, values)
      : await createAdminBrand(values);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: editingId ? "Brand updated." : "Brand created.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      cancelEdit();
      await loadItems();
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Archive this brand?")) return;
    setDeletingId(id);
    const result = await deleteAdminBrand(id);
    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Brand archived.",
      error: result.error,
      message: result.message,
    });
    if (result.ok) await loadItems();
    setDeletingId(null);
  }

  const columns: AdminTableColumn<AdminBrandRow>[] = [
    {
      key: "name",
      header: "Brand",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <AdminImagePreview
            imageUrl={row.imageUrl}
            imageGradient={row.imageGradient}
            alt={row.name}
            size="sm"
          />
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.tagline}</p>
          </div>
        </div>
      ),
    },
    { key: "slug", header: "Slug", cell: (row) => row.slug },
    { key: "products", header: "Products", cell: (row) => row.productCount },
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
          <Button variant="ghost" size="sm" className="h-8 text-destructive" disabled={deletingId === row.id} onClick={() => void handleDelete(row.id)} aria-label={`Archive ${row.name}`}>
            {deletingId === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      ),
    },
  ];

  const isActive = watch("isActive");
  const imageUrl = watch("imageUrl") ?? "";
  const imageGradient = watch("imageGradient") ?? "from-beige-100 to-nude-100";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      {loading ? (
        <AdminTableSkeleton />
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => void loadItems()} />
      ) : (
        <div className="order-2 min-w-0 xl:order-1">
          <AdminDataTable columns={columns} data={items} emptyMessage="No brands yet. Create one using the form." />
        </div>
      )}
      <Card className="order-1 h-fit border-border/60 xl:order-2 xl:sticky xl:top-24">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Brand" : "Add Brand"}</CardTitle>
          <CardDescription>Manage the beauty brands featured in your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField label="Name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" className="h-10 rounded-lg" {...register("name")} />
            </FormField>
            <FormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
              <Input id="slug" className="h-10 rounded-lg" {...register("slug")} />
            </FormField>
            <FormField label="Tagline" htmlFor="tagline" error={errors.tagline?.message}>
              <Textarea id="tagline" {...register("tagline")} />
            </FormField>
            <ImageUploadField
              folder="brands"
              label="Brand logo"
              description="Square logo works best. Gradient used when empty."
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
