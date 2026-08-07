import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Category from "@/models/Category";
import Segment from "@/models/Segment";
import "@/models/Product"; // Ensure Product model is registered for virtual populate

// Cache category list for 1 hour — changes rarely, high read volume
export const revalidate = 3600;

// GET /api/categories — list all categories (with product counts)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") !== "false";
    const segmentId = searchParams.get("segmentId");

    const filter = activeOnly ? { isActive: true } : {};
    if (segmentId) filter.segment = segmentId;

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1 })
      .populate("productCount")
      .populate("segment", "name slug")
      .lean();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories — create a new category (admin only)
export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await req.json();

    // Whitelist only allowed fields
    const name = (body.name || "").trim();
    const segment = body.segment;
    const description = (body.description || "").slice(0, 500);
    const image = (body.image || "").slice(0, 500);
    const icon = (body.icon || "").slice(0, 500);
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
    const sortOrder = Number(body.sortOrder) || 0;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Category name must be under 100 characters" },
        { status: 400 }
      );
    }

    if (!segment) {
      return NextResponse.json(
        { error: "Segment is required" },
        { status: 400 }
      );
    }

    const segmentExists = await Segment.findById(segment);
    if (!segmentExists) {
      return NextResponse.json(
        { error: "Segment not found" },
        { status: 404 }
      );
    }

    // Check duplicate (scoped to the segment)
    const existing = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      segment,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category with this name already exists in this segment" },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      segment,
      description,
      image,
      icon,
      isActive,
      sortOrder,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      console.error("Error creating category", error) ||
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
