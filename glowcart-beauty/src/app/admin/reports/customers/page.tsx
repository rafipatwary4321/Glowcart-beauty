import { AdminCustomersReportContent, AdminPageHeader } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminCustomersReportPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers Report"
        description="Customer growth, repeat buyers, and top spenders."
        backHref={routes.admin.reports}
      />
      <AdminCustomersReportContent />
    </div>
  );
}
