import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email/sendMail";
import { welcomeTemplate } from "@/lib/email/templates/welcome";
import { emailVerificationTemplate } from "@/lib/email/templates/emailVerification";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    // Generic message to prevent user enumeration
    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account with provided details" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Generate email verification token
    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const verifyLink = `${baseUrl}/api/auth/verify-email?token=${verifyToken}`;

    // Send welcome + verification email (non-blocking)
    sendEmail({
      to: user.email,
      subject: "Welcome to EV Wheels! Verify Your Email",
      html: welcomeTemplate({ name: user.name, verifyLink }),
      type: "welcome",
      userId: user._id,
    }).catch((err) => console.error("Welcome email failed:", err.message));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
