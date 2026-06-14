import { wrapEmailLayout } from "../sendMail";

/**
 * Order confirmation email sent to the customer after placing an order.
 */
export function orderConfirmationTemplate({
  orderId,
  items,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  paymentMethod,
  shippingAddress,
  orderDate,
}) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151;">${item.name}</td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:center;">${item.quantity}</td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:right;">₹${Number(item.price).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const addressHtml = shippingAddress
    ? `
    <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-top:24px;">
      <h4 style="margin:0 0 8px; font-size:14px; color:#374151;">Shipping Address</h4>
      <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
        ${shippingAddress.fullName || ""}<br/>
        ${shippingAddress.street || ""}<br/>
        ${shippingAddress.city || ""}, ${shippingAddress.state || ""} ${shippingAddress.postalCode || ""}<br/>
        ${shippingAddress.phone || ""}
      </p>
    </div>
  `
    : "";

  const discountRow = discount > 0
    ? `<tr>
        <td style="padding:6px 0; font-size:14px; color:#059669;">Discount</td>
        <td style="padding:6px 0; font-size:14px; color:#059669; text-align:right;">-₹${Number(discount).toLocaleString("en-IN")}</td>
      </tr>`
    : "";

  const content = `
    <h2 style="margin:0 0 8px; font-size:22px; color:#111827;">Order Confirmed! 🎉</h2>
    <p style="margin:0 0 4px; font-size:14px; color:#6b7280;">
      Order <strong style="color:#059669;">#${orderId}</strong> &middot; ${orderDate ? new Date(orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-IN")}
    </p>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280;">
      Payment: <strong>${paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</strong>
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
        ${itemsHtml}
      </tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Subtotal</td>
        <td style="padding:6px 0; font-size:14px; color:#6b7280; text-align:right;">₹${Number(subtotal).toLocaleString("en-IN")}</td>
      </tr>
      ${discountRow}
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Tax (GST)</td>
        <td style="padding:6px 0; font-size:14px; color:#6b7280; text-align:right;">₹${Number(tax).toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td style="padding:6px 0; font-size:14px; color:#6b7280;">Shipping</td>
        <td style="padding:6px 0; font-size:14px; color:#6b7280; text-align:right;">₹${Number(shipping).toLocaleString("en-IN")}</td>
      </tr>
      <tr style="border-top:2px solid #111827;">
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827;">Total</td>
        <td style="padding:12px 0 4px; font-size:16px; font-weight:700; color:#111827; text-align:right;">₹${Number(total).toLocaleString("en-IN")}</td>
      </tr>
    </table>

    ${addressHtml}

    <div style="text-align:center; margin-top:28px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/account/orders"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Track Your Order
      </a>
    </div>
  `;

  return wrapEmailLayout(content, {
    title: `Order #${orderId} Confirmed`,
    previewText: `Your order #${orderId} has been placed successfully. Total: ₹${Number(total).toLocaleString("en-IN")}`,
  });
}
