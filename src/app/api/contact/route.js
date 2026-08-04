import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/email/sendMail";
import { contactFormAdminTemplate } from "@/lib/email/templates/contactFormAdmin";
import { rateLimit } from "@/lib/rateLimit";
import { captureServerException } from "@/lib/analytics/posthog-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

export async function POST(req) {
  if (rateLimit(req, { limit: 5, windowMs: 60_000, prefix: "contact" }))
    return NextResponse.json({ error: "Too many messages sent. Please wait a minute and try again." }, { status: 429 });

  try {
    const { name, email, phone, subject, message } = await req.json();

    // Mirror the client-side validation — never trust it alone.
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPhone = (phone || "").replace(/\s+/g, "").trim();
    const cleanMessage = (message || "").trim();

    if (!cleanName || cleanName.length < 3)
      return NextResponse.json({ error: "Please enter your full name (at least 3 characters)." }, { status: 400 });

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail))
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

    if (!cleanPhone || !PHONE_REGEX.test(cleanPhone))
      return NextResponse.json({ error: "Please enter a valid 10 digit mobile number." }, { status: 400 });

    if (!subject)
      return NextResponse.json({ error: "Please select a subject." }, { status: 400 });

    if (!cleanMessage || cleanMessage.length < 10)
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });

    if (cleanMessage.length > 500)
      return NextResponse.json({ error: "Message must be under 500 characters." }, { status: 400 });

    await connectDB();

    const doc = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject,
      message: cleanMessage,
    });

    // Notify support inbox without blocking the response — a failed email
    // shouldn't make the visitor think their message wasn't received; it was,
    // it's saved in ContactMessage regardless of email delivery.
    const supportInbox = process.env.CONTACT_INBOX_EMAIL || "support@evwheels.in";
    sendEmail({
      to: supportInbox,
      subject: `New Contact Form Submission — ${subject}`,
      html: contactFormAdminTemplate({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject,
        message: cleanMessage,
      }),
      type: "contact_form",
      metadata: { contactMessageId: String(doc._id) },
    }).catch((err) => {
      console.error("Contact form notification email failed:", err);
    });

    return NextResponse.json({ message: "Message sent successfully", id: doc._id }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    captureServerException(error, { route: "contact" });
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again, or reach us directly on WhatsApp." },
      { status: 500 }
    );
  }
}
