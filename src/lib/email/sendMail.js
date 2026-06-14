import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import EmailLog from "@/models/EmailLog";

const STORE_NAME = process.env.STORE_NAME || "EV Wheels";
const STORE_LOGO = process.env.STORE_LOGO_URL || "";

// Create transporter lazily so it's only built when needed
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Wrap HTML content in a consistent branded email layout
 */
export function wrapEmailLayout(content, opts = {}) {
  const { title = STORE_NAME, previewText = "" } = opts;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${title}</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      body { margin: 0; padding: 0; background-color: #f4f5f7; -webkit-text-size-adjust: 100%; }
      table { border-collapse: collapse; }
      a { color: #059669; }
      @media only screen and (max-width: 620px) {
        .email-container { width: 100% !important; padding: 0 12px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Arial,Helvetica,sans-serif;">
    <!-- Preview text (hidden) -->
    <div style="display:none;font-size:1px;color:#f4f5f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${previewText}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#059669,#047857); padding:28px 32px;">
                ${
                  STORE_LOGO
                    ? `<img src="${STORE_LOGO}" alt="${STORE_NAME}" style="height:40px; display:block; margin:0 auto;" />`
                    : `<h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">${STORE_NAME}</h1>`
                }
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 8px; font-size:12px; color:#6b7280; text-align:center;">
                  &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
                </p>
                <p style="margin:0; font-size:11px; color:#9ca3af; text-align:center;">
                  You're receiving this email because you have an account with ${STORE_NAME}.
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || "#"}/account/email-preferences" style="color:#9ca3af; text-decoration:underline;">Manage preferences</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

/**
 * Send an email with logging and error resilience.
 * Emails that fail are logged but do NOT throw — the caller's flow continues.
 *
 * @param {Object} params
 * @param {string} params.to        - Recipient email
 * @param {string} params.subject   - Subject line
 * @param {string} params.html      - Full HTML body
 * @param {string} [params.text]    - Plain-text fallback
 * @param {string} [params.type]    - Email type for logging (e.g. "welcome")
 * @param {string} [params.userId]  - User ObjectId for logging
 * @param {Object} [params.metadata]- Extra data to log
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  type = "other",
  userId = null,
  metadata = {},
}) {
  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: `"${STORE_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || subject,
      html,
    });

    // Log success (non-blocking)
    logEmail({ recipient: to, subject, type, status: "sent", userId, metadata }).catch(() => {});

    return info;
  } catch (error) {
    console.error("Email sending error:", error.message);

    // Log failure (non-blocking)
    logEmail({
      recipient: to,
      subject,
      type,
      status: "failed",
      userId,
      error: error.message,
      metadata,
    }).catch(() => {});

    // Do NOT throw — email failures should not break the main flow
    return null;
  }
}

/**
 * Internal helper to persist an email log entry.
 */
async function logEmail({ recipient, subject, type, status, userId, error, metadata }) {
  try {
    await connectDB();
    await EmailLog.create({
      recipient,
      subject,
      type,
      status,
      userId,
      error,
      metadata,
    });
  } catch (err) {
    // Silently ignore logging errors
    console.error("Email log write failed:", err.message);
  }
}
