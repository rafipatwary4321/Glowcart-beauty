import type { Metadata } from "next";

import { AdminBlogsTable, AdminPageHeader } from "@/components/admin";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Blog",
};

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Manage beauty tips, tutorials, and editorial content."
        actionLabel="New Post"
        actionHref={routes.admin.blogsNew}
      />
      <AdminBlogsTable />
    </div>
  );
}
