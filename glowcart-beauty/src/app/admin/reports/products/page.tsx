import { AdminPageHeader, AdminProductsReportContent } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminProductsReportPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products Report"
        description="Catalog performance, top sellers, and inventory risk signals."
        backHref={routes.admin.reports}
      />
      <AdminProductsReportContent />
    </div>
  );
}
