import { AdminCouponForm, AdminCouponsTable, AdminPageHeader } from "@/components/admin";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coupons"
        description="Create and manage discount codes for your store."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminCouponsTable />
        <AdminCouponForm />
      </div>
    </div>
  );
}
