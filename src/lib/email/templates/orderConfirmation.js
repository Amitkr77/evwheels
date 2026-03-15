export function orderConfirmationTemplate(
    orderId,
    items,
    total
) {
    const itemsHtml = items
        .map(
            (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `
        )
        .join("");

    return `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    <h2>Order Confirmed 🎉</h2>

    <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>

    <table style="width:100%;border-collapse:collapse;margin-top:20px">
      <thead>
        <tr>
          <th align="left">Product</th>
          <th align="left">Qty</th>
          <th align="left">Price</th>
        </tr>
      </thead>

      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <h3 style="margin-top:20px">
      Total: ₹${total}
    </h3>

    <p style="margin-top:20px">
      Thank you for shopping with us!
    </p>
  </div>
  `;
}