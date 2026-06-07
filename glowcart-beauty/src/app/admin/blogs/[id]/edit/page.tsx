import { AdminPageHeader, AdminBlogForm } from "@/components/admin";
import { routes } from "@/constants/routes";

type AdminEditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPage({ params }: AdminEditBlogPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Blog Post"
        description="Update content, SEO, and publish status."
        backHref={routes.admin.blogs}
      />
      <AdminBlogForm mode="edit" blogId={id} />
    </div>
  );
}
