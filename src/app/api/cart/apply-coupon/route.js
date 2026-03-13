// app/api/cart/apply-coupon/route.js (Next.js 13+ /app router)

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import { getCartSummary } from "@/lib/cartSummary";
import jwt from "jsonwebtoken";

// Helper to get user ID from JWT cookie
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

export async function POST(req) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { couponCode } = await req.json();
    if (!couponCode)
        return NextResponse.json({ error: "Coupon code required" }, { status: 400 });

    await connectDB();

    try {
        // Find coupon
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
            return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
        }

        // Optional: add min order amount & usage limit checks here

        // Update cart with coupon
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { couponCode: coupon.code },
            { new: true }
        ).populate("items.product");

        if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

        // Return updated cart summary
        const summary = await getCartSummary(userId, coupon.code);

        return NextResponse.json({ message: "Coupon applied successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}