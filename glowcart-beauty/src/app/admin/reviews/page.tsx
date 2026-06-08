import type { Metadata } from "next";

import { AdminPageHeader, AdminReviewsTable } from "@/components/admin";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reviews"
        description="Moderate product reviews and verified purchase feedback."
      />
      <AdminReviewsTable />
    </div>
  );
}
