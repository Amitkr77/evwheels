/**
 * Shared formatting helpers — used to replace the several different
 * ad-hoc currency/status formatters that had drifted across the app
 * (a mix of Intl.NumberFormat("en-IN"), manual "₹" + toLocaleString("en-IN"),
 * toLocaleString() with no locale, and one lone "en-US" instance).
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * Format a number as Indian Rupees, e.g. formatCurrency(12500) -> "₹12,500"
 */
export function formatCurrency(amount) {
  return inrFormatter.format(Number(amount) || 0);
}

// Order/product status values come straight from the database as shouted
// enum strings (e.g. "DELIVERED", "PLACED") — this turns them into the
// title-cased text a customer should actually read.
const STATUS_LABELS = {
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

/**
 * Humanize a raw status enum for display, e.g. "DELIVERED" -> "Delivered"
 */
export function humanizeStatus(status) {
  if (!status) return "";
  return (
    STATUS_LABELS[status] ||
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  );
}
