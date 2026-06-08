"use client";

import { Loader2, Package, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableSkeleton,
  type AdminTableColumn,
} from "@/components/admin";
import { AdminErrorState } from "@/components/admin/admin-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type InventoryRow = {
  id: string;
  name: string;
  slug: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  category: string;
  brand: string;
};

type HistoryRow = {
  id: string;
  changeType: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  note?: string;
  createdAt: string;
  product?: { name?: string };
  order?: { orderNumber?: string };
};

export function AdminInventorySection() {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inventoryRes, historyRes] = await Promise.all([
        fetch("/api/inventory", { cache: "no-store" }),
        fetch("/api/inventory?view=history", { cache: "no-store" }),
      ]);
      const inventoryJson = await inventoryRes.json();
      const historyJson = await historyRes.json();
      if (inventoryJson.success) setItems(inventoryJson.data.items);
      if (historyJson.success) setHistory(historyJson.data.items);
      if (!inventoryJson.success) {
        throw new Error("Inventory request failed.");
      }
    } catch {
      setError("Unable to load inventory.");
      toast.error("Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleUpdateStock() {
    if (!selectedId || stockValue === "") {
      toast.error("Select a product and enter stock.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedId,
          stock: Number(stockValue),
          note,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error ?? "Update failed.");
      toast.success("Stock updated.");
      setNote("");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  const columns: AdminTableColumn<InventoryRow>[] = [
    {
      key: "product",
      header: "Product",
      cell: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.category} · {row.brand}</p>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (row) => row.stock,
    },
    {
      key: "reserved",
      header: "Reserved",
      cell: (row) => row.reservedStock,
    },
    {
      key: "available",
      header: "Available",
      cell: (row) => (
        <span className={row.isOutOfStock ? "text-destructive font-medium" : ""}>
          {row.availableStock}
        </span>
      ),
    },
    {
      key: "threshold",
      header: "Low Stock At",
      cell: (row) => row.lowStockThreshold,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          label={row.isOutOfStock ? "Out of stock" : row.isLowStock ? "Low stock" : "Healthy"}
          variant={row.isOutOfStock ? "destructive" : row.isLowStock ? "outline" : "default"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => {
            setSelectedId(row.id);
            setStockValue(String(row.stock));
          }}
        >
          Adjust
        </Button>
      ),
    },
  ];

  const lowStockItems = items.filter((item) => item.isLowStock || item.isOutOfStock);

  return (
    <div className="space-y-8">
      {loading ? (
        <AdminTableSkeleton rows={8} />
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => void loadData()} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>Total SKUs</CardDescription>
                <CardTitle className="text-2xl">{items.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>Low Stock</CardDescription>
                <CardTitle className="text-2xl text-amber-600">{lowStockItems.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>Out of Stock</CardDescription>
                <CardTitle className="text-2xl text-destructive">
                  {items.filter((item) => item.isOutOfStock).length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="size-5 text-primary" />
                Stock Update
              </CardTitle>
              <CardDescription>Adjust on-hand stock for a product.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-[1fr_140px_1fr_auto]">
              <Input
                placeholder="Select a product with Adjust"
                value={selectedId ? items.find((item) => item.id === selectedId)?.name ?? selectedId : ""}
                readOnly
              />
              <Input
                type="number"
                min={0}
                placeholder="Stock"
                value={stockValue}
                onChange={(event) => setStockValue(event.target.value)}
              />
              <Input
                placeholder="Note (optional)"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <Button
                type="button"
                className="w-full rounded-full md:w-auto"
                disabled={saving}
                onClick={() => void handleUpdateStock()}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </Button>
            </CardContent>
          </Card>

          <AdminDataTable columns={columns} data={items} emptyMessage="No products found." />

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Stock History</CardTitle>
              <CardDescription>Recent inventory movements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock history yet.</p>
              ) : (
                history.slice(0, 20).map((entry) => (
                  <div key={entry.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 text-sm last:border-0">
                    <div>
                      <p className="font-medium">
                        {entry.product?.name ?? "Product"} · {entry.changeType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.note ?? "Inventory update"}
                        {entry.order?.orderNumber ? ` · ${entry.order.orderNumber}` : ""}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{entry.stockBefore} → {entry.stockAfter}</p>
                      <p>{new Date(entry.createdAt).toLocaleString("en-BD")}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
