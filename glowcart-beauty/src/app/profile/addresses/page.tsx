import type { Metadata } from "next";

import { AddressList } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Saved Addresses",
};

export default function ProfileAddressesPage() {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Saved addresses</CardTitle>
          <CardDescription>
            Manage delivery addresses for faster checkout.
          </CardDescription>
        </div>
        <Button variant="outline" className="rounded-full" disabled>
          Add address
        </Button>
      </CardHeader>
      <CardContent>
        <AddressList />
      </CardContent>
    </Card>
  );
}
