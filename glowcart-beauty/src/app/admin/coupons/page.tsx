import { AdminCouponsSection, AdminPageHeader } from "@/components/admin";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coupons"
        description="Create and manage discount codes for your store."
      />
      <AdminCouponsSection />
    </div>
  );
}
