import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Wishlist from "@/models/Wishlist";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function getUserId(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch {
        return null;
    }
}

export async function GET(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [
        user,
        orderStats,
        wishlistCount,
        recentOrders,
        orderStatusSummary
    ] = await Promise.all([

        User.findById(userId).select("-password").lean(),

        Order.aggregate([
            { $match: { user: objectUserId } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$totalAmount" },
                    totalProducts: { $sum: { $sum: "$items.quantity" } }
                }
            }
        ]),

        Wishlist.countDocuments({ user: userId }),

        Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("id totalAmount orderStatus createdAt")
            .lean(),

        Order.aggregate([
            { $match: { user: objectUserId } },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    const stats = orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        totalProducts: 0
    };

    const statusMap = {
        PLACED: 0,
        CONFIRMED: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0
    };

    orderStatusSummary.forEach((s) => {
        statusMap[s._id] = s.count;
    });

    return NextResponse.json({
        user,

        stats: {
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent,
            totalProductsPurchased: stats.totalProducts,
            wishlistItems: wishlistCount,
            pendingOrders: statusMap.PLACED + statusMap.CONFIRMED,
            deliveredOrders: statusMap.DELIVERED,
            cancelledOrders: statusMap.CANCELLED
        },

        orderStatusSummary: statusMap,

        recentOrders
    });
}