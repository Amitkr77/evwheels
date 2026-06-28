import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Product from "@/models/Product";

// POST /api/admin/products/duplicate
// body: { id: string }
export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

  const source = await Product.findById(id).lean();
  if (!source) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { _id, slug, createdAt, updatedAt, __v, ...rest } = source;

  const baseTitle = rest.title.replace(/\s*\(Copy\s*\d*\)\s*$/, "").trim();

  // Find a unique slug by checking existing copies
  let copyNum = 1;
  let newSlug;
  let newTitle;
  while (true) {
    newTitle = `${baseTitle} (Copy${copyNum > 1 ? ` ${copyNum}` : ""})`;
    const candidateSlug = `${slug.replace(/-copy-?\d*$/, "")}-copy${copyNum > 1 ? `-${copyNum}` : ""}`;
    const exists = await Product.findOne({ slug: candidateSlug });
    if (!exists) { newSlug = candidateSlug; break; }
    copyNum++;
    if (copyNum > 99) return NextResponse.json({ error: "Too many copies" }, { status: 409 });
  }

  const duplicate = await Product.create({
    ...rest,
    title: newTitle,
    slug: newSlug,
    isActive: false,
    stock: 0,
  });

  await duplicate.populate("category", "name slug");
  await duplicate.populate("subcategory", "name slug");

  return NextResponse.json({ success: true, product: duplicate }, { status: 201 });
}
