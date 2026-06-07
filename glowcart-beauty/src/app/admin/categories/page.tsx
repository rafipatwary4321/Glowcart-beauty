import { AdminCategoriesSection, AdminPageHeader } from "@/components/admin";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize products into browsable categories."
      />
      <AdminCategoriesSection />
    </div>
  );
}
