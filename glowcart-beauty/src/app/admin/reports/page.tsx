import type { Metadata } from "next";

import { AdminPageHeader, AdminReportsHub } from "@/components/admin";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Reports",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Exportable sales, order, product, and customer reports for business review."
        backHref={routes.admin.analytics}
      />
      <AdminReportsHub />
    </div>
  );
}
