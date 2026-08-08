"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
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
  Zap,
  Gauge,
  Battery,
  Settings,
} from "lucide-react";

// Icon + colour mapping keyed by category slug
const FALLBACK_STYLE = {
  bells:                { icon: Bell,          bg: "bg-amber-50",   fg: "text-amber-600"   },
  brakes:               { icon: Disc,          bg: "bg-red-50",     fg: "text-red-500"     },
  chains:               { icon: Link2,         bg: "bg-slate-100",  fg: "text-slate-600"   },
  "gear-sets":          { icon: Cog,           bg: "bg-violet-50",  fg: "text-violet-600"  },
  "handlebar-parts":    { icon: GripHorizontal,bg: "bg-[#DDF8FD]",  fg: "text-[#19B5D8]"  },
  "lights-reflectors":  { icon: Lightbulb,     bg: "bg-yellow-50",  fg: "text-yellow-600"  },
  "locks-security":     { icon: Lock,          bg: "bg-blue-50",    fg: "text-blue-600"    },
  "mudguards-fenders":  { icon: ShieldHalf,    bg: "bg-sky-50",     fg: "text-sky-600"     },
  "saddles-seats":      { icon: Armchair,      bg: "bg-orange-50",  fg: "text-orange-600"  },
  "tyres-tubes":        { icon: CircleDot,     bg: "bg-neutral-100",fg: "text-neutral-700" },
  "tools-maintenance":  { icon: Wrench,        bg: "bg-emerald-50", fg: "text-emerald-600" },
  "wheels-hubs":        { icon: CircleDashed,  bg: "bg-indigo-50",  fg: "text-indigo-600"  },
  "electric-cycles":    { icon: Zap,           bg: "bg-[#DDF8FD]",  fg: "text-[#19B5D8]"  },
  "electric-scooters":  { icon: Gauge,         bg: "bg-indigo-50",  fg: "text-indigo-600"  },
  batteries:            { icon: Battery,       bg: "bg-emerald-50", fg: "text-emerald-600" },
  "conversion-kits":    { icon: Settings,      bg: "bg-violet-50",  fg: "text-violet-600"  },
};
const DEFAULT_STYLE = { icon: Package, bg: "bg-neutral-100", fg: "text-neutral-500" };

// ── Product Showcase (25%) ────────────────────────────────────────────────────

function ProductShowcase({ category, product, loading }) {
  const style = category ? (FALLBACK_STYLE[category.slug] || DEFAULT_STYLE) : DEFAULT_STYLE;
  const Icon = style.icon;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-neutral-950 min-h-[380px] flex flex-col">

      {/* Background image — cross-fades per product */}
      <AnimatePresence mode="sync">
        {product?.images?.[0] && (
          <motion.div
            key={product._id + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-on gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-900/30" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col justify-between h-full flex-1 p-6">

        {/* Category badge */}
        <div className="h-8 flex items-start">
          <AnimatePresence mode="popLayout">
            {category && (
              <motion.span
                key={category.slug + "-badge"}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28 }}
                className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/15"
              >
                <Icon size={9} />
                {category.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Product info */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div key="skeleton" className="space-y-3">
              <div className="h-4 bg-white/10 rounded-full animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded-full animate-pulse w-1/2" />
              <div className="h-8 bg-white/10 rounded-full animate-pulse w-1/3 mt-3" />
            </motion.div>
          ) : product ? (
            <motion.div
              key={product._id + "-info"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-[17px] font-bold text-white leading-snug mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-2xl font-bold text-white mb-5 tracking-tight">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              <Link
                href={`/shop/${product.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 rounded-full text-[12px] font-semibold hover:bg-[#19B5D8] hover:text-white transition-colors"
              >
                View Product <ArrowUpRight size={12} strokeWidth={2.2} />
              </Link>
            </motion.div>
          ) : category ? (
            <motion.div
              key={category.slug + "-fallback"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-white/40 text-sm mb-3">Browse this category</p>
              <Link
                href={`/shop?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-neutral-900 rounded-full text-[12px] font-semibold hover:bg-[#19B5D8] hover:text-white transition-colors"
              >
                Explore <ArrowRight size={12} />
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Category Explorer (75%) ───────────────────────────────────────────────────

function CategoryRow({ cat, index, isActive, product, onHover, onLeave }) {
  const style = FALLBACK_STYLE[cat.slug] || DEFAULT_STYLE;
  const Icon = style.icon;

  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative flex items-center gap-4 px-5 py-[15px] border-b border-neutral-50 border-l-[3px] transition-all duration-200 ${
        isActive
          ? "bg-[#F0FEFF] border-l-[#19B5D8]"
          : "border-l-transparent hover:bg-neutral-50/80"
      }`}
    >
      {/* Index number */}
      <span
        className={`text-[10px] font-black tabular-nums w-5 shrink-0 leading-none transition-colors ${
          isActive ? "text-[#19B5D8]" : "text-neutral-200 group-hover:text-neutral-300"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon bubble */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-all duration-200 ${
          isActive ? "bg-[#DDF8FD] scale-105" : `${style.bg} opacity-75 group-hover:opacity-100`
        }`}
      >
        {cat.icon ? (
          <img src={cat.icon} alt="" className="w-[18px] h-[18px] object-contain" />
        ) : (
          <Icon
            size={16}
            strokeWidth={1.8}
            className={isActive ? "text-[#19B5D8]" : style.fg}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13.5px] font-semibold leading-tight truncate transition-colors duration-200 ${
            isActive ? "text-[#0C7290]" : "text-neutral-800 group-hover:text-neutral-900"
          }`}
        >
          {cat.name}
        </p>
        {product?.title && (
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight truncate">
            {product.title}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight
        size={13}
        className={`shrink-0 transition-all duration-200 ${
          isActive
            ? "text-[#19B5D8] translate-x-0.5"
            : "text-neutral-200 group-hover:text-neutral-400 group-hover:translate-x-0.5"
        }`}
      />
    </Link>
  );
}

function CategoryExplorer({ categories, products, activeIndex, loading, onHover, onLeave }) {
  const mid = Math.ceil(categories.length / 2);
  const leftCol  = categories.slice(0, mid);
  const rightCol = categories.slice(mid);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-[68px] border-b border-neutral-50 animate-pulse bg-neutral-50/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-neutral-100 rounded-2xl border border-neutral-100 overflow-hidden">
      <div>
        {leftCol.map((cat, i) => (
          <CategoryRow
            key={cat._id}
            cat={cat}
            index={i}
            isActive={i === activeIndex}
            product={products[cat.slug]}
            onHover={() => onHover(i)}
            onLeave={onLeave}
          />
        ))}
      </div>
      <div>
        {rightCol.map((cat, i) => (
          <CategoryRow
            key={cat._id}
            cat={cat}
            index={mid + i}
            isActive={mid + i === activeIndex}
            product={products[cat.slug]}
            onHover={() => onHover(mid + i)}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function FeaturedAndCategories() {
  const [categories, setCategories] = useState([]);
  const [products,   setProducts]   = useState({}); // { [slug]: product | null }
  const [loading,    setLoading]    = useState(true);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fetch categories then one product per category in parallel
  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const cats = d.categories || [];
        setCategories(cats);
        return Promise.all(
          cats.map((cat) =>
            fetch(`/api/products?category=${cat.slug}&limit=1`)
              .then((r) => r.json())
              .then((d) => ({ slug: cat.slug, product: (d.products || [])[0] ?? null }))
              .catch(() => ({ slug: cat.slug, product: null }))
          )
        );
      })
      .then((results) => {
        if (cancelled || !results) return;
        const map = {};
        results.forEach(({ slug, product }) => { map[slug] = product; });
        setProducts(map);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // Auto-advance — pauses while hovering
  useEffect(() => {
    if (categories.length === 0 || hoveredIndex !== null) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 3200);
    return () => clearInterval(id);
  }, [categories.length, hoveredIndex]);

  if (!loading && categories.length === 0) return null;

  const displayIndex   = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const activeCategory = categories[displayIndex] ?? null;
  const activeProduct  = activeCategory ? (products[activeCategory.slug] ?? null) : null;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#0C7290] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              Explore our catalog
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-[#19B5D8] transition-colors shrink-0"
          >
            All Products <ArrowRight size={14} />
          </Link>
        </div>

        {/* 25% showcase + 75% categories */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4 lg:gap-5 items-stretch">
          <ProductShowcase
            category={activeCategory}
            product={activeProduct}
            loading={loading}
          />
          <CategoryExplorer
            categories={categories}
            products={products}
            activeIndex={displayIndex}
            loading={loading}
            onHover={setHoveredIndex}
            onLeave={() => setHoveredIndex(null)}
          />
        </div>

        {/* Mobile view-all */}
        <div className="mt-6 sm:hidden text-center">
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
