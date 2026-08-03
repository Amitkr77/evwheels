import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

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