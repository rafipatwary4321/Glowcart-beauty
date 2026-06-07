import { Coupon, Order, Product, User } from "@/models";
import { getLowStockProducts } from "@/lib/inventory";
import type { OrderStatus } from "@/types/order";
import type {
  AnalyticsInsights,
  AnalyticsMetrics,
  AnalyticsOverview,
  AnalyticsRange,
  ChartPoint,
  CustomersReport,
  OrdersReport,
  ProductsReport,
  SalesReport,
} from "@/types/analytics";

import { getDateRange } from "./date-range";
import {
  getMockCustomersReport,
  getMockOrdersReport,
  getMockOverview,
  getMockProductsReport,
  getMockSalesReport,
} from "./mock-data";

const COMPLETED_STATUSES = ["delivered"] as OrderStatus[];
const PENDING_STATUSES = ["pending", "confirmed", "processing", "shipped"] as OrderStatus[];

function rangeMeta(range: AnalyticsRange) {
  const dateRange = getDateRange(range);
  return {
    key: dateRange.key,
    label: dateRange.label,
    start: dateRange.startIso,
    end: dateRange.endIso,
    startDate: dateRange.start,
    endDate: dateRange.end,
  };
}

function orderMatch(range: AnalyticsRange) {
  const { startDate, endDate } = rangeMeta(range);
  return {
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $ne: "cancelled" as const },
  };
}

async function buildMetricsFromDb(range: AnalyticsRange): Promise<AnalyticsMetrics> {
  const { startDate, endDate } = rangeMeta(range);

  const [
    revenueAgg,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    lowStockProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: "customer" }),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: { $in: PENDING_STATUSES } }),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: { $in: COMPLETED_STATUSES } }),
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: "cancelled" }),
    getLowStockProducts(100),
  ]);

  const totalRevenue = revenueAgg[0]?.total ?? 0;

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    lowStockCount: lowStockProducts.length,
  };
}

async function buildRevenueChart(range: AnalyticsRange): Promise<ChartPoint[]> {
  const { startDate, endDate } = rangeMeta(range);
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        value: { $sum: "$total" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row: { _id: string; value: number }) => ({
    label: row._id.slice(5),
    value: row.value,
  }));
}

async function buildOrderStatusChart(range: AnalyticsRange): Promise<ChartPoint[]> {
  const { startDate, endDate } = rangeMeta(range);
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);

  return rows.map((row: { _id: string; value: number }) => ({
    label: row._id.replace(/_/g, " "),
    value: row.value,
  }));
}

async function buildTopProductsChart(range: AnalyticsRange): Promise<ChartPoint[]> {
  const { startDate, endDate } = rangeMeta(range);
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        value: { $sum: "$items.quantity" },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  return rows.map((row: { _id: string; value: number }) => ({
    label: row._id.length > 14 ? `${row._id.slice(0, 14)}…` : row._id,
    value: row.value,
  }));
}

async function buildCustomerGrowthChart(range: AnalyticsRange): Promise<ChartPoint[]> {
  const { startDate, endDate } = rangeMeta(range);
  const rows = await User.aggregate([
    { $match: { role: "customer", createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        value: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row: { _id: string; value: number }) => ({
    label: row._id.slice(5),
    value: row.value,
  }));
}

async function buildCategorySalesChart(range: AnalyticsRange): Promise<ChartPoint[]> {
  const { startDate, endDate } = rangeMeta(range);
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDoc",
      },
    },
    { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "categories",
        localField: "productDoc.category",
        foreignField: "_id",
        as: "categoryDoc",
      },
    },
    { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
        value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  return rows.map((row: { _id: string; value: number }) => ({
    label: row._id,
    value: row.value,
  }));
}

async function buildInsights(range: AnalyticsRange): Promise<AnalyticsInsights> {
  const { startDate, endDate } = rangeMeta(range);

  const [topProductRows, slowProductRows, categoryRows, repeatRows, coupons, lowStock] =
    await Promise.all([
      Order.aggregate([
        { $match: orderMatch(range) },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            unitsSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 1 },
      ]),
      Product.find({ isActive: true }).sort({ reviewCount: 1 }).limit(1),
      buildCategorySalesChart(range),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $count: "repeatCustomers" },
      ]),
      Coupon.find().sort({ usedCount: -1 }).limit(1),
      getLowStockProducts(1),
    ]);

  const topProduct = topProductRows[0] as { _id: string; unitsSold: number; revenue: number } | undefined;
  const slowProduct = slowProductRows[0];
  const topCategory = categoryRows[0];
  const categoryTotal = categoryRows.reduce((sum, row) => sum + row.value, 0);
  const topCoupon = coupons[0];

  return {
    bestSellingProduct: {
      name: topProduct?._id ?? "—",
      unitsSold: topProduct?.unitsSold ?? 0,
      revenue: topProduct?.revenue ?? 0,
    },
    slowMovingProduct: {
      name: slowProduct?.name ?? "—",
      unitsSold: slowProduct?.reviewCount ?? 0,
      stock: slowProduct?.stock ?? slowProduct?.stockCount ?? 0,
    },
    lowStockWarning: {
      count: lowStock.length,
      topItem: lowStock[0]?.name,
    },
    highestRevenueCategory: {
      name: topCategory?.label ?? "—",
      revenue: topCategory?.value ?? 0,
      share: categoryTotal > 0 ? Math.round(((topCategory?.value ?? 0) / categoryTotal) * 100) : 0,
    },
    repeatCustomerCount: repeatRows[0]?.repeatCustomers ?? 0,
    couponUsageSummary: {
      totalUsed: topCoupon?.usedCount ?? 0,
      topCoupon: topCoupon?.code,
      topCouponUses: topCoupon?.usedCount ?? 0,
    },
  };
}

export async function getAnalyticsOverview(range: AnalyticsRange): Promise<AnalyticsOverview> {
  try {
    const meta = rangeMeta(range);
    const [metrics, revenueOverview, orderStatus, topProducts, customerGrowth, categorySales, insights] =
      await Promise.all([
        buildMetricsFromDb(range),
        buildRevenueChart(range),
        buildOrderStatusChart(range),
        buildTopProductsChart(range),
        buildCustomerGrowthChart(range),
        buildCategorySalesChart(range),
        buildInsights(range),
      ]);

    const hasData = metrics.totalOrders > 0 || metrics.totalRevenue > 0;
    if (!hasData) return getMockOverview(range);

    return {
      metrics,
      charts: { revenueOverview, orderStatus, topProducts, customerGrowth, categorySales },
      insights,
      range: { key: meta.key, label: meta.label, start: meta.start, end: meta.end },
      source: "database",
    };
  } catch {
    return getMockOverview(range);
  }
}

export async function getSalesReport(range: AnalyticsRange): Promise<SalesReport> {
  try {
    const meta = rangeMeta(range);
    const dailyRows = await Order.aggregate([
      { $match: orderMatch(range) },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!dailyRows.length) return getMockSalesReport(range);

    const revenue = dailyRows.reduce((sum: number, row: { revenue: number }) => sum + row.revenue, 0);
    const orders = dailyRows.reduce((sum: number, row: { orders: number }) => sum + row.orders, 0);

    return {
      summary: {
        revenue,
        orders,
        averageOrderValue: orders > 0 ? Math.round(revenue / orders) : 0,
        growthRate: 0,
      },
      daily: dailyRows.map((row: { _id: string; revenue: number; orders: number }) => ({
        date: row._id,
        revenue: row.revenue,
        orders: row.orders,
      })),
      range: { key: meta.key, label: meta.label, start: meta.start, end: meta.end },
      source: "database",
    };
  } catch {
    return getMockSalesReport(range);
  }
}

export async function getOrdersReport(range: AnalyticsRange): Promise<OrdersReport> {
  try {
    const meta = rangeMeta(range);
    const { startDate, endDate } = meta;

    const [byStatus, recent, total, pending, completed, cancelled] = await Promise.all([
      buildOrderStatusChart(range),
      Order.find({ createdAt: { $gte: startDate, $lte: endDate } })
        .sort({ createdAt: -1 })
        .limit(10),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: { $in: PENDING_STATUSES } }),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: { $in: COMPLETED_STATUSES } }),
      Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, status: "cancelled" }),
    ]);

    if (total === 0) return getMockOrdersReport(range);

    return {
      summary: {
        total,
        pending,
        completed,
        cancelled,
        fulfillmentRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
      },
      byStatus,
      recent: recent.map((order) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
      })),
      range: { key: meta.key, label: meta.label, start: meta.start, end: meta.end },
      source: "database",
    };
  } catch {
    return getMockOrdersReport(range);
  }
}

export async function getProductsReport(range: AnalyticsRange): Promise<ProductsReport> {
  try {
    const meta = rangeMeta(range);
    const [products, topSellingRows, lowStock, outOfStock, categoryBreakdown] = await Promise.all([
      Product.find({ isActive: true }),
      Order.aggregate([
        { $match: orderMatch(range) },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            unitsSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 },
      ]),
      getLowStockProducts(100),
      Product.countDocuments({
        isActive: true,
        $expr: { $lte: [{ $subtract: ["$stock", { $ifNull: ["$reservedStock", 0] }] }, 0] },
      }),
      buildCategorySalesChart(range),
    ]);

    if (!products.length) return getMockProductsReport(range);

    const slowMoving = [...products]
      .sort((a, b) => (a.reviewCount ?? 0) - (b.reviewCount ?? 0))
      .slice(0, 3)
      .map((product) => ({
        name: product.name,
        unitsSold: product.reviewCount ?? 0,
        stock: product.stock ?? product.stockCount ?? 0,
      }));

    return {
      summary: {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        lowStock: lowStock.length,
        outOfStock,
      },
      topSelling: topSellingRows.map((row: { _id: string; unitsSold: number; revenue: number }) => ({
        name: row._id,
        unitsSold: row.unitsSold,
        revenue: row.revenue,
      })),
      slowMoving,
      categoryBreakdown,
      range: { key: meta.key, label: meta.label, start: meta.start, end: meta.end },
      source: "database",
    };
  } catch {
    return getMockProductsReport(range);
  }
}

export async function getCustomersReport(range: AnalyticsRange): Promise<CustomersReport> {
  try {
    const meta = rangeMeta(range);
    const { startDate, endDate } = meta;

    const [totalCustomers, newCustomers, growth, topCustomerRows, repeatRows] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "customer", createdAt: { $gte: startDate, $lte: endDate } }),
      buildCustomerGrowthChart(range),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: { user: "$user", name: "$customerName", email: "$customerEmail" },
            orders: { $sum: 1 },
            spent: { $sum: "$total" },
          },
        },
        { $sort: { spent: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $count: "repeatCustomers" },
      ]),
    ]);

    if (totalCustomers === 0) return getMockCustomersReport(range);

    const repeatCustomers = repeatRows[0]?.repeatCustomers ?? 0;

    return {
      summary: {
        totalCustomers,
        newCustomers,
        repeatCustomers,
        repeatRate: totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 1000) / 10 : 0,
      },
      growth,
      topCustomers: topCustomerRows.map(
        (row: { _id: { name: string; email: string }; orders: number; spent: number }) => ({
          name: row._id.name,
          email: row._id.email,
          orders: row.orders,
          spent: row.spent,
        })
      ),
      range: { key: meta.key, label: meta.label, start: meta.start, end: meta.end },
      source: "database",
    };
  } catch {
    return getMockCustomersReport(range);
  }
}
