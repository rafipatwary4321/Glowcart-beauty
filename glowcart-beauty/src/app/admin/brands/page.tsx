import { AdminBrandsTable, AdminEntityForm, AdminPageHeader } from "@/components/admin";

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Brands"
        description="Manage the brands featured across your store."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminBrandsTable />
        <AdminEntityForm entity="brand" />
      </div>
    </div>
  );
}
