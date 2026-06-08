import type { Metadata } from "next";

import { AdminOrdersTable, AdminPageHeader } from "@/components/admin";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Track and update customer orders and payment status."
      />
      <AdminOrdersTable />
    </div>
  );
}
