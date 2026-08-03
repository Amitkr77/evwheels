import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";
import { captureServerException } from "@/lib/analytics/posthog-server";

const LOW_STOCK_THRESHOLD = 5;

// GET /api/admin/inventory?type=summary|low-stock|out-of-stock|logs&page=1&limit=20
export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "summary";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const skip = (page - 1) * limit;

    if (type === "logs") {
      const productId = searchParams.get("productId");
      if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
      }
      const filter = productId ? { product: productId } : {};
      const [logs, total] = await Promise.all([
        InventoryLog.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("product", "title")
          .populate("performedBy", "name email"),
        InventoryLog.countDocuments(filter),
      ]);
      return NextResponse.json({
        success: true,
        logs,
        total,
        pagination: { page, pages: Math.ceil(total / limit), total, limit },
      });
    }

    if (type === "low-stock") {
      const threshold = Number(searchParams.get("threshold")) || LOW_STOCK_THRESHOLD;
      const products = await Product.find({ stock: { $gt: 0, $lte: threshold } })
        .sort({ stock: 1 })
        .select("title stock images brand price category")
        .populate("category", "name");
      return NextResponse.json({ success: true, products });
    }

    if (type === "out-of-stock") {
      const products = await Product.find({ stock: 0 })
        .sort({ updatedAt: -1 })
        .select("title stock images brand price category")
        .populate("category", "name");
      return NextResponse.json({ success: true, products });
    }

    // summary (default)
    const threshold = LOW_STOCK_THRESHOLD;
    const [
      totalProducts,
      activeProducts,
      archivedProducts,
      outOfStock,
      lowStock,
      stockAgg,
      valueAgg,
      recentLogs,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments({ stock: { $gt: 0, $lte: threshold } }),
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, value: { $sum: { $multiply: ["$price", "$stock"] } } } },
      ]),
      InventoryLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("product", "title")
        .populate("performedBy", "name"),
    ]);

    return NextResponse.json({
      success: true,
      summary: {
        totalProducts,
        activeProducts,
        archivedProducts,
        outOfStock,
        lowStock,
        totalStock: stockAgg[0]?.total ?? 0,
        inventoryValue: valueAgg[0]?.value ?? 0,
      },
      recentLogs,
    });
  } catch (error) {
    console.error("[admin/inventory] GET", error.message);
    captureServerException(error, { route: "admin/inventory" });
    return NextResponse.json({ error: "Failed to fetch inventory data" }, { status: 500 });
  }
}

// POST /api/admin/inventory — manual stock adjustment
// body: { productId, quantity, type: "increase"|"decrease"|"restock"|"adjustment", reason }
export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { productId, quantity, type, reason } = await req.json();

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Valid productId required" }, { status: 400 });
    }
    const qty = Number(quantity);
    if (isNaN(qty)) return NextResponse.json({ error: "quantity must be a number" }, { status: 400 });

    const VALID_TYPES = ["increase", "decrease", "restock", "adjustment"];
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    if (type === "adjustment" ? qty < 0 : qty <= 0) {
      return NextResponse.json(
        { error: type === "adjustment" ? "quantity cannot be negative" : "quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    let result;
    try {
      const product = await Product.findById(productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const previousStock = product.stock;
      let newStock;

      if (type === "adjustment") {
        newStock = Math.max(0, qty);
      } else if (type === "decrease") {
        newStock = Math.max(0, previousStock - qty);
      } else {
        newStock = previousStock + qty;
      }

      product.stock = newStock;
      await product.save({ session });

      await InventoryLog.create(
        [
          {
            product: product._id,
            productName: product.title,
            type,
            quantity: type === "adjustment" ? newStock - previousStock : qty,
            previousStock,
            newStock,
            reason: reason || "",
            performedBy: admin.id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      result = { product, previousStock, newStock };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated",
      product: { _id: result.product._id, title: result.product.title, stock: result.newStock },
      previousStock: result.previousStock,
      newStock: result.newStock,
    });
  } catch (error) {
    console.error("[admin/inventory] POST", error.message);
    captureServerException(error, { route: "admin/inventory" });
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
