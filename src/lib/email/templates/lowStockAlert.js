import { wrapEmailLayout } from "../sendMail";

/**
 * Low stock alert email — sent to admin when product stock drops below threshold.
 */
export function lowStockAlertTemplate({ products, threshold }) {
  const productsHtml = products
    .map(
      (p) => `
      <tr>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; font-weight:500;">${p.name}</td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:center;">${p.sku || "N/A"}</td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; text-align:center;">
          <span style="background:${p.stock === 0 ? "#fef2f2" : "#fefce8"}; color:${p.stock === 0 ? "#991b1b" : "#92400e"}; padding:4px 10px; border-radius:12px; font-weight:600; font-size:13px;">
            ${p.stock === 0 ? "OUT OF STOCK" : p.stock + " left"}
          </span>
        </td>
        <td style="padding:12px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; color:#374151; text-align:right;">₹${Number(p.price).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <div style="text-align:center; margin-bottom:20px;">
      <span style="font-size:40px;">⚠️</span>
    </div>

    <h2 style="margin:0 0 8px; font-size:22px; color:#111827; text-align:center;">
      Low Stock Alert
    </h2>
    <p style="margin:0 0 20px; font-size:14px; color:#6b7280; text-align:center;">
      The following products have stock at or below <strong>${threshold} units</strong>. Restock soon to avoid lost sales!
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
      <thead>
        <tr style="background:#f9fafb;">
          <th align="left" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Product</th>
          <th align="center" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">SKU</th>
          <th align="center" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Stock</th>
          <th align="right" style="padding:12px 8px; font-size:13px; color:#6b7280; font-weight:600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${productsHtml}
      </tbody>
    </table>

    <div style="text-align:center; margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/admin/dashboard/inventory"
         style="display:inline-block; padding:14px 32px; background:#111827; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
        Manage Inventory
      </a>
    </div>

    <p style="margin-top:20px; font-size:13px; color:#6b7280; line-height:1.6; text-align:center;">
      This is an automated alert from EV Wheels. Products with zero stock will not be visible to customers.
    </p>
  `;

  return wrapEmailLayout(content, {
    title: `Low Stock Alert — ${products.length} product(s)`,
    previewText: `${products.length} product(s) have low stock (≤${threshold} units). Restock to avoid lost sales.`,
  });
}
