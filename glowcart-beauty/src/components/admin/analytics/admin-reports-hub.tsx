"use client";

import Link from "next/link";
import { BarChart3, FileSpreadsheet, ShoppingBag, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/constants/routes";

const reportLinks = [
  {
    title: "Sales Report",
    description: "Revenue trends, daily breakdown, and average order value.",
    href: routes.admin.reportsSales,
    icon: TrendingUp,
  },
  {
    title: "Orders Report",
    description: "Fulfillment status, recent orders, and cancellation rates.",
    href: routes.admin.reportsOrders,
    icon: ShoppingBag,
  },
  {
    title: "Products Report",
    description: "Top sellers, slow movers, and category performance.",
    href: routes.admin.reportsProducts,
    icon: BarChart3,
  },
  {
    title: "Customers Report",
    description: "Growth, repeat buyers, and highest-value customers.",
    href: routes.admin.reportsCustomers,
    icon: Users,
  },
] as const;

export function AdminReportsHub() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reportLinks.map(({ title, description, href, icon: Icon }) => (
        <Link key={href} href={href}>
          <Card className="h-full border-border/60 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <FileSpreadsheet className="size-4" />
                Open report
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
