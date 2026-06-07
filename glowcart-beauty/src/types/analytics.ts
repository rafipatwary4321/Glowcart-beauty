export type AnalyticsRange = "today" | "7d" | "30d" | "month" | "custom";

export type ChartPoint = {
  label: string;
  value: number;
};

export type AnalyticsMetrics = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  lowStockCount: number;
};

export type AnalyticsInsights = {
  bestSellingProduct: { name: string; unitsSold: number; revenue: number };
  slowMovingProduct: { name: string; unitsSold: number; stock: number };
  lowStockWarning: { count: number; topItem?: string };
  highestRevenueCategory: { name: string; revenue: number; share: number };
  repeatCustomerCount: number;
  couponUsageSummary: { totalUsed: number; topCoupon?: string; topCouponUses: number };
};

export type AnalyticsOverview = {
  metrics: AnalyticsMetrics;
  charts: {
    revenueOverview: ChartPoint[];
    orderStatus: ChartPoint[];
    topProducts: ChartPoint[];
    customerGrowth: ChartPoint[];
    categorySales: ChartPoint[];
  };
  insights: AnalyticsInsights;
  range: { key: AnalyticsRange; label: string; start: string; end: string };
  source: "database" | "mock";
};

export type SalesReport = {
  summary: {
    revenue: number;
    orders: number;
    averageOrderValue: number;
    growthRate: number;
  };
  daily: Array<{ date: string; revenue: number; orders: number }>;
  range: AnalyticsOverview["range"];
  source: "database" | "mock";
};

export type OrdersReport = {
  summary: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    fulfillmentRate: number;
  };
  byStatus: ChartPoint[];
  recent: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  range: AnalyticsOverview["range"];
  source: "database" | "mock";
};

export type ProductsReport = {
  summary: {
    totalProducts: number;
    activeProducts: number;
    lowStock: number;
    outOfStock: number;
  };
  topSelling: Array<{ name: string; unitsSold: number; revenue: number }>;
  slowMoving: Array<{ name: string; unitsSold: number; stock: number }>;
  categoryBreakdown: ChartPoint[];
  range: AnalyticsOverview["range"];
  source: "database" | "mock";
};

export type CustomersReport = {
  summary: {
    totalCustomers: number;
    newCustomers: number;
    repeatCustomers: number;
    repeatRate: number;
  };
  growth: ChartPoint[];
  topCustomers: Array<{ name: string; email: string; orders: number; spent: number }>;
  range: AnalyticsOverview["range"];
  source: "database" | "mock";
};
