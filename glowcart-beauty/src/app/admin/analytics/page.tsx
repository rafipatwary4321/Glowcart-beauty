import type { Metadata } from "next";

import { AdminAnalyticsContent, AdminPageHeader } from "@/components/admin";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        description="Track revenue, orders, customers, inventory signals, and business performance."
      />
      <AdminAnalyticsContent />
    </div>
  );
}
