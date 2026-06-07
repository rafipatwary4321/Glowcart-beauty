"use client";

import {
  AdminDataTable,
  adminFormatCurrency,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/constants/routes";
import { adminProducts } from "@/data/admin";
import type { AdminProductRow } from "@/types/admin";

const columns: AdminTableColumn<AdminProductRow>[] = [
  {
    key: "product",
    header: "Product",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div
          className={`size-10 shrink-0 rounded-lg bg-gradient-to-br ${row.imageGradient}`}
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{row.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.sku}</p>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    cell: (row) => row.category,
  },
  {
    key: "brand",
    header: "Brand",
    cell: (row) => row.brand,
  },
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
      <Badge variant={row.stockCount <= 20 ? "destructive" : "outline"}>
        {row.stockCount}
      </Badge>
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
      <AdminTableActions
        editHref={routes.admin.productEdit(row.id)}
        onDelete={() => undefined}
      />
    ),
  },
];

export function AdminProductsTable() {
  return <AdminDataTable columns={columns} data={adminProducts} />;
}
