import type {
  AnalyticsInsights,
  AnalyticsMetrics,
  AnalyticsOverview,
  ChartPoint,
  CustomersReport,
  OrdersReport,
  ProductsReport,
  SalesReport,
} from "@/types/analytics";
import { products } from "@/data/products";
import { adminSalesChartData } from "@/data/admin";

import { getDateRange } from "./date-range";
import type { AnalyticsRange } from "@/types/analytics";

function buildMetrics(): AnalyticsMetrics {
  return {
    totalRevenue: 842560,
    totalOrders: 1284,
    totalProducts: products.length,
    totalCustomers: 5042,
    averageOrderValue: Math.round(842560 / 1284),
    pendingOrders: 47,
    completedOrders: 1189,
    cancelledOrders: 48,
    lowStockCount: 6,
  };
}

function buildInsights(): AnalyticsInsights {
  return {
    bestSellingProduct: { name: "Velvet Rose Hydrating Serum", unitsSold: 312, revenue: 468000 },
    slowMovingProduct: { name: "Noir Petals Eau de Parfum", unitsSold: 8, stock: 42 },
    lowStockWarning: { count: 6, topItem: "Nude Glow Lip Oil" },
    highestRevenueCategory: { name: "Skincare", revenue: 385000, share: 46 },
    repeatCustomerCount: 892,
    couponUsageSummary: { totalUsed: 470, topCoupon: "GLOW10", topCouponUses: 342 },
  };
}

function buildRevenueChart(): ChartPoint[] {
  return adminSalesChartData.slice(-7).map((point) => ({
    label: point.month,
    value: point.sales,
  }));
}

function buildOrderStatusChart(): ChartPoint[] {
  return [
    { label: "Pending", value: 47 },
    { label: "Processing", value: 86 },
    { label: "Shipped", value: 124 },
    { label: "Delivered", value: 979 },
    { label: "Cancelled", value: 48 },
  ];
}

function buildTopProductsChart(): ChartPoint[] {
  return [
    { label: "Rose Serum", value: 312 },
    { label: "Silk Foundation", value: 248 },
    { label: "Lip Oil", value: 201 },
    { label: "Glow Mist", value: 176 },
    { label: "Night Cream", value: 154 },
  ];
}

function buildCustomerGrowthChart(): ChartPoint[] {
  return [
    { label: "Jan", value: 420 },
    { label: "Feb", value: 510 },
    { label: "Mar", value: 488 },
    { label: "Apr", value: 620 },
    { label: "May", value: 710 },
    { label: "Jun", value: 680 },
  ];
}

function buildCategorySalesChart(): ChartPoint[] {
  return [
    { label: "Skincare", value: 385000 },
    { label: "Makeup", value: 248000 },
    { label: "Fragrances", value: 112000 },
    { label: "Hair Care", value: 62000 },
    { label: "Gifts", value: 35560 },
  ];
}

export function getMockOverview(range: AnalyticsRange): AnalyticsOverview {
  const dateRange = getDateRange(range);
  return {
    metrics: buildMetrics(),
    charts: {
      revenueOverview: buildRevenueChart(),
      orderStatus: buildOrderStatusChart(),
      topProducts: buildTopProductsChart(),
      customerGrowth: buildCustomerGrowthChart(),
      categorySales: buildCategorySalesChart(),
    },
    insights: buildInsights(),
    range: {
      key: dateRange.key,
      label: dateRange.label,
      start: dateRange.startIso,
      end: dateRange.endIso,
    },
    source: "mock",
  };
}

export function getMockSalesReport(range: AnalyticsRange): SalesReport {
  const dateRange = getDateRange(range);
  const daily = buildRevenueChart().map((point, index) => ({
    date: `2026-06-${String(index + 1).padStart(2, "0")}`,
    revenue: point.value,
    orders: Math.round(point.value / 650),
  }));

  return {
    summary: {
      revenue: 842560,
      orders: 1284,
      averageOrderValue: 656,
      growthRate: 12.4,
    },
    daily,
    range: {
      key: dateRange.key,
      label: dateRange.label,
      start: dateRange.startIso,
      end: dateRange.endIso,
    },
    source: "mock",
  };
}

export function getMockOrdersReport(range: AnalyticsRange): OrdersReport {
  const dateRange = getDateRange(range);
  return {
    summary: {
      total: 1284,
      pending: 47,
      completed: 1189,
      cancelled: 48,
      fulfillmentRate: 92.6,
    },
    byStatus: buildOrderStatusChart(),
    recent: [
      {
        id: "ord_001",
        orderNumber: "GC-10519",
        customerName: "Ayesha Rahman",
        total: 4560,
        status: "processing",
        createdAt: new Date().toISOString(),
      },
      {
        id: "ord_002",
        orderNumber: "GC-10501",
        customerName: "Nadia Islam",
        total: 1890,
        status: "shipped",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    range: {
      key: dateRange.key,
      label: dateRange.label,
      start: dateRange.startIso,
      end: dateRange.endIso,
    },
    source: "mock",
  };
}

export function getMockProductsReport(range: AnalyticsRange): ProductsReport {
  const dateRange = getDateRange(range);
  return {
    summary: {
      totalProducts: products.length,
      activeProducts: products.length,
      lowStock: 6,
      outOfStock: 1,
    },
    topSelling: [
      { name: "Velvet Rose Hydrating Serum", unitsSold: 312, revenue: 468000 },
      { name: "Luminous Silk Foundation", unitsSold: 248, revenue: 297600 },
      { name: "Nude Glow Lip Oil", unitsSold: 201, revenue: 120600 },
    ],
    slowMoving: [
      { name: "Noir Petals Eau de Parfum", unitsSold: 8, stock: 42 },
      { name: "Silk Setting Powder", unitsSold: 11, stock: 36 },
    ],
    categoryBreakdown: buildCategorySalesChart(),
    range: {
      key: dateRange.key,
      label: dateRange.label,
      start: dateRange.startIso,
      end: dateRange.endIso,
    },
    source: "mock",
  };
}

export function getMockCustomersReport(range: AnalyticsRange): CustomersReport {
  const dateRange = getDateRange(range);
  return {
    summary: {
      totalCustomers: 5042,
      newCustomers: 156,
      repeatCustomers: 892,
      repeatRate: 17.7,
    },
    growth: buildCustomerGrowthChart(),
    topCustomers: [
      { name: "Ayesha Rahman", email: "demo@glowcart.com", orders: 12, spent: 45600 },
      { name: "Fatima Khan", email: "fatima@example.com", orders: 15, spent: 51200 },
      { name: "Nadia Islam", email: "nadia@example.com", orders: 8, spent: 28400 },
    ],
    range: {
      key: dateRange.key,
      label: dateRange.label,
      start: dateRange.startIso,
      end: dateRange.endIso,
    },
    source: "mock",
  };
}
