import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

async function getUserId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findById(userId).select("-password");

  return NextResponse.json(user);
}

export async function PATCH(req) {
  const userId = await getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone } = await req.json();

  await connectDB();

  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone },
    { new: true }
  ).select("-password");

  return NextResponse.json(user);
}