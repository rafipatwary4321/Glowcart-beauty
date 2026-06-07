import { AdminCategoriesTable, AdminEntityForm, AdminPageHeader } from "@/components/admin";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Organize products into browsable categories."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminCategoriesTable />
        <AdminEntityForm entity="category" />
      </div>
    </div>
  );
}
