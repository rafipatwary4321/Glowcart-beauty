import type { Metadata } from "next";

import { AdminBannersSection, AdminPageHeader } from "@/components/admin";

export const metadata: Metadata = {
  title: "Banners",
};

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banners"
        description="Manage homepage hero, promo, and announcement banners."
      />
      <AdminBannersSection />
    </div>
  );
}
