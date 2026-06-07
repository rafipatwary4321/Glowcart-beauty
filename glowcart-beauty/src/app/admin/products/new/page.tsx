import { AdminPageHeader, AdminProductForm } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add Product"
        description="Create a new product for your catalog."
        backHref={routes.admin.products}
      />
      <AdminProductForm mode="create" />
    </div>
  );
}
