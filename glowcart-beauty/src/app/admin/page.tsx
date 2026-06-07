import {
  AdminLowStockCard,
  AdminPageHeader,
  AdminRecentOrdersCard,
  AdminSalesChart,
  AdminStatCard,
} from "@/components/admin";
import { adminDashboardStats } from "@/data/admin";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store performance and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminDashboardStats.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AdminSalesChart />
        <AdminLowStockCard />
      </div>

      <AdminRecentOrdersCard />
    </div>
  );
}
