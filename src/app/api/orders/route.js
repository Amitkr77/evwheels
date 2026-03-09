import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getCartSummary } from "@/lib/cartSummary";

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

        // 1️⃣ Get cart summary including subtotal, discount, tax, shipping
        const summary = await getCartSummary(userId, couponCode);

        if (!summary || summary.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // Prepare order items
        const orderItems = summary.items.map((i) => ({
            product: i.product._id,
            title: i.product.title,
            price: i.product.price,
            quantity: i.quantity,
        }));

        // 2️⃣ Reduce stock
        for (const item of summary.items) {
            const product = await Product.findById(item.product._id).session(session);
            if (!product) throw new Error(`Product ${item.product.title} not found`);
            if (product.stock < item.quantity)
                throw new Error(`Insufficient stock for ${item.product.title}`);
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 3️⃣ Use summary totals
        const { total, discount, tax, shipping } = summary;


        // 3️⃣ Create order
        const order = await Order.create(
            [
                {
                    user: userId,
                    items: orderItems,
                    shippingAddress,
                    totalAmount: total,
                    discountAmount: discount,
                    taxAmount: tax,
                    shippingAmount: shipping,
                    paymentMethod: "COD",
                    // orderStatus: "Pending",
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

