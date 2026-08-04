import { wrapEmailLayout } from "../sendMail";

/**
 * New contact-form submission notification — sent to the support inbox
 * whenever a visitor submits the /contact page form.
 */
export function contactFormAdminTemplate({ name, email, phone, subject, message }) {
  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">📬</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      New Contact Form Submission
    </h2>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280; text-align:center;">
      Subject: <strong style="color:#059669;">${subject}</strong>
    </p>

    <div style="background:#f0fdf4; border-radius:8px; padding:16px; margin-bottom:16px;">
      <h4 style="margin:0 0 8px; font-size:14px; color:#059669;">From</h4>
      <p style="margin:0; font-size:14px; color:#374151; line-height:1.6;">
        <strong>${name}</strong><br/>
        Email: <a href="mailto:${email}" style="color:#059669;">${email}</a><br/>
        Phone: <a href="tel:${phone}" style="color:#059669;">${phone}</a>
      </p>
    </div>

    <div style="background:#f9fafb; border-radius:8px; padding:16px;">
      <h4 style="margin:0 0 8px; font-size:14px; color:#374151;">Message</h4>
      <p style="margin:0; font-size:14px; color:#374151; line-height:1.6; white-space:pre-line;">${message}</p>
    </div>

    <div style="text-align:center; margin-top:24px;">
      <a href="mailto:${email}"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Reply to ${name}
      </a>
    </div>
  `;

  return wrapEmailLayout(content, {
    title: `New Contact Form Submission — ${subject}`,
    previewText: `${name} (${email}) sent a message about ${subject}`,
  });
}
