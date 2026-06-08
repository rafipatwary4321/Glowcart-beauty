import { AdminInventorySection } from "@/components/admin/admin-inventory-section";
import { AdminPageHeader } from "@/components/admin";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory"
        description="Monitor stock levels, reservations, and inventory history."
      />
      <AdminInventorySection />
    </div>
  );
}
