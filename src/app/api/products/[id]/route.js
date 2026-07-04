import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";

// GET /api/products/[id] — get product by ID or slug
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    let product;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    if (isObjectId) {
      product = await Product.findById(id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("segment", "name slug")
        .lean();
    } else {
      product = await Product.findOne({ slug: id })
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("segment", "name slug")
        .lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, product },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("[products/id] GET", error.message);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — update product (admin only)
export async function PUT(req, { params }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updateData = {};

    // Title
    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }

    // Description
    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    // Price
    if (body.price !== undefined) {
      const price = Number(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: "Invalid price" },
          { status: 400 }
        );
      }
      updateData.price = price;
    }

    // Stock
    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { error: "Invalid stock" },
          { status: 400 }
        );
      }
      updateData.stock = stock;
    }

    // Brand
    if (body.brand !== undefined) {
      updateData.brand = body.brand;
    }

    // Category validation
    if (body.category !== undefined) {
      const category = await Category.findById(body.category);
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      updateData.category = body.category;
      // findByIdAndUpdate doesn't reliably re-run the document-level
      // derive-segment hook, so recompute it explicitly here.
      updateData.segment = category.segment;
    }

    // Subcategory validation
    if (body.subcategory !== undefined) {
      const catId = body.category;

      const productDoc = await Product.findById(id);
      const finalCategory = catId || productDoc?.category;

      const subcategory = await Subcategory.findOne({
        _id: body.subcategory,
        category: finalCategory,
      });

      if (!subcategory) {
        return NextResponse.json(
          {
            error:
              "Subcategory not found or does not belong to category",
          },
          { status: 404 }
        );
      }

      updateData.subcategory = body.subcategory;
    }

    // Images
    if (body.images !== undefined) {
      updateData.images = body.images;
    }

    // Specifications
    if (body.specifications !== undefined) {
      updateData.specifications = body.specifications;
    }

    // Colors
    if (body.colors !== undefined) {
      updateData.colors = Array.isArray(body.colors)
        ? body.colors
        : body.colors.split(",").map((c) => c.trim()).filter(Boolean);
    }

    // Warranty
    if (body.warranty !== undefined) {
      updateData.warranty = Number(body.warranty) || 0;
    }

    // Featured
    if (
      body.featured !== undefined ||
      body.isFeatured !== undefined
    ) {
      updateData.featured =
        body.featured ?? body.isFeatured;
    }

    // Active
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("segment", "name slug");

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("[products/id]", error.message);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(req, { params }) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("[products/id]", error.message);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}