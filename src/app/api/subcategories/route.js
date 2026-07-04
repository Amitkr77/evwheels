import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";

// GET /api/subcategories
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const segmentId = searchParams.get("segmentId");
    const activeOnly = searchParams.get("active") !== "false";

    const filter = {};

    if (activeOnly) filter.isActive = true;

    if (categoryId) {
      filter.category = categoryId;
    }

    if (segmentId) {
      filter.segment = segmentId;
    }

    const subcategories = await Subcategory.find(filter)
      .populate("category", "name slug")
      .populate("segment", "name slug")
      .sort({ sortOrder: 1 });

    return NextResponse.json({
      success: true,
      subcategories,
    });
  } catch (error) {
    console.error("[subcategories]", error.message);

    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

// POST /api/subcategories
export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();

    const name = (body.name || "").trim();
    const category = body.category;

    if (!name) {
      return NextResponse.json(
        { error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }
    // validate category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // duplicate check
    const exists = await Subcategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      category,
    });

    if (exists) {
      return NextResponse.json(
        { error: "Subcategory already exists in this category" },
        { status: 409 }
      );
    }

    const subcategory = await Subcategory.create({
      name,
      category,
      segment: categoryExists.segment,
      description: body.description || "",
      image: body.image || "",
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory created successfully",
        subcategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[subcategories]", error.message);

    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 }
    );
  }
}