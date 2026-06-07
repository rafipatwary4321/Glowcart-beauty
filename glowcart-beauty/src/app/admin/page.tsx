import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";
import { AdminPageHeader } from "@/components/admin";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store performance and recent activity."
      />
      <AdminDashboardContent />
    </div>
  );
}
