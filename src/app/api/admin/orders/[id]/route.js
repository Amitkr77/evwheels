import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";
import { verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

const VALID_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

export async function PATCH(req, { params }) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();
    const orderStatus = body.orderStatus || body.status;
    const note = body.note || "";

    if (!VALID_STATUSES.includes(orderStatus)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(id);
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (TERMINAL_STATUSES.includes(order.orderStatus)) {
      return NextResponse.json(
        { error: `Order is already ${order.orderStatus.toLowerCase()} and cannot be changed` },
        { status: 400 }
      );
    }

    if (orderStatus === "CANCELLED") {
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
                reason: "Order cancelled by admin",
                reference: order.id,
                performedBy: admin.id,
              },
            ],
            { session }
          );
        }

        order.orderStatus = orderStatus;
        order.statusHistory.push({ status: orderStatus, note });
        await order.save({ session });

        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }

      return NextResponse.json({ success: true, order });
    }

    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note });
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[admin/orders/id]", error.message);
    captureServerException(error, { route: "admin/orders/id" });
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
