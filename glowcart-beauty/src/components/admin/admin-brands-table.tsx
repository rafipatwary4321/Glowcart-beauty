"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { adminBrands } from "@/data/admin";
import type { AdminBrandRow } from "@/types/admin";

const columns: AdminTableColumn<AdminBrandRow>[] = [
  {
    key: "name",
    header: "Brand",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-lg bg-gradient-to-br ${row.imageGradient}`} />
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.tagline}</p>
        </div>
      </div>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    cell: (row) => row.slug,
  },
  {
    key: "products",
    header: "Products",
    cell: (row) => row.productCount,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge label={row.isActive ? "Active" : "Inactive"} />
    ),
  },
  {
    key: "actions",
    header: "",
    className: "text-right",
    cell: () => (
      <AdminTableActions onEdit={() => undefined} onDelete={() => undefined} />
    ),
  },
];

export function AdminBrandsTable() {
  return <AdminDataTable columns={columns} data={adminBrands} />;
}
