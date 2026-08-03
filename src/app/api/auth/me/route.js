import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

    // This is the one place the client asks "is my session still valid" —
    // called once per app load, not per request — so it's worth the DB hit
    // to reject a token invalidated by a password reset on another device.
    await connectDB();
    const user = await User.findById(decoded.id).select("tokenVersion").lean();
    if (!user || (decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      isEmailVerified: decoded.isEmailVerified,
      phone: decoded.phone,
      created_at: decoded.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
