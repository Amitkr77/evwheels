import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Category from "@/models/Category";

function getPeriodStart(period) {
  const now = new Date();
  switch (period) {
    case "7d":  now.setDate(now.getDate() - 7); break;
    case "90d": now.setDate(now.getDate() - 90); break;
    case "1y":  now.setFullYear(now.getFullYear() - 1); break;
    default:    now.setDate(now.getDate() - 30); // 30d default
  }
  now.setHours(0, 0, 0, 0);
  return now;
}

export async function GET(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const type    = searchParams.get("type") || "inventory-summary";
  const period  = searchParams.get("period") || "30d";
  const page    = Number(searchParams.get("page")) || 1;
  const limit   = Number(searchParams.get("limit")) || 20;
  const skip    = (page - 1) * limit;

  // ─── 1. Inventory Summary ────────────────────────────────────────────────
  if (type === "inventory-summary") {
    const LOW_THRESHOLD = 5;

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      stockAgg,
      valueAgg,
      categories,
      priceRangeAgg,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments({ stock: { $gt: 0, $lte: LOW_THRESHOLD } }),
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, value: { $sum: { $multiply: ["$price", "$stock"] } } } },
      ]),
      Category.find({ isActive: true }).select("_id name"),
      Product.aggregate([
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 5000, 10000, 25000, 50000, 100000, Infinity],
            default: "100000+",
            output: { count: { $sum: 1 } },
          },
        },
      ]),
    ]);

    // Category breakdown
    const catIds = categories.map((c) => c._id);
    const catBreakdown = await Product.aggregate([
      { $match: { category: { $in: catIds } } },
      {
        $group: {
          _id: "$category",
          count:      { $sum: 1 },
          totalStock: { $sum: "$stock" },
          avgPrice:   { $avg: "$price" },
        },
      },
    ]);

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c._id.toString(), c.name])
    );

    const categoryBreakdown = catBreakdown.map((c) => ({
      name:       categoryMap[c._id.toString()] || "Unknown",
      count:      c.count,
      totalStock: c.totalStock,
      avgPrice:   Math.round(c.avgPrice),
    }));

    const LABELS = ["₹0–5k", "₹5k–10k", "₹10k–25k", "₹25k–50k", "₹50k–1L", "₹1L+"];
    const priceDistribution = priceRangeAgg.map((b, i) => ({
      _id:   LABELS[i] || b._id,
      count: b.count,
    }));

    return NextResponse.json({
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalStock:     stockAgg[0]?.total ?? 0,
      inventoryValue: valueAgg[0]?.value ?? 0,
      categoryBreakdown,
      priceDistribution,
    });
  }

  // ─── 2. Sales Report ─────────────────────────────────────────────────────
  if (type === "sales") {
    const start = getPeriodStart(period);

    const [revenueAgg, byStatus, dailyRevenue] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: start }, orderStatus: { $nin: ["CANCELLED"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id:     "$orderStatus",
            count:   { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start }, orderStatus: { $nin: ["CANCELLED"] } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$totalAmount" },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalRevenue   = revenueAgg[0]?.total ?? 0;
    const totalOrders    = revenueAgg[0]?.count ?? 0;
    const avgOrderValue  = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      byStatus,
      dailyRevenue,
    });
  }

  // ─── 3. Product Performance ──────────────────────────────────────────────
  if (type === "product-performance") {
    const start = getPeriodStart(period);

    const raw = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, orderStatus: { $nin: ["CANCELLED"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:        "$items.product",
          totalSold:  { $sum: "$items.quantity" },
          revenue:    { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from:         "products",
          localField:   "_id",
          foreignField: "_id",
          as:           "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name:       { $ifNull: ["$product.title", "$items.title"] },
          totalSold:  1,
          revenue:    1,
          orderCount: 1,
          stock:      "$product.stock",
        },
      },
    ]);

    const total   = raw.length;
    const products = raw.slice(skip, skip + limit);

    return NextResponse.json({
      products,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  }

  // ─── 4. Best Selling ─────────────────────────────────────────────────────
  if (type === "best-selling") {
    const start      = getPeriodStart(period);
    const topLimit   = Math.min(Number(searchParams.get("limit")) || 10, 50);

    const products = await Order.aggregate([
      { $match: { createdAt: { $gte: start }, orderStatus: { $nin: ["CANCELLED"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:       "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue:   { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: topLimit },
      {
        $lookup: {
          from:         "products",
          localField:   "_id",
          foreignField: "_id",
          as:           "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name:      { $ifNull: ["$product.title", "Unknown"] },
          totalSold: 1,
          revenue:   1,
          image:     { $arrayElemAt: ["$product.images", 0] },
        },
      },
    ]);

    return NextResponse.json({ products });
  }

  // ─── 5. Revenue Summary ──────────────────────────────────────────────────
  if (type === "revenue-summary") {
    const start = getPeriodStart(period);

    const [allTimeAgg, periodAgg, monthly] = await Promise.all([
      Order.aggregate([
        { $match: { orderStatus: { $nin: ["CANCELLED"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start }, orderStatus: { $nin: ["CANCELLED"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $nin: ["CANCELLED"] } } },
        {
          $group: {
            _id:     { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 24 },
      ]),
    ]);

    return NextResponse.json({
      allTime: { total: allTimeAgg[0]?.total ?? 0, orders: allTimeAgg[0]?.orders ?? 0 },
      period:  { total: periodAgg[0]?.total ?? 0,  orders: periodAgg[0]?.orders ?? 0 },
      monthly,
    });
  }

  return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
}
