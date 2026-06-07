"use client";

import {
  AlertTriangle,
  Award,
  BadgePercent,
  PackageSearch,
  Repeat,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFormatCurrency } from "@/components/admin/admin-data-table";
import type { AnalyticsInsights } from "@/types/analytics";

type AnalyticsInsightsGridProps = {
  insights: AnalyticsInsights;
};

const insightCards = [
  {
    key: "bestSellingProduct",
    title: "Best Selling Product",
    icon: Award,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "slowMovingProduct",
    title: "Slow Moving Product",
    icon: PackageSearch,
    accent: "text-amber-600 bg-amber-50",
  },
  {
    key: "lowStockWarning",
    title: "Low Stock Warning",
    icon: AlertTriangle,
    accent: "text-destructive bg-rose-50",
  },
  {
    key: "highestRevenueCategory",
    title: "Top Revenue Category",
    icon: TrendingUp,
    accent: "text-primary bg-primary/10",
  },
  {
    key: "repeatCustomerCount",
    title: "Repeat Customers",
    icon: Repeat,
    accent: "text-sky-600 bg-sky-50",
  },
  {
    key: "couponUsageSummary",
    title: "Coupon Usage",
    icon: BadgePercent,
    accent: "text-violet-600 bg-violet-50",
  },
] as const;

export function AnalyticsInsightsGrid({ insights }: AnalyticsInsightsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {insightCards.map(({ key, title, icon: Icon, accent }) => {
        let headline = "—";
        let detail = "";

        switch (key) {
          case "bestSellingProduct":
            headline = insights.bestSellingProduct.name;
            detail = `${insights.bestSellingProduct.unitsSold} units · ${adminFormatCurrency(insights.bestSellingProduct.revenue)}`;
            break;
          case "slowMovingProduct":
            headline = insights.slowMovingProduct.name;
            detail = `${insights.slowMovingProduct.unitsSold} sold · ${insights.slowMovingProduct.stock} in stock`;
            break;
          case "lowStockWarning":
            headline = `${insights.lowStockWarning.count} products`;
            detail = insights.lowStockWarning.topItem
              ? `Lowest: ${insights.lowStockWarning.topItem}`
              : "Review inventory levels";
            break;
          case "highestRevenueCategory":
            headline = insights.highestRevenueCategory.name;
            detail = `${adminFormatCurrency(insights.highestRevenueCategory.revenue)} · ${insights.highestRevenueCategory.share}% share`;
            break;
          case "repeatCustomerCount":
            headline = String(insights.repeatCustomerCount);
            detail = "Customers with 2+ orders in period";
            break;
          case "couponUsageSummary":
            headline = insights.couponUsageSummary.topCoupon ?? "No coupons";
            detail = `${insights.couponUsageSummary.topCouponUses} uses · ${insights.couponUsageSummary.totalUsed} total redemptions`;
            break;
        }

        return (
          <Card key={key} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-1">{headline}</CardDescription>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="size-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
