import { wrapEmailLayout } from "../sendMail";

/**
 * Abandoned cart reminder email — sent when user has items in cart but hasn't checked out.
 */
export function abandonedCartTemplate({
  name,
  items,
  subtotal,
  cartUrl,
  couponCode,
}) {
  const itemsHtml = items
    .slice(0, 4)
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb;">
          <p style="margin:0; font-size:14px; color:#374151; font-weight:500;">${item.name}</p>
          ${item.shortDescription ? `<p style="margin:4px 0 0; font-size:12px; color:#9ca3af;">${item.shortDescription}</p>` : ""}
        </td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:center;">${item.quantity}</td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:right;">₹${Number(item.price).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const moreItems = items.length > 4
    ? `<p style="text-align:center; font-size:13px; color:#6b7280; margin:12px 0 0;">+ ${items.length - 4} more item(s) in your cart</p>`
    : "";

  const couponSection = couponCode
    ? `
    <div style="background:#fefce8; border:2px dashed #f59e0b; border-radius:8px; padding:16px; margin:20px 0; text-align:center;">
      <p style="margin:0 0 4px; font-size:13px; color:#92400e;">Exclusive offer for you!</p>
      <p style="margin:0; font-size:20px; font-weight:700; color:#f59e0b; letter-spacing:2px;">${couponCode}</p>
      <p style="margin:4px 0 0; font-size:12px; color:#92400e;">Apply at checkout for extra savings!</p>
    </div>
  `
    : "";

  const content = `
    <h2 style="margin:0 0 8px; font-size:22px; color:#111827;">${name}, you left something behind! 🛒</h2>
    <p style="margin:0 0 20px; font-size:15px; color:#374151; line-height:1.6;">
      Great taste! You've got some amazing products waiting in your cart.
      Don't miss out — grab them before they're gone!
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

    ${moreItems}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>
        <td style="font-size:14px; color:#6b7280;">Cart Subtotal</td>
        <td style="font-size:14px; color:#111827; font-weight:600; text-align:right;">₹${Number(subtotal).toLocaleString("en-IN")}</td>
      </tr>
    </table>

    ${couponSection}

    <div style="text-align:center; margin-top:24px;">
      <a href="${cartUrl || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/cart`}"
         style="display:inline-block; padding:14px 32px; background:#059669; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Complete Your Purchase
      </a>
    </div>

    <p style="margin-top:24px; font-size:13px; color:#6b7280; line-height:1.6; text-align:center;">
      Prices and availability are subject to change. Checkout soon to secure your items!
    </p>
  `;

  return wrapEmailLayout(content, {
    title: "Your cart is waiting!",
    previewText: `${name}, you have ${items.length} item(s) in your cart. Complete your purchase now!`,
  });
}
