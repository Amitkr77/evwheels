import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, price, image } = await req.json();

    if (!title || !description || !price || !image) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      title,
      description,
      price,
      image,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}