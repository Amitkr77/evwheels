
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";

async function getUserId(req) {
    // Attempt to get the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
        console.warn("No token found in request cookies.");
        return null;
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check common payload keys
        if (decoded.id) return decoded.id;
        if (decoded.userId) return decoded.userId;

        console.warn("JWT payload does not contain 'id' or 'userId'. Returning null.");
        return null;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }
}

export async function GET(req, { params }) {
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const order = await Order.findOne({
        _id: id,
        user: userId,
    }).populate("items.product");

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
}

export async function PATCH(req, { params }) {
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const order = await Order.findOne({
        _id: id,
        user: userId,
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!["PLACED", "CONFIRMED"].includes(order.orderStatus)) {
        return NextResponse.json(
            { error: "Order cannot be cancelled now" },
            { status: 400 }
        );
    }

    order.orderStatus = "CANCELLED";
    order.statusHistory.push({ status: "CANCELLED" });

    await order.save();

    return NextResponse.json({ message: "Order cancelled" });
}