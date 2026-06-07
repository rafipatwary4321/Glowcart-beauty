import { Order, Product } from "@/models";
import { getLowStockProducts } from "@/lib/inventory";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getAdminDashboardStats() {
  const todayStart = startOfToday();

  const [todayOrders, pendingOrders, revenueAgg, lowStockProducts, recentOrders] =
    await Promise.all([
      Order.find({ createdAt: { $gte: todayStart } }).sort({ createdAt: -1 }).limit(10),
      Order.countDocuments({ status: { $in: ["pending", "confirmed", "processing"] } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            paymentStatus: { $in: ["paid", "pending"] },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      getLowStockProducts(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

  const revenueOverview = revenueAgg.map((row: { _id: string; total: number; count: number }) => ({
    date: row._id,
    revenue: row.total,
    orders: row.count,
  }));

  return {
    widgets: {
      todayOrders: todayOrders.length,
      todaySales,
      pendingOrders,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts: lowStockProducts.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      stock: product.stock,
      reservedStock: product.reservedStock,
      availableStock: product.availableStock,
      lowStockThreshold: product.lowStockThreshold,
    })),
    recentOrders: recentOrders.map((order) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt?.toISOString(),
    })),
    revenueOverview,
  };
}

export async function getInventoryStats() {
  const products = await Product.find({ isActive: true });
  const lowStock = products.filter(
    (product) =>
      Math.max(0, (product.stock ?? 0) - (product.reservedStock ?? 0)) <=
      (product.lowStockThreshold ?? 10)
  );

  return {
    totalProducts: products.length,
    lowStockCount: lowStock.length,
    outOfStockCount: products.filter(
      (product) => Math.max(0, (product.stock ?? 0) - (product.reservedStock ?? 0)) <= 0
    ).length,
  };
}
