import { AdminPageHeader, AdminSalesReportContent } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminSalesReportPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sales Report"
        description="Revenue performance and daily sales breakdown."
        backHref={routes.admin.reports}
      />
      <AdminSalesReportContent />
    </div>
  );
}
