"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Disc,
  Link2,
  Cog,
  Lightbulb,
  Lock,
  Armchair,
  CircleDot,
  Wrench,
  ShieldHalf,
  CircleDashed,
  GripHorizontal,
} from "lucide-react";

// Emoji render inconsistently across OS/browsers and read as a step down in
// polish next to the rest of the site's icon set — same 12 categories as the
// Support page's finder, drawn from lucide so both stay visually consistent.
const CATEGORIES = [
  { name: "Bells", icon: Bell, href: "/shop?category=bells", bg: "bg-amber-50", fg: "text-amber-600" },
  { name: "Brakes", icon: Disc, href: "/shop?category=brakes", bg: "bg-red-50", fg: "text-red-500" },
  { name: "Chains", icon: Link2, href: "/shop?category=chains", bg: "bg-slate-100", fg: "text-slate-600" },
  { name: "Gear Sets", icon: Cog, href: "/shop?category=gear-sets", bg: "bg-violet-50", fg: "text-violet-600" },
  { name: "Lights", icon: Lightbulb, href: "/shop?category=lights-reflectors", bg: "bg-yellow-50", fg: "text-yellow-600" },
  { name: "Locks", icon: Lock, href: "/shop?category=locks-security", bg: "bg-blue-50", fg: "text-blue-600" },
  { name: "Saddles", icon: Armchair, href: "/shop?category=saddles-seats", bg: "bg-orange-50", fg: "text-orange-600" },
  { name: "Tyres", icon: CircleDot, href: "/shop?category=tyres-tubes", bg: "bg-neutral-100", fg: "text-neutral-700" },
  { name: "Tools", icon: Wrench, href: "/shop?category=tools-maintenance", bg: "bg-emerald-50", fg: "text-emerald-600" },
  { name: "Mudguards", icon: ShieldHalf, href: "/shop?category=mudguards-fenders", bg: "bg-sky-50", fg: "text-sky-600" },
  { name: "Wheels", icon: CircleDashed, href: "/shop?category=wheels-hubs", bg: "bg-indigo-50", fg: "text-indigo-600" },
  { name: "Handlebar", icon: GripHorizontal, href: "/shop?category=handlebar-parts", bg: "bg-[#DDF8FD]", fg: "text-[#19B5D8]" },
];

export default function ShopByCategory() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <p className="text-[#0C7290] text-xs font-semibold tracking-widest uppercase mb-2">
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
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-neutral-100 bg-neutral-50/60 hover:border-[#19B5D8]/30 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${cat.bg}`}
                >
                  <cat.icon size={22} strokeWidth={1.75} className={cat.fg} />
                </div>
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C7290]"
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
