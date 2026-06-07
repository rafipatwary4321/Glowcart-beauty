"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { adminCoupons } from "@/data/admin";
import type { AdminCouponRow } from "@/types/admin";

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
      row.discountType === "percentage"
        ? `${row.discountValue}%`
        : `৳${row.discountValue}`,
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
      row.expiresAt
        ? new Date(row.expiresAt).toLocaleDateString("en-BD")
        : "—",
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
    cell: () => (
      <AdminTableActions onEdit={() => undefined} onDelete={() => undefined} />
    ),
  },
];

export function AdminCouponsTable() {
  return <AdminDataTable columns={columns} data={adminCoupons} />;
}
