import { notFound } from "next/navigation";

import { AdminPageHeader, AdminProductForm } from "@/components/admin";
import { routes } from "@/constants/routes";
import { getAdminProductFormDefaults, getAdminProductById } from "@/data/admin";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  const product = getAdminProductById(id);

  if (!product) {
    notFound();
  }

  const initialValues = getAdminProductFormDefaults(id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Product"
        description={`Update details for ${product.name}.`}
        backHref={routes.admin.products}
      />
      <AdminProductForm mode="edit" initialValues={initialValues} />
    </div>
  );
}
