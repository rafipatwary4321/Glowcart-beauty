import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

type AdminLayoutShellProps = {
  children: React.ReactNode;
};

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-beige-50/40">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <AdminTopbar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
