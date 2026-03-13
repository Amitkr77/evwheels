import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        const admin = await verifyAdmin(req);

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // ================================
        // Basic Stats
        // ================================

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const lowStock = await Product.countDocuments({ stock: { $lt: 5 } });

        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: "DELIVERED" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        // ================================
        // Today's Revenue
        // ================================

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRevenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "DELIVERED",
                    createdAt: { $gte: today },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);

        const todayRevenue = todayRevenueResult[0]?.total || 0;

        // ================================
        // Yesterday Revenue
        // ================================

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const yesterdayRevenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "DELIVERED",
                    createdAt: { $gte: yesterday, $lt: today },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);

        const yesterdayRevenue = yesterdayRevenueResult[0]?.total || 0;

        const revenueGrowth =
            yesterdayRevenue === 0
                ? 0
                : (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1);

        // ================================
        // Pending Orders
        // ================================

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $in: ["PLACED", "PROCESSING"] },
        });

        // ================================
        // Top Selling Product
        // ================================

        const topProduct = await Order.aggregate([
            { $unwind: "$items" },

            {
                $group: {
                    _id: "$items.product",
                    sold: { $sum: "$items.quantity" },
                },
            },

            { $sort: { sold: -1 } },
            { $limit: 1 },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },

            { $unwind: "$product" },

            {
                $project: {
                    _id: 0,
                    name: "$product.title",
                    sold: 1,
                },
            },
        ]);

        const topSellingProduct = topProduct[0] || { name: null, sold: 0 };

        // ================================
        // Last 7 Days Chart
        // ================================

        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const revenueChartRaw = await Order.aggregate([
            {
                $match: {
                    orderStatus: "DELIVERED",
                    createdAt: { $gte: last7Days },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { "_id.day": 1 } },
        ]);

        const revenueChart = revenueChartRaw.map((d) => ({
            label: `${d._id.day}/${d._id.month}`,
            revenue: d.revenue,
        }));

        // ================================
        // Recent Orders
        // ================================

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("id totalAmount orderStatus createdAt user")
            .populate("user", "name");

        const formattedOrders = recentOrders.map((order) => ({
            id: order.id,
            name: order.user?.name || "Guest",
            amount: order.totalAmount,
            status: order.orderStatus,
            date: order.createdAt,
        }));

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                lowStock,
            },
            insights: {
                todayRevenue,
                revenueGrowth,
                pendingOrders,
                topSellingProduct,
            },
            revenueChart,
            recentOrders: formattedOrders,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to load dashboard data" },
            { status: 500 }
        );
    }
}