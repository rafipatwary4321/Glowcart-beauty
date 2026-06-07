import type { Metadata } from "next";

import { OrderHistoryList } from "@/components/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Order History",
};

export default function ProfileOrdersPage() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Order history</CardTitle>
        <CardDescription>
          Your recent GlowCart orders. Real orders appear here after checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderHistoryList />
      </CardContent>
    </Card>
  );
}
