import type { Metadata } from "next";

import { AddressList, OrderHistoryList } from "@/components/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Profile Overview",
};

export default function ProfilePage() {
  return (
    <>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderHistoryList />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Saved addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressList />
        </CardContent>
      </Card>
    </>
  );
}
