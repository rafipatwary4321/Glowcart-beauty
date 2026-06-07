"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { deleteAdminProduct, fetchAdminProducts } from "@/lib/admin/services";
import { notifyFallbackRead, notifyMutationResult } from "@/lib/admin/toast";
import type { AdminProductRow } from "@/types/admin";

export function AdminProductsTable() {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const result = await fetchAdminProducts();
    setProducts(result.data);
    notifyFallbackRead(result.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function handleDelete(id: string) {
    if (!window.confirm("Archive this product?")) return;

    setDeletingId(id);
    const result = await deleteAdminProduct(id);

    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Product archived.",
      error: result.error,
      message: result.message,
    });

    if (result.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
    }

    setDeletingId(null);
  }

  const columns: AdminTableColumn<AdminProductRow>[] = [
    {
      key: "product",
      header: "Product",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`size-10 shrink-0 rounded-lg bg-gradient-to-br ${row.imageGradient}`} />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", cell: (row) => row.category },
    { key: "brand", header: "Brand", cell: (row) => row.brand },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <div>
          <p className="font-medium">{adminFormatCurrency(row.price)}</p>
          {row.originalPrice ? (
            <p className="text-xs text-muted-foreground line-through">
              {adminFormatCurrency(row.originalPrice)}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (row) => (
        <Badge variant={row.stockCount <= 20 ? "destructive" : "outline"}>{row.stockCount}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          label={row.inStock ? "In stock" : "Out of stock"}
          variant={row.inStock ? "default" : "outline"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <AdminTableActions editHref={routes.admin.productEdit(row.id)} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-destructive hover:text-destructive"
            disabled={deletingId === row.id}
            onClick={() => void handleDelete(row.id)}
          >
            {deletingId === row.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <AdminTableSkeleton rows={8} />;

  return <AdminDataTable columns={columns} data={products} />;
}
