import { AdminOrdersReportContent, AdminPageHeader } from "@/components/admin";
import { routes } from "@/constants/routes";

export default function AdminOrdersReportPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders Report"
        description="Order volume, fulfillment status, and recent activity."
        backHref={routes.admin.reports}
      />
      <AdminOrdersReportContent />
    </div>
  );
}
