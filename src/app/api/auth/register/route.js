import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email/sendMail";
import { welcomeTemplate } from "@/lib/email/templates/welcome";

export async function POST(req) {
  try {
    
    const { name, email, phone, password } = await req.json();

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedName = name.trim();

    await connectDB();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account with provided details" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password, // Assumes hashing is handled in User schema pre-save hook
    });

    // Generate verification token
    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Verify env variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
    }

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${verifyToken}`;

    // Send email without blocking response
    sendEmail({
      to: user.email,
      subject: "Welcome to EV Wheels! Verify Your Email",
      html: welcomeTemplate({
        name: user.name,
        verifyLink,
      }),
      type: "welcome",
      userId: user._id,
    }).catch((err) => {
      console.error("Welcome email failed:", err);
    });

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Create response
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 201 }
    );

    // Set auth cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    // Mongo duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}