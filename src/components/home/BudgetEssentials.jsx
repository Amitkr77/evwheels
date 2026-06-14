"use client";

import Link from "next/link";

const items = [
  { id: 27, name: "Basic Bell", price: "₹99" },
  { id: 28, name: "Classic Bell", price: "₹129" },
  { id: 47, name: "Water Bottle", price: "₹149" },
  { id: 73, name: "Reflector Set", price: "₹199" },
  { id: 74, name: "Safety Reflector", price: "₹249" },
  { id: 75, name: "Mini Bottle Holder", price: "₹179" },
];

export default function BudgetEssentials() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-5xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs tracking-[0.35em] uppercase text-emerald-800">
            Smart Savings
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Budget Essentials
          </h2>

          <p className="mt-6 max-w-xl mx-auto text-neutral-600 font-light leading-relaxed">
            Affordable accessories thoughtfully selected for everyday riding.
          </p>
        </div>

        {/* Items */}
        <div className="divide-y divide-neutral-200/70">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="group flex items-center justify-between py-8 transition-all"
            >
              <div>
                <h3 className="text-lg font-light text-neutral-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Essential riding accessory
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-light text-neutral-900">
                  {item.price}
                </p>

                <span className="mt-2 block text-sm text-neutral-400 transition-colors group-hover:text-emerald-800">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}