"use client";

import Link from "next/link";
import { ShieldCheck, Bike, Zap, Lock } from "lucide-react";

const items = [
  {
    id: 57,
    name: "Premium Safety Helmet",
    price: "₹899",
    icon: ShieldCheck,
  },
  {
    id: 1,
    name: "USB Front Light",
    price: "₹299",
    icon: Zap,
  },
  {
    id: 60,
    name: "Heavy Duty Lock",
    price: "₹499",
    icon: Lock,
  },
  {
    id: 58,
    name: "Ventilated Helmet Pro",
    price: "₹1,199",
    icon: Bike,
  },
];

export default function SafetyFirst() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-5xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.35em] text-[#19B5D8]">
            Safety Essentials
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-medium">
            Safety First
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
            Thoughtfully selected protection and visibility gear designed for
            confidence on every journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 text-center">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group"
              >
                <div
                  className="
                    w-16 h-16
                    mx-auto
                    mb-6
                    rounded-full
                    bg-[#DDF8FD]/40
                    flex
                    items-center
                    justify-center
                    transition-colors
                    group-hover:bg-[#DDF8FD]
                  "
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-[#19B5D8]"
                  />
                </div>

                <h3 className="text-base sm:text-lg font-medium mb-2">
                  {item.name}
                </h3>

                <p className="text-sm text-neutral-600 font-light">
                  {item.price}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <Link
            href="/accessories"
            className="
              inline-block
              text-sm
              tracking-wide
              text-[#19B5D8]
              hover:opacity-70
              transition-opacity
            "
          >
            Explore Safety Collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
