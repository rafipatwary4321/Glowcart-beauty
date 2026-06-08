import type { Metadata } from "next";

import { AdminPageHeader, AdminProductsTable } from "@/components/admin";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your product catalog, pricing, and inventory."
        actionLabel="Add Product"
        actionHref={routes.admin.productsNew}
      />
      <AdminProductsTable />
    </div>
  );
}
