"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  AdminDataTable,
  AdminStatusBadge,
  type AdminTableColumn,
} from "@/components/admin/admin-data-table";
import { AdminTableSkeleton } from "@/components/admin/admin-table-skeleton";
import { AdminErrorState } from "@/components/admin/admin-state";
import { AdminImagePreview } from "@/components/admin/admin-image-preview";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { deleteAdminBlog, fetchAdminBlog, fetchAdminBlogs, updateAdminBlog } from "@/lib/admin/services";
import { notifyFallbackRead, notifyMutationResult } from "@/lib/admin/toast";
import type { AdminBlogRow } from "@/types/admin";

export function AdminBlogsTable() {
  const [items, setItems] = useState<AdminBlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAdminBlogs();
      setItems(result.data);
      notifyFallbackRead(result.source);
    } catch {
      setError("Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this blog post?")) return;
    setDeletingId(id);
    const result = await deleteAdminBlog(id);
    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: "Blog deleted.",
      error: result.error,
      message: result.message,
    });
    if (result.ok) await loadItems();
    setDeletingId(null);
  }

  async function togglePublish(row: AdminBlogRow) {
    setTogglingId(row.id);
    const { data: blog } = await fetchAdminBlog(row.id);
    const nextStatus = row.status === "published" ? "draft" : "published";
    const result = await updateAdminBlog(row.id, {
      title: blog.title,
      slug: blog.slug,
      coverImage: blog.coverImage ?? "",
      excerpt: blog.excerpt,
      content: blog.content ?? "",
      author: blog.author,
      category: blog.category,
      tags: blog.tags?.join(", ") ?? "",
      status: nextStatus,
      seoTitle: blog.seoTitle ?? "",
      seoDescription: blog.seoDescription ?? "",
    });
    notifyMutationResult({
      ok: result.ok,
      source: result.source,
      successMessage: nextStatus === "published" ? "Blog published." : "Blog unpublished.",
      error: result.error,
      message: result.message,
    });
    if (result.ok) await loadItems();
    setTogglingId(null);
  }

  const columns: AdminTableColumn<AdminBlogRow>[] = [
    {
      key: "title",
      header: "Title",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <AdminImagePreview
            imageUrl={row.coverImage}
            alt={row.title}
            imageGradient="from-rose-100 to-pink-50"
            size="sm"
          />
          <div>
            <p className="font-medium text-foreground">{row.title}</p>
            <p className="text-xs text-muted-foreground">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", className: "hidden md:table-cell", cell: (row) => row.category },
    { key: "author", header: "Author", className: "hidden lg:table-cell", cell: (row) => row.author },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge
          label={row.status === "published" ? "Published" : "Draft"}
          variant={row.status === "published" ? "default" : "outline"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="h-8 rounded-full px-3">
            <Link href={routes.admin.blogEdit(row.id)}>Edit</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3"
            disabled={togglingId === row.id}
            onClick={() => void togglePublish(row)}
          >
            {togglingId === row.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : row.status === "published" ? (
              "Unpublish"
            ) : (
              "Publish"
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-destructive hover:text-destructive"
            disabled={deletingId === row.id}
            onClick={() => void handleDelete(row.id)}
            aria-label={`Delete ${row.title}`}
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

  if (loading) return <AdminTableSkeleton rows={5} />;

  if (error) {
    return <AdminErrorState message={error} onRetry={() => void loadItems()} />;
  }

  return <AdminDataTable columns={columns} data={items} emptyMessage="No blog posts yet." />;
}
