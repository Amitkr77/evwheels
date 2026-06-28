import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

const LOW_STOCK_THRESHOLD = 5;

// GET /api/admin/inventory?type=summary|low-stock|out-of-stock|logs&page=1&limit=20
export async function GET(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "summary";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const skip = (page - 1) * limit;

  if (type === "logs") {
    const productId = searchParams.get("productId");
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
}

// POST /api/admin/inventory — manual stock adjustment
// body: { productId, quantity, type: "increase"|"decrease"|"restock"|"adjustment", reason }
export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { productId, quantity, type, reason } = await req.json();

  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const qty = Number(quantity);
  if (isNaN(qty)) return NextResponse.json({ error: "quantity must be a number" }, { status: 400 });

  const VALID_TYPES = ["increase", "decrease", "restock", "adjustment"];
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
  }

  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const previousStock = product.stock;
  let newStock;

  if (type === "adjustment") {
    // Set stock to exact value
    newStock = Math.max(0, qty);
  } else if (type === "decrease") {
    newStock = Math.max(0, previousStock - qty);
  } else {
    // increase or restock
    newStock = previousStock + qty;
  }

  product.stock = newStock;
  await product.save();

  await InventoryLog.create({
    product: product._id,
    productName: product.title,
    type,
    quantity: type === "adjustment" ? newStock - previousStock : qty,
    previousStock,
    newStock,
    reason: reason || "",
    performedBy: admin.id,
  });

  return NextResponse.json({
    success: true,
    message: "Stock updated",
    product: { _id: product._id, title: product.title, stock: newStock },
    previousStock,
    newStock,
  });
}
