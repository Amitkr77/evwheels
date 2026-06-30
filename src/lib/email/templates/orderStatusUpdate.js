import { wrapEmailLayout } from "../sendMail";

const STATUS_CONFIG = {
  PLACED: { label: "Order Placed", color: "#3b82f6", icon: "📋" },
  CONFIRMED: { label: "Order Confirmed", color: "#8b5cf6", icon: "✅" },
  SHIPPED: { label: "Order Shipped", color: "#f59e0b", icon: "🚚" },
  DELIVERED: { label: "Order Delivered", color: "#059669", icon: "🎉" },
  CANCELLED: { label: "Order Cancelled", color: "#ef4444", icon: "❌" },
};

/**
 * Order status update email — sent when admin changes the order status.
 */
export function orderStatusUpdateTemplate({
  orderId,
  orderDbId,
  newStatus,
  previousStatus,
  items,
  total,
  trackingNote,
}) {
  const statusInfo = STATUS_CONFIG[newStatus] || { label: newStatus, color: "#6b7280", icon: "📦" };
  const prevInfo = STATUS_CONFIG[previousStatus] || { label: previousStatus, color: "#6b7280", icon: "📦" };

  const itemsSummary = items
    .slice(0, 3)
    .map((i) => i.name)
    .join(", ");
  const moreItems = items.length > 3 ? ` and ${items.length - 3} more item(s)` : "";

  const trackingSection = trackingNote
    ? `
    <div style="background:#fefce8; border-radius:8px; padding:16px; margin-top:20px;">
      <p style="margin:0; font-size:14px; color:#92400e; line-height:1.6;">
        <strong>Tracking Info:</strong> ${trackingNote}
      </p>
    </div>
  `
    : "";

  const orderUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${orderDbId ? `/order-success?id=${orderDbId}` : "/profile"}`;

  const shippedCta = newStatus === "SHIPPED"
    ? `
    <div style="text-align:center; margin-top:24px;">
      <a href="${orderUrl}"
         style="display:inline-block; padding:14px 32px; background:#f59e0b; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Track Your Order
      </a>
    </div>
  `
    : `
    <div style="text-align:center; margin-top:24px;">
      <a href="${orderUrl}"
         style="display:inline-block; padding:14px 32px; background:#111827; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        View Order Details
      </a>
    </div>
  `;

  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">${statusInfo.icon}</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      ${statusInfo.label}!
    </h2>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280; text-align:center;">
      Order <strong style="color:#059669;">#${orderId}</strong> status has been updated.
    </p>

    <!-- Status Timeline -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="padding:8px 12px; background:#fef2f2; border-radius:6px; font-size:13px; color:#991b1b; text-align:center;">
          ${prevInfo.icon} Previous: ${prevInfo.label}
        </td>
        <td style="padding:0 8px; font-size:18px; color:#9ca3af;">→</td>
        <td style="padding:8px 12px; background:#f0fdf4; border-radius:6px; font-size:13px; color:#166534; text-align:center; font-weight:600;">
          ${statusInfo.icon} Current: ${statusInfo.label}
        </td>
      </tr>
    </table>

    <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-top:16px;">
      <p style="margin:0 0 4px; font-size:13px; color:#6b7280;">Items</p>
      <p style="margin:0; font-size:14px; color:#374151;">${itemsSummary}${moreItems}</p>
      <p style="margin:8px 0 0; font-size:13px; color:#6b7280;">Total: <strong style="color:#111827;">₹${Number(total).toLocaleString("en-IN")}</strong></p>
    </div>

    ${trackingSection}
    ${shippedCta}

    <p style="margin-top:24px; font-size:13px; color:#6b7280; line-height:1.6;">
      If you have any questions about your order, feel free to reach out to our support team.
    </p>
  `;

  return wrapEmailLayout(content, {
    title: `Order #${orderId} — ${statusInfo.label}`,
    previewText: `Your order #${orderId} status has been updated to ${statusInfo.label}.`,
  });
}
