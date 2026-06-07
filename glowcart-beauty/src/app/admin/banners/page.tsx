import { AdminBannersSection, AdminPageHeader } from "@/components/admin";

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
