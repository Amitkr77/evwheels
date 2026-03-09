// app/order-confirmation/page.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Lock, CreditCard } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <main className="flex-grow bg-[#fdfcf9] min-h-screen font-['Inter'] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Success Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center gap-8 rounded-2xl bg-white border border-neutral-200/70 p-8 md:p-12 text-center mb-16"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-50/60 animate-ping opacity-75 duration-1000" />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-800 text-white shadow-md">
              <CheckCircle size={40} strokeWidth={1.8} />
            </div>
          </div>

          <div className="space-y-3 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-neutral-900">
              Order Confirmed!
            </h1>
            <p className="text-lg text-neutral-600 font-light leading-relaxed">
              Thank you for your order! Your gear is on the way. A confirmation
              email has been sent to{" "}
              <span className="text-neutral-900 font-medium">
                amit@example.com
              </span>
              .
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-4 bg-neutral-50 border border-neutral-200/70 rounded-xl p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Order Placed
                  </p>
                  <p className="text-xs text-neutral-600">Mar 03, 11:12 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    Est. Delivery
                  </p>
                  <p className="text-emerald-800 font-medium">
                    Mar 07 - Mar 09
                  </p>
                </div>
              </div>

              <div className="relative h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[25%] rounded-full bg-emerald-600 transition-all duration-1000" />
              </div>

              <div className="flex justify-between text-xs font-light text-neutral-600">
                <span>Confirmed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Details & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left: Items List */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium text-neutral-900 pb-4 border-b border-neutral-200/60">
              Items Ordered
            </h3>

            {/* Item 1 */}
            <div className="flex gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVepsbCS4lmJIT4iOzG6pMSJaHYg72LgzMnHjgh0yoBdvnMwTzYUgKASZWKJigTVczd792tkdLg6JlZF4-tQMygITpQ8VIEjRUFcJzRoeACN1yC36sy7AnTQSLl5m12EQc775bVpYh9u6k6Eds5pv8A9GwY_VDuXJDHD1QllvhnXPirDyorgdS3dlUCSpvK3neUg3XUPUQI2QPU0WZKfQd29xOfmkzUwuGgrZQO9CPUIdTel8k6cYN9Wvcq6QyIu6SELlC_9BkxEN1"
                  alt="Aero E-Bike Helmet"
                  className="w-full h-full object-cover rounded-lg border border-neutral-200/60"
                />
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-medium text-neutral-900 mb-1">
                  Aero E-Bike Helmet
                </h4>
                <p className="text-sm text-neutral-600">Matte Black / L</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-medium text-emerald-800">₹120.00</p>
                <p className="text-xs text-neutral-600 mt-1">Qty: 1</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-6 border-t border-neutral-200/60 pt-6">
              <div className="relative w-24 h-24 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUtKkyEXBodWIYoqsWGR8XmKIw2wPoD9jfnHcjQVbqlNB3ZOBkgKNqn-cKGgLtiEVK64cLRgolfx2TrQLDYmktbReJRQSApzKNEgv5DdytsIJnPEpUxwB1as3N_gMGo6tbwSULshem0zDm82ILeTtYAq7GPjGWW-0-XG7iRRMPj96LjEZeQX9F3FPCM4Sd7Q492fL9cs_j2CSrpqEd3iUvmWaSlKskdG89Qpp79bzq5ucSPZxOc1v4hZYpwZPYLTSwS8fzr_LhrG3S"
                  alt="EvWheels Pro Charger"
                  className="w-full h-full object-cover rounded-lg border border-neutral-200/60"
                />
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                  1
                </span>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-medium text-neutral-900 mb-1">
                  EvWheels Pro Charger
                </h4>
                <p className="text-sm text-neutral-600">Fast Charge / Type 2</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-medium text-emerald-800">₹85.00</p>
                <p className="text-xs text-neutral-600 mt-1">Qty: 1</p>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white border border-neutral-200/70 rounded-xl p-8">
              <h3 className="text-2xl font-['Playfair_Display'] font-medium text-neutral-900 mb-6 pb-4 border-b border-neutral-200/60">
                Summary
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    #EV-8829-XJ
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    Mar 03, 2026
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-neutral-600" />
                    <p className="text-sm font-medium text-neutral-900">
                      Visa •••• 4242
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-200/60">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-neutral-600">
                      Total Paid
                    </p>
                    <p className="text-2xl font-['Playfair_Display'] font-medium text-emerald-800">
                      ₹205.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <button className="flex-1 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
            Track Order
            <ArrowRight size={18} />
          </button>

          <Link
            href="/cycles"
            className="flex-1 py-4 border border-neutral-300 text-neutral-900 rounded-full text-lg font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-neutral-600 mt-8">
          Need to make changes?{" "}
          <Link
            href="/contact"
            className="text-emerald-800 hover:underline font-medium"
          >
            Contact Support
          </Link>{" "}
          within 2 hours.
        </p>
      </div>
    </main>
  );
}
