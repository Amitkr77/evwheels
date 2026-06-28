import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import mongoose from "mongoose";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";
import Product from "@/models/Product";

// GET /api/subcategories/[id]
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        let subcategory;

        if (isObjectId) {
            subcategory = await Subcategory.findById(id).populate(
                "category",
                "name slug"
            );
        } else {
            subcategory = await Subcategory.findOne({
                slug: id,
            }).populate("category", "name slug");
        }

        if (!subcategory) {
            return NextResponse.json(
                { error: "Subcategory not found" },
                { status: 404 }
            );
        }

        // Optional: product count
        const productCount = await Product.countDocuments({
            subcategory: subcategory._id,
        });

        return NextResponse.json({
            success: true,
            subcategory,
            productCount,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch subcategory" },
            { status: 500 }
        );
    }
}

// PATCH /api/subcategories/[id]
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
                { error: "Invalid subcategory ID" },
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

        // Category change (important validation)
        if (body.category !== undefined) {
            const categoryExists = await Category.findById(
                body.category
            );

            if (!categoryExists) {
                return NextResponse.json(
                    { error: "Category not found" },
                    { status: 404 }
                );
            }

            updateData.category = body.category;
        }

        const subcategory = await Subcategory.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate("category", "name slug");

        if (!subcategory) {
            return NextResponse.json(
                { error: "Subcategory not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Subcategory updated successfully",
            subcategory,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to update subcategory" },
            { status: 500 }
        );
    }
}

// DELETE /api/subcategories/[id]
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
                { error: "Invalid subcategory ID" },
                { status: 400 }
            );
        }

        // Check if products exist under this subcategory
        const productCount = await Product.countDocuments({
            subcategory: id,
        });

        if (productCount > 0) {
            return NextResponse.json(
                {
                    error:
                        "Cannot delete subcategory with existing products",
                },
                { status: 400 }
            );
        }

        const subcategory =
            await Subcategory.findByIdAndDelete(id);

        if (!subcategory) {
            return NextResponse.json(
                { error: "Subcategory not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Subcategory deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to delete subcategory" },
            { status: 500 }
        );
    }
}