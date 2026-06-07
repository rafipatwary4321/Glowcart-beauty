import { AdminBlogsTable, AdminPageHeader } from "@/components/admin";

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Manage beauty tips, tutorials, and editorial content."
      />
      <AdminBlogsTable />
    </div>
  );
}
