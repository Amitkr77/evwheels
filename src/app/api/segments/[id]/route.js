import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Segment from "@/models/Segment";
import Category from "@/models/Category";
import mongoose from "mongoose";

// GET /api/segments/[id]
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        const isObjectId = mongoose.Types.ObjectId.isValid(id);

        let segment;

        if (isObjectId) {
            segment = await Segment.findById(id).populate(
                "categoryCount"
            );
        } else {
            segment = await Segment.findOne({ slug: id }).populate(
                "categoryCount"
            );
        }

        if (!segment) {
            return NextResponse.json(
                { error: "Segment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            segment,
        });
    } catch (error) {
        console.error("[segments/id]", error.message);

        return NextResponse.json(
            { error: "Failed to fetch segment" },
            { status: 500 }
        );
    }
}

// PATCH /api/segments/[id] — update segment
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
                { error: "Invalid segment ID" },
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

        const segment = await Segment.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!segment) {
            return NextResponse.json(
                { error: "Segment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Segment updated successfully",
            segment,
        });
    } catch (error) {
        console.error("[segments/id]", error.message);

        return NextResponse.json(
            { error: "Failed to update segment" },
            { status: 500 }
        );
    }
}

// DELETE /api/segments/[id]
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
                { error: "Invalid segment ID" },
                { status: 400 }
            );
        }

        // Check if segment has categories
        const categoryCount = await Category.countDocuments({
            segment: id,
        });

        if (categoryCount > 0) {
            return NextResponse.json(
                {
                    error:
                        "Cannot delete segment with existing categories",
                },
                { status: 400 }
            );
        }

        const segment = await Segment.findByIdAndDelete(id);

        if (!segment) {
            return NextResponse.json(
                { error: "Segment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Segment deleted successfully",
        });
    } catch (error) {
        console.error("[segments/id]", error.message);

        return NextResponse.json(
            { error: "Failed to delete segment" },
            { status: 500 }
        );
    }
}
