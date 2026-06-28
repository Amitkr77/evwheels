import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/adminAuth";

// GET ALL ORDERS
export async function GET(req) {
    const admin = await verifyAdmin(req);

    if (!admin)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter = status ? { orderStatus: status } : {};

    const orders = await Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return NextResponse.json(orders);
}

