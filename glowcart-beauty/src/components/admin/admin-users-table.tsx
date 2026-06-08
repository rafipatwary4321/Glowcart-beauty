"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { adminUsers } from "@/data/admin";
import type { AdminUserRow } from "@/types/admin";

function formatRole(role: AdminUserRow["role"]) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatStatus(status: AdminUserRow["status"]) {
  return status === "active" ? "Active" : "Inactive";
}

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
    className: "hidden sm:table-cell",
    cell: (row) => <Badge variant="outline">{formatRole(row.role)}</Badge>,
  },
  {
    key: "orders",
    header: "Orders",
    cell: (row) => row.orderCount,
  },
  {
    key: "joined",
    header: "Joined",
    className: "hidden md:table-cell",
    cell: (row) => new Date(row.joinedAt).toLocaleDateString("en-BD"),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge
        label={formatStatus(row.status)}
        variant={row.status === "active" ? "default" : "destructive"}
      />
    ),
  },
];

export function AdminUsersTable() {
  return (
    <AdminDataTable
      columns={columns}
      data={adminUsers}
      emptyMessage="No users found."
    />
  );
}
