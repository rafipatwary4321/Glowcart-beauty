"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { adminBanners } from "@/data/admin";
import type { AdminBannerRow } from "@/types/admin";

const columns: AdminTableColumn<AdminBannerRow>[] = [
  {
    key: "banner",
    header: "Banner",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div className={`size-12 rounded-lg bg-gradient-to-br ${row.imageGradient}`} />
        <div>
          <p className="font-medium">{row.title}</p>
          {row.subtitle ? (
            <p className="text-xs text-muted-foreground">{row.subtitle}</p>
          ) : null}
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <AdminStatusBadge label={row.type} variant="outline" />,
  },
  {
    key: "sort",
    header: "Order",
    cell: (row) => row.sortOrder,
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

export function AdminBannersTable() {
  return <AdminDataTable columns={columns} data={adminBanners} />;
}
