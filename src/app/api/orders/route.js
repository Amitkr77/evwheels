import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCartSummary } from "@/lib/cartSummary";
import User from "@/models/User";
import { orderConfirmationTemplate } from "@/lib/email/templates/orderConfirmation";
import { sendEmail } from "@/lib/email/sendMail";
import { getUserId } from "@/lib/getUserId";
import { newOrderAdminTemplate } from "@/lib/email/templates/newOrderAdmin";

export async function POST(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { shippingAddress, couponCode, paymentMethod } = await req.json();

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.street ||
      !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode) {
    return NextResponse.json({ error: "All shipping address fields are required" }, { status: 400 });
  }

  if (!["COD", "CARD"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(userId).select("email name phone");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Compute summary outside the transaction (read-only, no locks needed)
    const summary = await getCartSummary(userId, couponCode);
    if (!summary?.items?.length) throw new Error("Cart is empty");

    const productIds = summary.items.map((item) => item.product._id);

    // Batch-fetch all products in one query instead of N sequential reads
    const products = await Product.find({ _id: { $in: productIds } }).session(session);
    const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

    const orderItems = summary.items.map((item) => ({
      product:  item.product._id,
      name:     item.product.title,
      price:    item.product.price,
      quantity: item.quantity,
    }));

    // Validate stock and apply decrements
    for (const item of summary.items) {
      const product = productMap[item.product._id.toString()];
      if (!product) throw new Error("Product not found");
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${product.title}`);
      product.stock -= item.quantity;
    }

    // Bulk-save all updated products in parallel
    await Promise.all(products.map((p) => p.save({ session })));

    const { total, discount, tax, shipping } = summary;

    // Use a collision-resistant ID from timestamp + random suffix instead of a DB read
    const orderId = `#ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const paymentStatus = paymentMethod === "COD" ? "PENDING" : "PAID";

    // Create order and clear cart in parallel inside the transaction
    const [[order]] = await Promise.all([
      Order.create(
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
      ),
      Cart.updateOne({ user: userId }, { $set: { items: [], couponCode: null } }, { session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    // Send emails after commit (fire-and-forget)
    const subtotal = total - discount - tax - shipping;

    sendEmail({
      to: user.email,
      subject: `Order Confirmed — ${orderId}`,
      html: orderConfirmationTemplate({
        orderId,
        orderDbId: order._id.toString(),
        items: orderItems,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        paymentMethod,
        shippingAddress,
      }),
      type: "order_confirmation",
      userId: user._id,
      metadata: { orderId },
    }).catch((err) => console.error("Order confirmation email failed:", err.message));

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `New Order ${orderId} — ₹${Number(total).toLocaleString("en-IN")}`,
        html: newOrderAdminTemplate({
          orderId,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone,
          items: orderItems,
          total,
          paymentMethod,
          paymentStatus,
          shippingAddress,
        }),
        type: "new_order_admin",
        metadata: { orderId, userId: user._id.toString() },
      }).catch((err) => console.error("Admin notification email failed:", err.message));
    }

    return NextResponse.json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ error: error.message }, { status: 400 });
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
