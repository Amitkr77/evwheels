import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "7d";
        const days = period === "30d" ? 30 : 7;

        const now = new Date();
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const chartStart = new Date(today); chartStart.setDate(today.getDate() - days);

        // Run all independent queries in parallel — was 10 sequential, now 5 parallel
        const [
            counts,
            revenueStats,
            topProduct,
            revenueChartRaw,
            recentOrders,
        ] = await Promise.all([
            // 1. All countDocuments in one aggregation
            Order.aggregate([
                {
                    $facet: {
                        total:   [{ $count: "n" }],
                        pending: [{ $match: { orderStatus: { $in: ["PLACED", "PROCESSING"] } } }, { $count: "n" }],
                    },
                },
            ]),

            // 2. All-time + today + yesterday revenue in a single pipeline
            Order.aggregate([
                { $match: { orderStatus: "DELIVERED" } },
                {
                    $group: {
                        _id: null,
                        allTime:   { $sum: "$totalAmount" },
                        today:     { $sum: { $cond: [{ $gte: ["$createdAt", today] }, "$totalAmount", 0] } },
                        yesterday: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $gte: ["$createdAt", yesterday] }, { $lt: ["$createdAt", today] }] },
                                    "$totalAmount", 0,
                                ],
                            },
                        },
                    },
                },
            ]),

            // 3. Top-selling product (limited to last 90 days for performance)
            Order.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 90 * 864e5) } } },
                { $unwind: "$items" },
                { $group: { _id: "$items.product", sold: { $sum: "$items.quantity" } } },
                { $sort: { sold: -1 } },
                { $limit: 1 },
                { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
                { $unwind: "$product" },
                { $project: { _id: 0, name: "$product.title", sold: 1 } },
            ]),

            // 4. Revenue chart
            Order.aggregate([
                { $match: { orderStatus: "DELIVERED", createdAt: { $gte: chartStart } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),

            // 5. Recent orders — lean for speed
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("id totalAmount orderStatus createdAt user")
                .populate("user", "name")
                .lean(),
        ]);

        // Product counts (separate collection — run alongside above)
        const [totalProducts, lowStock] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ stock: { $lt: 5 } }),
        ]);

        const totalOrders   = counts[0]?.total[0]?.n   ?? 0;
        const pendingOrders = counts[0]?.pending[0]?.n  ?? 0;
        const rev           = revenueStats[0] ?? { allTime: 0, today: 0, yesterday: 0 };
        const revenueGrowth = rev.yesterday === 0 ? 0
            : (((rev.today - rev.yesterday) / rev.yesterday) * 100).toFixed(1);

        return NextResponse.json({
            stats: {
                totalRevenue: rev.allTime,
                totalOrders,
                totalProducts,
                lowStock,
            },
            insights: {
                todayRevenue:     rev.today,
                revenueGrowth,
                pendingOrders,
                topSellingProduct: topProduct[0] ?? { name: null, sold: 0 },
            },
            revenueChart: revenueChartRaw.map((d) => ({ label: d._id.slice(5), revenue: d.revenue })),
            recentOrders: recentOrders.map((o) => ({
                id:     o.id,
                name:   o.user?.name || "Guest",
                amount: o.totalAmount,
                status: o.orderStatus,
                date:   o.createdAt,
            })),
        });
    } catch (error) {
        console.error("[admin/dashboard]", error.message);
        return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
    }
}