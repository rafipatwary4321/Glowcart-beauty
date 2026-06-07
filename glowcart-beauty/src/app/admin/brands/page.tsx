import { AdminBrandsSection, AdminPageHeader } from "@/components/admin";

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Brands"
        description="Manage the brands featured across your store."
      />
      <AdminBrandsSection />
    </div>
  );
}
