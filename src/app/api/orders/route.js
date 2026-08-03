import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCartSummary } from "@/lib/cartSummary";
import User from "@/models/User";
import { orderConfirmationTemplate } from "@/lib/email/templates/orderConfirmation";
import { sendEmail } from "@/lib/email/sendMail";
import { getUserId, getUserIdStrict } from "@/lib/getUserId";
import { newOrderAdminTemplate } from "@/lib/email/templates/newOrderAdmin";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function POST(req) {
  // Strict path: order placement moves money, so a token invalidated by a
  // password reset must not still be able to place orders just because it
  // hasn't expired yet.
  const userId = await getUserIdStrict(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { shippingAddress, paymentMethod, buyNow } = body;
  const couponCode = typeof body.couponCode === "string" ? body.couponCode : undefined;

  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.street ||
      !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode) {
    return NextResponse.json({ error: "All shipping address fields are required" }, { status: 400 });
  }

  for (const [field, max] of [["fullName", 100], ["street", 200], ["city", 100], ["state", 100]]) {
    if (typeof shippingAddress[field] !== "string" || shippingAddress[field].length > max) {
      return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
    }
  }

  if (!["COD", "CARD"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  if (buyNow?.productId && !(Number.isInteger(buyNow.quantity ?? 1) && (buyNow.quantity ?? 1) >= 1)) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(userId).select("email name phone");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const overrideItems = buyNow?.productId
    ? [{ productId: buyNow.productId, quantity: buyNow.quantity || 1 }]
    : undefined;

  try {
    // Compute summary outside the transaction (read-only, no locks needed)
    const summary = await getCartSummary(userId, couponCode, overrideItems);
    if (!summary?.items?.length) {
      const err = new Error(overrideItems ? "Product not found" : "Cart is empty");
      err.expected = true;
      throw err;
    }

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
      if (!product) {
        const err = new Error("Product not found");
        err.expected = true;
        throw err;
      }
      if (!product.isActive) {
        const err = new Error(`${product.title} is no longer available`);
        err.expected = true;
        throw err;
      }
      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for ${product.title}`);
        err.expected = true;
        throw err;
      }
      if (item.quantity < (product.moq || 1)) {
        const err = new Error(`${product.title} requires a minimum order of ${product.moq}`);
        err.expected = true;
        throw err;
      }
      product.stock -= item.quantity;
    }

    // Bulk-save all updated products in parallel
    await Promise.all(products.map((p) => p.save({ session })));

    const { total, discount, tax, shipping } = summary;

    // Use a collision-resistant ID from timestamp + random suffix instead of a DB read
    const orderId = `#ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    // No payment gateway is wired in yet — CARD orders must stay PENDING until a real
    // payment is verified server-side. Do not mark PAID on the client's say-so alone.
    const paymentStatus = "PENDING";

    // Create the order — and clear the cart alongside it, unless this is a Buy Now
    // order, which never touched the persisted cart in the first place.
    const dbOps = [
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
    ];
    if (!overrideItems) {
      dbOps.push(
        Cart.updateOne({ user: userId }, { $set: { items: [], couponCode: null } }, { session })
      );
    }
    if (summary.couponId) {
      dbOps.push(
        Coupon.updateOne({ _id: summary.couponId }, { $inc: { usedCount: 1 } }, { session })
      );
    }
    const [[order]] = await Promise.all(dbOps);

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

    return NextResponse.json({ success: true, order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    captureServerException(error, { route: "orders", distinctId: userId });

    if (error.expected) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[orders] unexpected error:", error.message);
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 }
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
    .limit(200)
    .lean();

  return NextResponse.json({ success: true, orders });
}
