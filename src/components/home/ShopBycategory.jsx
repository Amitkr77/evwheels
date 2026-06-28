"use client";

import Link from "next/link";
import { Bike, ShieldCheck, Wrench, Lock, Zap, Cog } from "lucide-react";

const categories = [
  {
    name: "Brakes",
    icon: ShieldCheck,
    href: "/parts/disc-brakes",
  },
  {
    name: "Lights",
    icon: Zap,
    href: "/accessories/lights",
  },
  {
    name: "Gears",
    icon: Cog,
    href: "/parts/gear-shifters",
  },
  {
    name: "Helmets",
    icon: Bike,
    href: "/accessories/helmets",
  },
  {
    name: "Tools",
    icon: Wrench,
    href: "/accessories/tools",
  },
  {
    name: "Locks",
    icon: Lock,
    href: "/accessories/locks",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-32 md:py-40 bg-white">
  <div className="max-w-6xl mx-auto px-6 lg:px-12">

    {/* Header */}
    <div className="text-center mb-20">
      <span className="text-xs uppercase tracking-[0.35em] text-[#19B5D8]">
        Browse Categories
      </span>

      <h2 className="mt-6 text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
        Shop By Category
      </h2>

      <p className="mt-6 max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
        Explore thoughtfully selected components and accessories for
        everyday riding and long-term reliability.
      </p>
    </div>

    {/* Categories */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 md:gap-14 text-center">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <Link
            key={category.name}
            href={category.href}
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

            <h3 className="text-base sm:text-lg font-medium">
              {category.name}
            </h3>
          </Link>
        );
      })}
    </div>

    {/* Bottom Values */}
    <div className="mt-28 pt-16 border-t border-neutral-200/70">
      <div className="grid md:grid-cols-3 gap-16 text-center">
        <div>
          <h3 className="text-2xl font-light mb-5">
            Genuine Components
          </h3>

          <p className="text-neutral-600 font-light leading-relaxed">
            Trusted brands and authentic replacement parts selected
            for reliability and performance.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-light mb-5">
            Fast Shipping
          </h3>

          <p className="text-neutral-600 font-light leading-relaxed">
            Quick dispatch and secure packaging across India.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-light mb-5">
            Expert Support
          </h3>

          <p className="text-neutral-600 font-light leading-relaxed">
            Guidance from specialists to help you choose the right
            components.
          </p>
        </div>
      </div>
    </div>

  </div>
</section>
  );
}
