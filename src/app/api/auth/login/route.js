import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rateLimit";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function POST(req) {
  if (rateLimit(req, { limit: 10, windowMs: 60_000, prefix: "login" }))
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    // Always run a bcrypt compare, even for an unknown email, so response
    // timing doesn't leak whether the address exists (dummy hash, not a real user's).
    const isMatch = await bcrypt.compare(
      password,
      user?.password || "$2a$10$CwTycUXWue0Thq9StjUM0uJ8OqAeVSVfNCwtiV5cQVOKGcJ6f2eSK"
    );

    if (!user || !isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = await signToken({
      id: String(user._id),
      role: user.role,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      created_at: user.createdAt,
      tokenVersion: user.tokenVersion ?? 0,
    });

    // Strip password and sensitive fields from response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        created_at: user.createdAt,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[auth/login]", error.message)
    captureServerException(error, { route: "auth/login" });
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
