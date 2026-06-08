import type { Metadata } from "next";

import { AdminPageHeader, AdminUsersTable } from "@/components/admin";

export const metadata: Metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="View customers and admin accounts."
      />
      <AdminUsersTable />
    </div>
  );
}
