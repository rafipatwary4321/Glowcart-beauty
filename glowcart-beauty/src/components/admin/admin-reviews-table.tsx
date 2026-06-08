"use client";

import { useCallback, useEffect, useState } from "react";

import {
  AdminDataTable,
  AdminStatusBadge,
  AdminTableSkeleton,
  type AdminTableColumn,
} from "@/components/admin";
import { AdminErrorState } from "@/components/admin/admin-state";
import { adminReviews } from "@/data/admin";
import { isDevFallbackEnabled } from "@/lib/admin/api-client";
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
];

export function AdminReviewsTable() {
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const json = await response.json();

      if (response.ok && json.success) {
        setReviews(
          (json.data.items as AdminReviewRow[]).map((item) => ({
            ...item,
            createdAt: String(item.createdAt ?? new Date().toISOString()),
          }))
        );
        return;
      }

      if (isDevFallbackEnabled()) {
        setReviews(adminReviews);
        return;
      }

      throw new Error("Reviews request failed.");
    } catch {
      if (isDevFallbackEnabled()) {
        setReviews(adminReviews);
      } else {
        setError("Unable to load reviews.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  if (loading) return <AdminTableSkeleton rows={6} />;

  if (error) {
    return <AdminErrorState message={error} onRetry={() => void loadReviews()} />;
  }

  return (
    <AdminDataTable
      columns={columns}
      data={reviews}
      emptyMessage="No customer reviews yet."
    />
  );
}
