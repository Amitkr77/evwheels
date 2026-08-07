"use client";

import OrderTracker from "./OrderTracker";
import { formatCurrency } from "@/lib/format";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  // Checkout writes the address as { street, city, state, postalCode } (see
  // app/(user)/checkout/page.jsx) while the saved-address book uses
  // addressLine for the same concept — read both so orders placed either way
  // display correctly here.
  const addressLine = order.shippingAddress?.street || order.shippingAddress?.addressLine;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="order-details-title" className="text-xl font-semibold">
            Order {order.id || order._id}
          </h2>

          <button onClick={onClose} aria-label="Close order details" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            ✕
          </button>
        </div>

        {/* Tracker */}
        <OrderTracker status={order.orderStatus} orderId={order._id?.toString()} />

        {/* Items */}
        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.product}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p>
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 text-sm space-y-1">
          <p>Subtotal: {formatCurrency(order.totalAmount)}</p>
          <p>Tax: {formatCurrency(order.taxAmount)}</p>
          <p>Shipping: {formatCurrency(order.shippingAmount)}</p>
        </div>

        {/* Address */}
        {order.shippingAddress && (
          <div className="mt-6">
            <p className="font-medium">Shipping Address</p>
            <p className="text-sm text-neutral-600">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-sm text-neutral-600">
              {addressLine}
            </p>
            <p className="text-sm text-neutral-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}