import { wrapEmailLayout } from "../sendMail";

/**
 * Welcome email sent after user registration.
 */
export function welcomeTemplate({ name, verifyLink }) {
  const verifySection = verifyLink
    ? `
    <div style="text-align:center; margin:24px 0;">
      <a href="${verifyLink}"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Verify Your Email
      </a>
    </div>
    <p style="font-size:13px; color:#6b7280; text-align:center;">
      This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `
    : "";

  const content = `
    <h2 style="margin:0 0 8px; font-size:22px; color:#111827;">Welcome to EV Wheels, ${name}! 🎉</h2>
    <p style="margin:0 0 16px; font-size:15px; color:#374151; line-height:1.6;">
      Thank you for creating your account. We're thrilled to have you on board!
      Explore our collection of premium electric cycles and scooters designed for the modern commuter.
    </p>

    ${verifySection}

    <div style="background:#f0fdf4; border-radius:8px; padding:20px; margin:24px 0;">
      <h3 style="margin:0 0 12px; font-size:16px; color:#059669;">Here's what you can do next:</h3>
      <ul style="margin:0; padding-left:20px; color:#374151; font-size:14px; line-height:1.8;">
        <li>Browse our latest EV Cycles and Scooters</li>
        <li>Add products to your wishlist for easy tracking</li>
        <li>Check out our current deals and coupon codes</li>
        <li>Complete your profile for a personalized experience</li>
      </ul>
    </div>

    <div style="text-align:center; margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/shop"
         style="display:inline-block; padding:14px 32px; background:#111827; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Start Shopping
      </a>
    </div>

    <p style="font-size:14px; color:#6b7280; line-height:1.6;">
      If you ever need help, our support team is just an email away. Happy riding!
    </p>
  `;

  return wrapEmailLayout(content, {
    title: "Welcome to EV Wheels",
    previewText: `Hi ${name}, welcome to EV Wheels! Verify your email and start exploring.`,
  });
}
