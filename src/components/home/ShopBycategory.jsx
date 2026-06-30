"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: "Bells", emoji: "🔔", href: "/shop?category=bells" },
  { name: "Brakes", emoji: "🛑", href: "/shop?category=brakes" },
  { name: "Chains", emoji: "⛓️", href: "/shop?category=chains" },
  { name: "Gear Sets", emoji: "⚙️", href: "/shop?category=gear-sets" },
  { name: "Lights", emoji: "💡", href: "/shop?category=lights-reflectors" },
  { name: "Locks", emoji: "🔒", href: "/shop?category=locks-security" },
  { name: "Saddles", emoji: "🪑", href: "/shop?category=saddles-seats" },
  { name: "Tyres", emoji: "🔵", href: "/shop?category=tyres-tubes" },
  { name: "Tools", emoji: "🔧", href: "/shop?category=tools-maintenance" },
  { name: "Mudguards", emoji: "🛡️", href: "/shop?category=mudguards-fenders" },
  { name: "Wheels", emoji: "🎡", href: "/shop?category=wheels-hubs" },
  { name: "Handlebar", emoji: "🎯", href: "/shop?category=handlebar-parts" },
];

export default function ShopByCategory() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <p className="text-[#19B5D8] text-xs font-semibold tracking-widest uppercase mb-2">
              Browse
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-[#19B5D8] transition-colors"
          >
            All Products
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-neutral-100 bg-neutral-50 hover:border-[#19B5D8]/30 hover:bg-[#DDF8FD]/30 transition-all duration-200"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-neutral-700 group-hover:text-[#19B5D8] transition-colors text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#19B5D8]"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
