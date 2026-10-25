import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/Subscriber";
import { rateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  if (rateLimit(req, { limit: 5, windowMs: 60_000, prefix: "newsletter" }))
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );

  try {
    const { email } = await req.json();

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email: email.trim().toLowerCase() });

    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
      }
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    await Subscriber.create({ email: email.trim().toLowerCase() });

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
