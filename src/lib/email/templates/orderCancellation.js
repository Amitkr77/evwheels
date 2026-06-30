import { wrapEmailLayout } from "../sendMail";

/**
 * Order cancellation email — sent when user cancels or admin cancels an order.
 */
export function orderCancellationTemplate({
  orderId,
  items,
  total,
  cancelledBy,
  reason,
  refundNote,
}) {
  const itemsSummary = items
    .slice(0, 5)
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151;">${i.name}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:center;">${i.quantity}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:right;">₹${Number(i.price).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const reasonSection = reason
    ? `
    <div style="background:#fef2f2; border-radius:8px; padding:16px; margin-top:16px;">
      <p style="margin:0; font-size:13px; color:#991b1b;">
        <strong>Cancellation Reason:</strong> ${reason}
      </p>
    </div>
  `
    : "";

  const refundSection = refundNote
    ? `
    <div style="background:#f0fdf4; border-radius:8px; padding:16px; margin-top:16px;">
      <p style="margin:0; font-size:13px; color:#166534; line-height:1.6;">
        <strong>Refund Info:</strong> ${refundNote}
      </p>
    </div>
  `
    : "";

  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">❌</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      Order Cancelled
    </h2>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280; text-align:center;">
      Order <strong style="color:#ef4444;">#${orderId}</strong> has been cancelled by ${cancelledBy === "admin" ? "the store admin" : "you"}.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th align="left" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Product</th>
          <th align="center" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Qty</th>
          <th align="right" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsSummary}
      </tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr style="border-top:2px solid #111827;">
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827;">Total</td>
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827; text-align:right;">₹${Number(total).toLocaleString("en-IN")}</td>
      </tr>
    </table>

    ${reasonSection}
    ${refundSection}

    <div style="text-align:center; margin-top:28px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/shop"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Continue Shopping
      </a>
    </div>

    <p style="margin-top:20px; font-size:13px; color:#6b7280; line-height:1.6;">
      We're sorry for any inconvenience. If you have questions, please contact our support team.
    </p>
  `;

  return wrapEmailLayout(content, {
    title: `Order #${orderId} Cancelled`,
    previewText: `Your order #${orderId} has been cancelled. Total: ₹${Number(total).toLocaleString("en-IN")}`,
  });
}
