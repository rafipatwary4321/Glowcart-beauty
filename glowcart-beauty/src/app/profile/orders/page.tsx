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
          Placeholder order data until the orders module is connected to the backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderHistoryList />
      </CardContent>
    </Card>
  );
}
