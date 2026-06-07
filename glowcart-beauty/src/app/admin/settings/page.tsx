import { AdminPageHeader, AdminSettingsForm } from "@/components/admin";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Settings"
        description="Configure storefront content, contact details, and policies."
      />
      <AdminSettingsForm />
    </div>
  );
}
