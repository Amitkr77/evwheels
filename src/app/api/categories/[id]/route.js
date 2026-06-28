import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET /api/categories/[id]
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        let category;

        if (isObjectId) {
            category = await Category.findById(id).populate(
                "productCount"
            );
        } else {
            category = await Category.findOne({ slug: id }).populate(
                "productCount"
            );
        }

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            category,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

// PATCH /api/categories/[id] — update category
export async function PATCH(req, { params }) {
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
        const body = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid category ID" },
                { status: 400 }
            );
        }

        const updateData = {};

        // Name
        if (body.name !== undefined) {
            updateData.name = body.name.trim();
        }

        // Description
        if (body.description !== undefined) {
            updateData.description = body.description;
        }

        // Image
        if (body.image !== undefined) {
            updateData.image = body.image;
        }

        // Active
        if (body.isActive !== undefined) {
            updateData.isActive = body.isActive;
        }

        // Sort order
        if (body.sortOrder !== undefined) {
            updateData.sortOrder = Number(body.sortOrder);
        }

        // Specification fields (dynamic admin form template)
        if (body.specificationFields !== undefined) {
            updateData.specificationFields =
                body.specificationFields;
        }

        const category = await Category.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

// DELETE /api/categories/[id]
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
                { error: "Invalid category ID" },
                { status: 400 }
            );
        }

        // Check if category has products
        const productCount = await Product.countDocuments({
            category: id,
        });

        if (productCount > 0) {
            return NextResponse.json(
                {
                    error:
                        "Cannot delete category with existing products",
                },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}