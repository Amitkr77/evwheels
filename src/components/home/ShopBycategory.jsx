"use client";

import { useEffect, useState } from "react";
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
  Package,
} from "lucide-react";

// Fallback glyph + color per known slug — used until a category has a real
// uploaded icon (admin: Categories → Icon). Anything not in this map (a
// brand-new category) still gets a sensible default instead of breaking.
const FALLBACK_STYLE = {
  bells: { icon: Bell, bg: "bg-amber-50", fg: "text-amber-600" },
  brakes: { icon: Disc, bg: "bg-red-50", fg: "text-red-500" },
  chains: { icon: Link2, bg: "bg-slate-100", fg: "text-slate-600" },
  "gear-sets": { icon: Cog, bg: "bg-violet-50", fg: "text-violet-600" },
  "handlebar-parts": { icon: GripHorizontal, bg: "bg-[#DDF8FD]", fg: "text-[#19B5D8]" },
  "lights-reflectors": { icon: Lightbulb, bg: "bg-yellow-50", fg: "text-yellow-600" },
  "locks-security": { icon: Lock, bg: "bg-blue-50", fg: "text-blue-600" },
  "mudguards-fenders": { icon: ShieldHalf, bg: "bg-sky-50", fg: "text-sky-600" },
  "saddles-seats": { icon: Armchair, bg: "bg-orange-50", fg: "text-orange-600" },
  "tyres-tubes": { icon: CircleDot, bg: "bg-neutral-100", fg: "text-neutral-700" },
  "tools-maintenance": { icon: Wrench, bg: "bg-emerald-50", fg: "text-emerald-600" },
  "wheels-hubs": { icon: CircleDashed, bg: "bg-indigo-50", fg: "text-indigo-600" },
};
const DEFAULT_STYLE = { icon: Package, bg: "bg-neutral-100", fg: "text-neutral-500" };

function SkeletonTile() {
  return <div className="rounded-2xl bg-neutral-100 animate-pulse h-[90px] md:h-[100px]" />;
}

// Content only — no outer <section>/container, so it can sit as the right
// half of the combined "Featured + Categories" section in HomeClient.
export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setCategories(d.categories || []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[#0C7290] text-xs font-semibold tracking-widest uppercase mb-2">
            Browse
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
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
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonTile key={i} />)
          : categories.map((cat, i) => {
              const style = FALLBACK_STYLE[cat.slug] || DEFAULT_STYLE;
              const Icon = style.icon;
              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.04 }}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 hover:border-[#19B5D8]/30 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 ${
                        cat.icon ? "bg-neutral-50" : style.bg
                      }`}
                    >
                      {cat.icon ? (
                        <img src={cat.icon} alt="" className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <Icon size={19} strokeWidth={1.75} className={style.fg} />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-700 group-hover:text-[#19B5D8] transition-colors text-center leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
      </div>

      {/* Mobile view all */}
      <div className="mt-6 sm:hidden text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C7290]"
        >
          View All Products <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
