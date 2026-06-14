import { wrapEmailLayout } from "../sendMail";

/**
 * New order notification email — sent to admin when a new order is placed.
 */
export function newOrderAdminTemplate({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  items,
  total,
  paymentMethod,
  paymentStatus,
  shippingAddress,
}) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151;">${item.name}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:right;">₹${Number(item.price).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const addressHtml = shippingAddress
    ? `
    <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-top:16px;">
      <h4 style="margin:0 0 8px; font-size:14px; color:#374151;">Shipping Address</h4>
      <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
        ${shippingAddress.fullName || ""}<br/>
        ${shippingAddress.street || ""}<br/>
        ${shippingAddress.city || ""}, ${shippingAddress.state || ""} ${shippingAddress.postalCode || ""}<br/>
        Phone: ${shippingAddress.phone || "N/A"}
      </p>
    </div>
  `
    : "";

  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">🛒</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      New Order Received!
    </h2>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280; text-align:center;">
      Order <strong style="color:#059669;">#${orderId}</strong>
    </p>

    <!-- Customer Info -->
    <div style="background:#f0fdf4; border-radius:8px; padding:16px; margin-bottom:16px;">
      <h4 style="margin:0 0 8px; font-size:14px; color:#059669;">Customer Details</h4>
      <p style="margin:0; font-size:14px; color:#374151; line-height:1.6;">
        <strong>${customerName}</strong><br/>
        Email: ${customerEmail}<br/>
        Phone: ${customerPhone || "N/A"}
      </p>
    </div>

    <!-- Payment Info -->
    <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-bottom:16px;">
      <p style="margin:0; font-size:14px; color:#374151;">
        <strong>Payment:</strong> ${paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"} &middot;
        <span style="color:${paymentStatus === "PAID" ? "#059669" : "#f59e0b"}; font-weight:600;">${paymentStatus}</span>
      </p>
    </div>

    <!-- Items -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th align="left" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Product</th>
          <th align="center" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Qty</th>
          <th align="right" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr style="border-top:2px solid #111827;">
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827;">Total</td>
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827; text-align:right;">₹${Number(total).toLocaleString("en-IN")}</td>
      </tr>
    </table>

    ${addressHtml}

    <div style="text-align:center; margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/admin/dashboard/orders"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        View in Admin Dashboard
      </a>
    </div>
  `;

  return wrapEmailLayout(content, {
    title: `New Order #${orderId}`,
    previewText: `New order from ${customerName}. Total: ₹${Number(total).toLocaleString("en-IN")}`,
  });
}
