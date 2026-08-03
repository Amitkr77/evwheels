"use client";

// Shared status→color mapping — previously reimplemented independently in
// profile/page.jsx, Myorders.jsx, and OrderTracker.jsx with different (and
// less complete) sets of colors.
const STYLES = {
  DELIVERED: "bg-[#DDF8FD] text-[#19B5D8]",
  SHIPPED: "bg-blue-50 text-blue-700",
  PLACED: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-indigo-50 text-indigo-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function OrderStatusBadge({ status, className = "" }) {
  const style = STYLES[status] || "bg-neutral-100 text-neutral-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${style} ${className}`}
    >
      {status}
    </span>
  );
}
