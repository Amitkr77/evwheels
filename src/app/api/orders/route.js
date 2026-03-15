import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCartSummary } from "@/lib/cartSummary";
import { sendEmail } from "@/lib/email/sendMail";
import User from "@/models/User";
import { orderConfirmationTemplate } from "@/lib/email/templates/orderConfirmation";

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

function generateNextOrderId(lastId) {
    if (!lastId) return "#ORD-1000";
    const number = parseInt(lastId.split("-")[1], 10) + 1;
    return `#ORD-${String(number).padStart(4, "0")}`;
}

export async function POST(req) {
    const userId = await getUserId(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const { shippingAddress, couponCode, paymentMethod } = await req.json();

    await connectDB();

    const user = await User.findById(userId).select("email name");

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .session(session);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // Get cart totals
        const summary = await getCartSummary(userId, couponCode);
        if (!summary?.items?.length) {
            throw new Error("Cart is empty");
        }

        // Prepare order items
        const orderItems = summary.items.map((item) => ({
            product: item.product._id,
            name: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
        }));

        // Validate & update stock
        for (const item of summary.items) {
            const product = await Product.findById(item.product._id).session(session);

            if (!product) {
                throw new Error(`Product not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`);
            }

            product.stock -= item.quantity;
            await product.save({ session });
        }

        const { total, discount, tax, shipping } = summary;

        // Generate Order ID
        const lastOrder = await Order.findOne()
            .sort({ createdAt: -1 })
            .select("id")
            .session(session);

        const orderId = generateNextOrderId(lastOrder?.id);

        const paymentStatus =
            paymentMethod === "COD" ? "PENDING" : "PAID";

        const [order] = await Order.create(
            [
                {
                    user: userId,
                    items: orderItems,
                    shippingAddress,
                    paymentMethod,
                    paymentStatus,
                    totalAmount: total,
                    discountAmount: discount,
                    taxAmount: tax,
                    shippingAmount: shipping,
                    id: orderId,
                    statusHistory: [{ status: "PLACED" }],
                },
            ],
            { session }
        );

        // Clear cart
        cart.items = [];
        cart.couponCode = null
        await cart.save({ session });

        await sendEmail({
            to: user.email,
            subject: "Order Confirmation",
            html: orderConfirmationTemplate(order.id, orderItems, total),
        });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(order);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

export async function GET(req) {
    const userId = await getUserId(req);

    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(orders);
}