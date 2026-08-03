import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rateLimit";
import { getPasswordError } from "@/lib/validatePassword";
import { captureServerException } from "@/lib/analytics/posthog-server";

export async function POST(req) {
  if (rateLimit(req, { limit: 5, windowMs: 60_000, prefix: "reset-password" }))
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });

  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new one." },
        { status: 400 }
      );
    }

    // Set raw password — pre-save hook will hash it
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Invalidate every session issued before this reset — a token stolen
    // before the reset (the reason someone resets their password) must not
    // keep working just because it hasn't expired yet.
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    const jwtToken = await signToken({
      id: String(user._id),
      role: user.role,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      created_at: user.createdAt,
      tokenVersion: user.tokenVersion,
    });

    const response = NextResponse.json({
      message: "Password has been reset successfully.",
    });

    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    captureServerException(error, { route: "auth/reset-password" });
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
