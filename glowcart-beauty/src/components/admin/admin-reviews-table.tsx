"use client";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableActions,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { adminReviews } from "@/data/admin";
import type { AdminReviewRow } from "@/types/admin";

const columns: AdminTableColumn<AdminReviewRow>[] = [
  {
    key: "product",
    header: "Product",
    cell: (row) => row.productName,
  },
  {
    key: "author",
    header: "Author",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.authorName}</p>
        <p className="text-xs text-muted-foreground">
          {row.verified ? "Verified purchase" : "Unverified"}
        </p>
      </div>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    cell: (row) => `${row.rating} ★`,
  },
  {
    key: "comment",
    header: "Comment",
    cell: (row) => (
      <p className="max-w-xs truncate text-muted-foreground">{row.comment}</p>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge
        label={row.isApproved ? "Approved" : "Pending"}
        variant={row.isApproved ? "default" : "outline"}
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

export function AdminReviewsTable() {
  return <AdminDataTable columns={columns} data={adminReviews} />;
}
