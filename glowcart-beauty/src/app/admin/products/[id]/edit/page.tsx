import { AdminPageHeader, AdminProductForm } from "@/components/admin";
import { routes } from "@/constants/routes";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Product"
        description="Update product details and inventory."
        backHref={routes.admin.products}
      />
      <AdminProductForm mode="edit" productId={id} />
    </div>
  );
}
