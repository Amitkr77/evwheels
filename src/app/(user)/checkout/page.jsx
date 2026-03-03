// app/checkout/page.tsx

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, CreditCard, ShieldCheck, Phone ,ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="flex-grow bg-[#fdfcf9] min-h-screen font-['Inter'] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 flex flex-col gap-12 md:gap-16">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-light text-neutral-600">
              <Link
                href="/cart"
                className="hover:text-neutral-900 transition-colors"
              >
                Cart
              </Link>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-900 font-medium">Information</span>
              <span className="text-neutral-400">/</span>
              <span>Shipping</span>
              <span className="text-neutral-400">/</span>
              <span>Payment</span>
            </nav>

            {/* Contact Information */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900">
                  Contact Information
                </h2>
                <Link
                  href="/login"
                  className="text-sm md:text-base font-medium text-emerald-800 hover:underline transition-colors"
                >
                  Log in
                </Link>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="news"
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <label
                    htmlFor="news"
                    className="text-sm text-neutral-600 cursor-pointer"
                  >
                    Email me with news and offers
                  </label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc."
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Postal code
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      className="w-full pl-12 pr-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Delivery Method
              </h2>

              <div className="space-y-4">
                <label className="relative block cursor-pointer group">
                  <input
                    type="radio"
                    name="delivery"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="p-5 rounded-xl border border-neutral-300 peer-checked:border-emerald-600 bg-white transition-all group-hover:border-emerald-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">
                            Standard Shipping
                          </span>
                          <p className="text-sm text-neutral-600">
                            4-6 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-emerald-800">Free</span>
                    </div>
                  </div>
                </label>

                <label className="relative block cursor-pointer group">
                  <input
                    type="radio"
                    name="delivery"
                    className="peer sr-only"
                  />
                  <div className="p-5 rounded-xl border border-neutral-300 peer-checked:border-emerald-600 bg-white transition-all group-hover:border-emerald-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-colors flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">
                            Express Priority
                          </span>
                          <p className="text-sm text-neutral-600">
                            1-2 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-neutral-900">₹499</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-neutral-900 mb-8">
                Payment
              </h2>

              <div className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden">
                {/* Payment Tabs */}
                <div className="flex border-b border-neutral-200/70">
                  <button className="flex-1 py-4 text-sm md:text-base font-medium bg-emerald-50/50 text-emerald-800 border-b-2 border-emerald-600">
                    Credit Card
                  </button>
                  <button className="flex-1 py-4 text-sm md:text-base font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                    PayPal
                  </button>
                  <button className="flex-1 py-4 text-sm md:text-base font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                    Crypto
                  </button>
                </div>

                {/* Card Form */}
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-5 pl-12 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors font-mono"
                      />
                      <CreditCard
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        Expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        CVC
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-5 pr-12 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors font-mono"
                        />
                        <span
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
                          title="3 digits on back of card"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Name on card
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            <button className="w-full py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-8">
              Place Order
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-sm text-neutral-600 mt-6">
              By placing your order, you agree to our{" "}
              <Link href="#" className="text-emerald-800 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-emerald-800 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white border border-neutral-200/70 rounded-xl p-8">
                <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium mb-8">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-8 mb-10">
                  {/* Item 1 */}
                  <div className="flex gap-6">
                    <div className="relative w-20 h-20 shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDWCPCMwido0CTwC6e-pvT1I-LssryoC8FEe7nbufMewWBjDFfRYGCjvgNNDduJks-d1_4iOE3SHTJibBqhhu3k73fS25GY1qpoXi7Zh9U4zv98HQqcoWOteFL0GvgtzPABDy5ByWvhpzcZUTCIC958ejNZl1weOjGJODnKlmGna7rpGG1o0Spgm-UV65Ea0AhyoXfX8ipoD1eUEoAFZD4K3eV2gFnxOHwGUH0kKH1zWIAxCC3m5mywBEX5x_f0URaZ1JULMPNYCiB"
                        alt="Urban Glide E-Bike"
                        className="w-full h-full object-cover rounded-lg border border-neutral-200/60"
                      />
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-neutral-900">
                          Urban Glide E-Bike
                        </h4>
                        <span className="text-xl font-medium text-emerald-800">
                          ₹1,200.00
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Matte Black / Large
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-6">
                    <div className="relative w-20 h-20 shrink-0">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0iV0NVHW_gIe3A09n5zGVUC_BScM_c-cR55MDsK1htRQ9AY1DwGp6miEJuPL4iMf_05pCxXOWCwTyzs-3HTLR051gDb-sS31hk1lNrkhiEoku9217KfMqoSPYQGI_ZCEygvb6HFcSfrGrA58hqMC6gsblHigXY924WqjYIu90P8bcon1XIwrGR7YcpRuX4NKzGC4VFc2tnkmrB6x_zrwUKcqYcok7pwe8_VtuigaUIZrIr7qW4nIpkO6JvEaLglrZsMe0ba63e4X"
                        alt="Pro Safety Helmet"
                        className="w-full h-full object-cover rounded-lg border border-neutral-200/60"
                      />
                      <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-neutral-900">
                          Pro Safety Helmet
                        </h4>
                        <span className="text-xl font-medium text-emerald-800">
                          ₹90.00
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        Carbon Fiber
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-dashed border-neutral-200/60 my-8" />

                {/* Promo Code */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-neutral-600 mb-3">
                    Gift card or discount code
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                    />
                    <button className="px-6 py-3.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <hr className="border-dashed border-neutral-200/60 my-8" />

                {/* Totals */}
                <div className="space-y-4 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 font-medium">
                      ₹1,290.00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      Shipping
                      <span
                        className="text-neutral-500 cursor-help"
                        title="Calculated at next step"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="text-emerald-800 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-neutral-900 font-medium">
                      ₹103.20
                    </span>
                  </div>
                </div>

                <hr className="border-neutral-200/60 my-8" />

                <div className="flex justify-between items-end">
                  <span className="text-xl font-medium text-neutral-900">
                    Total
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm text-neutral-600">INR</span>
                    <span className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium text-emerald-800">
                      ₹1,393.20
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 md:gap-10 text-neutral-500">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck
                    size={24}
                    className="text-emerald-800"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-light">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <svg
                    className="w-6 h-6 text-emerald-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-xs font-light">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <svg
                    className="w-6 h-6 text-emerald-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <span className="text-xs font-light">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
