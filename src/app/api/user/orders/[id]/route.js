import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function GET(req, { params }) {
  try {
    const userId = await getUserId(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await Order.findOne({ _id: id, user: userId })
      .populate("items.product")
      .populate("user", "email name");
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[user/orders/id] GET", error.message);
    captureServerException(error, { route: "user/orders/id" });
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const userId = await getUserId(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!["PLACED", "CONFIRMED"].includes(order.orderStatus)) {
      return NextResponse.json(
        { error: "Order cannot be cancelled at this stage" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const productIds = order.items.map((item) => item.product);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      const productMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

      for (const item of order.items) {
        const product = productMap[item.product?.toString()];
        if (!product) continue;
        const previousStock = product.stock;
        product.stock += item.quantity;
        await product.save({ session });
        await InventoryLog.create(
          [
            {
              product: product._id,
              productName: product.title,
              type: "order_cancel",
              quantity: item.quantity,
              previousStock,
              newStock: product.stock,
              reason: "Order cancelled by customer",
              reference: order.id,
            },
          ],
          { session }
        );
      }

      order.orderStatus = "CANCELLED";
      order.statusHistory.push({ status: "CANCELLED" });
      await order.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return NextResponse.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("[user/orders/id] PATCH", error.message);
    captureServerException(error, { route: "user/orders/id" });
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
