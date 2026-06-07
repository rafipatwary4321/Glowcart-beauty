import type { Metadata } from "next";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isAdmin } from "@/lib/auth/roles";
import { routes } from "@/constants/routes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function ProfileSettingsPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Placeholder settings form — updates will persist once the backend is connected.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="settings-name" className="text-sm font-medium">
              Full name
            </label>
            <Input
              id="settings-name"
              defaultValue={user?.name ?? ""}
              className="h-10 rounded-full px-4"
              disabled
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="settings-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="settings-email"
              type="email"
              defaultValue={user?.email ?? ""}
              className="h-10 rounded-full px-4"
              disabled
            />
          </div>
          <Button className="rounded-full sm:col-span-2" disabled>
            Save changes
          </Button>
        </CardContent>
      </Card>

      {isAdmin(session) ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Admin access</CardTitle>
            <CardDescription>
              Role-based routing placeholder for admin-only areas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={routes.admin.root}>Go to admin dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
