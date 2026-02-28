import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

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

// CREATE ORDER (COD)
export async function POST(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { shippingAddress, couponCode } = await req.json();

    await connectDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let total = 0;
        const orderItems = [];

        // 1️⃣ Calculate total & reduce stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session);

            if (!product)
                throw new Error("Product not found");

            if (product.stock < item.quantity)
                throw new Error(`Insufficient stock for ${product.title}`);

            product.stock -= item.quantity;
            await product.save({ session });

            total += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                title: product.title,
                price: product.price,
                quantity: item.quantity,
            });
        }

        // 2️⃣ Apply coupon ONCE
        let discountAmount = 0;

        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
            }).session(session);

            if (!coupon) throw new Error("Invalid coupon code");
            if (!coupon.isActive) throw new Error("Coupon is inactive");
            if (coupon.expiryDate < new Date()) throw new Error("Coupon expired");
            if (coupon.usageLimit !== 0 && coupon.usedCount >= coupon.usageLimit)
                throw new Error("Coupon usage limit reached");
            if (total < coupon.minOrderAmount)
                throw new Error("Minimum order amount not met");

            if (coupon.discountType === "percentage") {
                discountAmount = (total * coupon.discountValue) / 100;
            } else {
                discountAmount = coupon.discountValue;
            }

            coupon.usedCount += 1;
            await coupon.save({ session });
        }

        const finalTotal = total - discountAmount;

        // 3️⃣ Create order
        const order = await Order.create(
            [
                {
                    user: userId,
                    items: orderItems,
                    shippingAddress,
                    totalAmount: finalTotal,
                    discountAmount,
                    paymentMethod: "COD",
                    orderStatus: "Pending",
                },
            ],
            { session }
        );

        // Clear cart
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(order[0]);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

// GET USER ORDERS
export async function GET(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const orders = await Order.find({ user: userId }).sort({
        createdAt: -1,
    });

    return NextResponse.json(orders);
}

