import { AdminPageHeader, AdminBlogForm } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminNewBlogPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Blog Post"
        description="Create a beauty tips article for the blog."
        backHref={routes.admin.blogs}
      />
      <AdminBlogForm mode="create" />
    </div>
  );
}
