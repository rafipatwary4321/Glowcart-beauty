"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { adminUsers } from "@/data/admin";
import type { AdminUserRow } from "@/types/admin";

const columns: AdminTableColumn<AdminUserRow>[] = [
  {
    key: "name",
    header: "User",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (row) => <Badge variant="outline" className="capitalize">{row.role}</Badge>,
  },
  {
    key: "orders",
    header: "Orders",
    cell: (row) => row.orderCount,
  },
  {
    key: "joined",
    header: "Joined",
    cell: (row) => new Date(row.joinedAt).toLocaleDateString("en-BD"),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge
        label={row.status}
        variant={row.status === "active" ? "default" : "destructive"}
      />
    ),
  },
  {
    key: "actions",
    header: "",
    className: "text-right",
    cell: () => <AdminTableActions onEdit={() => undefined} />,
  },
];

export function AdminUsersTable() {
  return <AdminDataTable columns={columns} data={adminUsers} />;
}
