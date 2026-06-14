import { wrapEmailLayout } from "../sendMail";

/**
 * Email verification email — sent after registration to verify email address.
 */
export function emailVerificationTemplate({ verifyLink, name }) {
  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">✉️</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      Verify Your Email Address
    </h2>
    <p style="margin:0 0 20px; font-size:15px; color:#374151; line-height:1.6; text-align:center;">
      Hi ${name}, thanks for signing up! Please verify your email address to activate your account and access all features.
    </p>

    <div style="text-align:center; margin:24px 0;">
      <a href="${verifyLink}"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Verify Email
      </a>
    </div>

    <p style="font-size:13px; color:#6b7280; text-align:center; line-height:1.6;">
      This link expires in <strong>24 hours</strong>. If you didn't create an account with EV Wheels, you can safely ignore this email.
    </p>

    <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-top:20px;">
      <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
        <strong>Having trouble with the button?</strong> Copy and paste the following link into your browser:<br/>
        <a href="${verifyLink}" style="color:#059669; word-break:break-all;">${verifyLink}</a>
      </p>
    </div>
  `;

  return wrapEmailLayout(content, {
    title: "Verify Your Email",
    previewText: "Please verify your email address to activate your EV Wheels account.",
  });
}
