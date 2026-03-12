"use client";

import OrderTracker from "./OrderTracker";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Order {order.id || order._id}
          </h2>

          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Tracker */}
        <OrderTracker status={order.orderStatus} />

        {/* Items */}
        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.product}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p>
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 text-sm space-y-1">
          <p>Subtotal: ₹{order.totalAmount.toLocaleString()}</p>
          <p>Tax: ₹{order.taxAmount}</p>
          <p>Shipping: ₹{order.shippingAmount}</p>
        </div>

        {/* Address */}
        <div className="mt-6">
          <p className="font-medium">Shipping Address</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress?.fullName}
          </p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress?.street}
          </p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </p>
        </div>
      </div>
    </div>
  );
}