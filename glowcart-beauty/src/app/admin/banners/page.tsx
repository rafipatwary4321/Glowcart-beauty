import { AdminBannersTable, AdminEntityForm, AdminPageHeader } from "@/components/admin";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banners"
        description="Manage homepage hero, promo, and announcement banners."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminBannersTable />
        <AdminEntityForm entity="banner" />
      </div>
    </div>
  );
}
