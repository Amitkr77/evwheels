import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import Segment from "@/models/Segment";
import "@/models/Category"; // Ensure Category model is registered for virtual populate

// Cache segment list for 1 hour — changes rarely, high read volume
export const revalidate = 3600;

// GET /api/segments — list all segments (with category counts)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") !== "false";

    const filter = activeOnly ? { isActive: true } : {};

    const segments = await Segment.find(filter)
      .sort({ sortOrder: 1 })
      .populate("categoryCount")
      .lean();

    return NextResponse.json({ success: true, segments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

// POST /api/segments — create a new segment (admin only)
export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const body = await req.json();

    // Whitelist only allowed fields
    const name = (body.name || "").trim();
    const description = (body.description || "").slice(0, 500);
    const image = (body.image || "").slice(0, 500);
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
    const sortOrder = Number(body.sortOrder) || 0;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Segment name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Segment name must be under 100 characters" },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await Segment.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Segment with this name already exists" },
        { status: 409 }
      );
    }

    const segment = await Segment.create({
      name,
      description,
      image,
      isActive,
      sortOrder,
    });

    return NextResponse.json(segment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      console.error("Error creating segment", error) ||
      { error: "Failed to create segment" },
      { status: 500 }
    );
  }
}
