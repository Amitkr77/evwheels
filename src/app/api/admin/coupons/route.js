import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { verifyAdmin, verifyAdminStrict } from "@/lib/adminAuth";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function POST(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    if (!body.expiryDate || new Date(body.expiryDate) <= new Date()) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    await connectDB();

    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("[admin/coupons]", error.message);
    captureServerException(error, { route: "admin/coupons" });

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 400 }
    );
  }
}

// Get all coupons or a specific coupon by id
export async function GET(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const coupon = await Coupon.findById(id);
      if (!coupon)
        return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
      return NextResponse.json(coupon);
    } else {
      const coupons = await Coupon.find();
      return NextResponse.json(coupons);
    }
  } catch (error) {
    console.error("[admin/coupons]", error.message);
    captureServerException(error, { route: "admin/coupons" });
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// Update a coupon by id
export async function PATCH(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    const body = await req.json();

    if (body.expiryDate && new Date(body.expiryDate) <= new Date()) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCoupon)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("[admin/coupons]", error.message);
    captureServerException(error, { route: "admin/coupons" });
    return NextResponse.json(
      { error: error.message || "Failed to update coupon" },
      { status: 400 }
    );
  }
}

// Delete a coupon by id
export async function DELETE(req) {
  try {
    const admin = await verifyAdminStrict(req);
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await connectDB();

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("[admin/coupons]", error.message);
    captureServerException(error, { route: "admin/coupons" });
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
