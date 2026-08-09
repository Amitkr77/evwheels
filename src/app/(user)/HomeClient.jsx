"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  MapPin,
  Package,
  Zap,
  Leaf,
  BarChart3,
  Battery,
  Gauge,
  Settings,
} from "lucide-react";

// Maps icon name strings (stored in DB) to icon components for hero slides
const ICON_MAP = { Zap, Battery, Settings, Package, Gauge };
import PopularProducts from "@/components/home/PopularProducts";
import FeaturedAndCategories from "@/components/home/FeaturedAndCategories";
import PromoBanners from "@/components/home/PromoBanners";
import ProductCard from "@/components/shop/ProductCard";

// ── Data ──────────────────────────────────────────────────

const TRUST = [
  { icon: Truck, label: "Free Delivery", sub: "Orders above ₹5,000" },
  { icon: ShieldCheck, label: "Genuine Products", sub: "100% authentic" },
  {
    icon: Zap,
    label: "In-House Manufactured",
    sub: "Cycles & lithium batteries",
  },
  {
    icon: MapPin,
    label: "Pan-India Delivery",
    sub: "From Patna, to everywhere",
  },
];

const HERO_STATS = [
  { num: "5", label: "Product lines" },
  { num: "500+", label: "Dealers served" },
  { num: "Pan-India", label: "Delivery" },
];

// Right panel: 4 of 5 product lines as quick-nav cards
const HERO_CATS = [
  {
    name: "Electric Cycles",
    sub: "In-house manufactured",
    href: "/shop?category=electric-cycles",
    icon: Zap,
    cardCls: "bg-[#F0FEFF] hover:border-[#19B5D8]/30",
    iconBg: "bg-[#DDF8FD]",
    iconC: "text-[#19B5D8]",
    linkC: "text-[#0C7290]",
  },
  {
    name: "Electric Scooters",
    sub: "Assembled, ready-to-ride",
    href: "/shop?category=electric-scooters",
    icon: Gauge,
    cardCls: "bg-indigo-50 hover:border-indigo-200",
    iconBg: "bg-indigo-100",
    iconC: "text-indigo-500",
    linkC: "text-indigo-700",
  },
  {
    name: "Conversion Kits",
    sub: "Electrify your cycle",
    href: "/shop?category=conversion-kits",
    icon: Settings,
    cardCls: "bg-violet-50 hover:border-violet-200",
    iconBg: "bg-violet-100",
    iconC: "text-violet-500",
    linkC: "text-violet-700",
  },
  {
    name: "Parts & Accessories",
    sub: "240+ genuine SKUs",
    href: "/shop",
    icon: Package,
    cardCls: "bg-amber-50 hover:border-amber-200",
    iconBg: "bg-amber-100",
    iconC: "text-amber-500",
    linkC: "text-amber-700",
  },
];

// All 5 product lines — used in ProductLinesSection
const PRODUCT_LINES = [
  {
    icon: Zap,
    label: "Electric Cycles",
    desc: "Manufactured in-house at our Patna facility. Lightweight frames, pedal-assist motors, up to 80 km range.",
    href: "/shop?category=electric-cycles",
    bg: "bg-[#DDF8FD]",
    iconC: "text-[#0C7290]",
    border: "border-[#19B5D8]/20",
  },
  {
    icon: Gauge,
    label: "Electric Scooters",
    desc: "Assembled by us. Built for daily commutes, delivery riders, and last-mile travel across Indian roads.",
    href: "/shop?category=electric-scooters",
    bg: "bg-indigo-50",
    iconC: "text-indigo-600",
    border: "border-indigo-200",
  },
  {
    icon: Battery,
    label: "Lithium-Ion Batteries",
    desc: "We manufacture the batteries ourselves — the safety-critical component most EV brands simply outsource.",
    href: "/shop?category=batteries",
    bg: "bg-emerald-50",
    iconC: "text-emerald-600",
    border: "border-emerald-200",
  },
  {
    icon: Settings,
    label: "Conversion Kits",
    desc: "Motor, battery, controller and hardware. Convert your existing cycle into a fully electric one.",
    href: "/shop?category=conversion-kits",
    bg: "bg-violet-50",
    iconC: "text-violet-600",
    border: "border-violet-200",
  },
  {
    icon: Package,
    label: "Parts & Accessories",
    desc: "240+ genuine parts across 23 categories — Shimano, disc brakes, lights, helmets, and scooter spare parts.",
    href: "/shop",
    bg: "bg-amber-50",
    iconC: "text-amber-600",
    border: "border-amber-200",
  },
];

const WHY = [
  {
    n: "01",
    title: "In-House Manufacturing",
    desc: "We build our electric cycles and lithium-ion batteries from the ground up at our Patna facility. Not imported. Not rebadged. Engineered and assembled by us.",
  },
  {
    n: "02",
    title: "Full-Stack EV Supplier",
    desc: "Electric cycles, scooters, batteries, conversion kits, and 240+ spare parts — one brand, every EV need. No juggling between vendors.",
  },
  {
    n: "03",
    title: "Retail + Wholesale",
    desc: "Individual riders shop at listed prices. Dealers get wholesale rates and bulk quotes. Both ship Pan-India, fast, from Patna.",
  },
];

const EV_FEATURES = [
  {
    icon: Zap,
    label: "Electric Assist",
    desc: "Pedal-assist motors up to 250W",
  },
  {
    icon: Leaf,
    label: "Zero Emissions",
    desc: "Clean commute, reduced carbon footprint",
  },
  {
    icon: BarChart3,
    label: "80 km Range",
    desc: "Single charge on flat terrain",
  },
];

const GRID_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const HERO_SLIDES = [
  {
    badgeIcon: Zap,
    badge:     "In-house manufactured · COD Available · Pan-India Delivery",
    headline:  ["Electric Cycles", "& Scooters."],
    accent:    "Made in Patna.",
    desc:      "We manufacture electric cycles and lithium batteries in-house. Assemble e-scooters. Supply conversion kits and 240+ accessories — retail or wholesale, delivered Pan-India.",
    cta1:      { label: "Shop Now",           href: "/shop" },
    cta2:      { label: "Get Wholesale Quote", href: "/contact" },
  },
  {
    badgeIcon: Battery,
    badge:     "In-house battery manufacturing",
    headline:  ["Batteries built", "by us."],
    accent:    "Not outsourced.",
    desc:      "We make our own lithium-ion battery packs — the safety-critical part most EV brands import or rebadge. Our cells power our cycles, scooters, and conversion kits.",
    cta1:      { label: "Browse Batteries",    href: "/shop?category=batteries" },
    cta2:      { label: "Get Wholesale Quote", href: "/contact" },
  },
  {
    badgeIcon: Settings,
    badge:     "Conversion kits · 240+ spare parts",
    headline:  ["Electrify your", "existing cycle."],
    accent:    "Simpler than you think.",
    desc:      "Our conversion kits include motor, battery, controller and all hardware. Plus 240+ genuine parts across 23 categories — Shimano, disc brakes, lights, helmets and more.",
    cta1:      { label: "Shop Conversion Kits", href: "/shop?category=conversion-kits" },
    cta2:      { label: "Browse All Parts",     href: "/shop" },
  },
];

function HeroSlider({ slides: dbSlides }) {
  // Normalise DB slides (which use headline0/headline1) into the same shape
  // as the hardcoded HERO_SLIDES so the render code is uniform.
  const slides = dbSlides && dbSlides.length > 0
    ? dbSlides.map((s) => ({
        badgeIcon: ICON_MAP[s.badgeIcon] || Zap,
        badge:     s.badge,
        headline:  [s.headline0, s.headline1],
        accent:    s.accent,
        desc:      s.description,
        cta1:      { label: s.cta1Label, href: s.cta1Href },
        cta2:      { label: s.cta2Label, href: s.cta2Href },
      }))
    : HERO_SLIDES;

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[active];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="relative z-10 flex flex-col gap-7">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-[#DDF8FD] text-[#0C7290] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#19B5D8]/15">
            <BadgeIcon size={11} />
            {slide.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4">
            {slide.headline[0]}
            <br />
            {slide.headline[1]}
            <br />
            <span className="text-[#0C7290]">{slide.accent}</span>
          </h1>

          <p className="text-neutral-500 text-[15px] leading-relaxed max-w-[460px] mb-7">
            {slide.desc}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={slide.cta1.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {slide.cta1.label} <ArrowRight size={14} />
            </Link>
            {slide.cta2?.label && slide.cta2?.href && (
              <Link
                href={slide.cta2.href}
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
              >
                {slide.cta2.label}
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-[#19B5D8]"
                : "w-2 h-2 bg-neutral-200 hover:bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const PROMO_SLIDES = [
  {
    badge: "IN-HOUSE MANUFACTURED",
    badgeIcon: Zap,
    headline: "Built by us, for you",
    sub: "Cycles, scooters & batteries",
    href: "/shop",
    cta: "Explore range",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
  },
  {
    badge: "CONVERSION KITS",
    badgeIcon: Settings,
    headline: "Electrify your cycle",
    sub: "Motor, battery, controller & more",
    href: "/shop?category=conversion-kits",
    cta: "Shop kits",
    img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=700&q=80&auto=format&fit=crop",
  },
  {
    badge: "240+ ACCESSORIES",
    badgeIcon: Package,
    headline: "Parts for every EV",
    sub: "Shimano, brakes, lights & more",
    href: "/shop",
    cta: "Browse parts",
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700&q=80&auto=format&fit=crop",
  },
];

function PromoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const slide = PROMO_SLIDES[active];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="relative bg-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between p-6 h-[150px] shrink-0">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.img}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/70 to-transparent" />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 flex flex-col h-full justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#19B5D8]/20 text-[#19B5D8] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#19B5D8]/30 mb-2">
              <BadgeIcon size={9} fill="currentColor" />
              {slide.badge}
            </span>
            <p className="text-white font-bold text-lg leading-snug">
              {slide.headline}
            </p>
            <p className="text-white/45 text-xs mt-0.5">{slide.sub}</p>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href={slide.href}
              className="inline-flex items-center gap-1 text-[#19B5D8] text-xs font-semibold hover:underline"
            >
              {slide.cta} <ArrowRight size={11} />
            </Link>

            <div className="flex items-center gap-1.5">
              {PROMO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all ${
                    i === active
                      ? "w-4 h-1.5 bg-[#19B5D8]"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Product Lines Section ─────────────────────────────────

function ProductLinesSection() {
  return (
    <section className="py-10 md:py-12 border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
          <div>
            <p className="text-[#0C7290] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              What We Make &amp; Sell
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              Five product lines.{" "}
              <span className="text-neutral-400 font-medium">One brand.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-700 hover:text-[#19B5D8] transition-colors shrink-0"
          >
            Browse all products <ArrowRight size={14} />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={GRID_VARIANTS}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {PRODUCT_LINES.map((line) => (
            <motion.div
              key={line.label}
              variants={CARD_VARIANTS}
              className="h-full"
            >
              <Link
                href={line.href}
                className={`group flex flex-col gap-4 p-5 rounded-2xl border h-full ${line.bg} ${line.border} hover:shadow-md transition-all`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/70 border ${line.border}`}
                >
                  <line.icon
                    size={18}
                    className={line.iconC}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-neutral-900 mb-1.5 leading-snug">
                    {line.label}
                  </h3>
                  <p className="text-[12px] text-neutral-600 leading-relaxed">
                    {line.desc}
                  </p>
                </div>
                <p
                  className={`text-[12px] font-semibold flex items-center gap-1 ${line.iconC} group-hover:gap-2 transition-all`}
                >
                  Explore <ArrowRight size={11} />
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── EV Showcase + Trending products side-by-side ──────────

function ShowcaseSection({ products }) {
  return (
    <section className="border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative lg:w-[52%] rounded-2xl overflow-hidden min-h-[480px] md:min-h-[560px] flex items-end"
          >
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop"
              alt="EVWheels electric range"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

            <div className="relative z-10 p-7 md:p-10 w-full">
              <p className="text-[#19B5D8] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                Our EV Range
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                Cycles. Scooters.
                <br />
                Built by us.
              </h2>
              <p className="text-sm text-white/55 leading-relaxed mb-7 max-w-sm">
                Electric cycles and scooters designed for Indian roads —
                in-house manufactured, assembled in Patna, backed by batteries
                we build ourselves.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-7">
                {EV_FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-3"
                  >
                    <Icon
                      size={16}
                      className="text-[#19B5D8] mb-2"
                      strokeWidth={1.8}
                    />
                    <p className="text-white text-[12px] font-semibold leading-tight mb-0.5">
                      {label}
                    </p>
                    <p className="text-white/40 text-[10px] leading-tight">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/shop?category=electric-cycles"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Explore EV Range <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:flex-1 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                Top Picks
              </p>
              <h3 className="text-xl font-bold text-neutral-900">
                Trending right now
              </h3>
            </div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={GRID_VARIANTS}
              className="grid grid-cols-2 gap-3 flex-1"
            >
              {products.map((p) => (
                <motion.div key={p._id} variants={CARD_VARIANTS} className="h-full">
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center justify-between">
              <p className="text-sm text-neutral-500">Electric cycles &amp; scooters</p>
              <Link
                href="/shop?category=electric-cycles"
                className="flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-[#19B5D8] transition-colors"
              >
                Browse all <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function HomeClient({ trendingProducts, heroSlides, instagramPosts }) {
  return (
    <div className="bg-white text-neutral-900">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC]">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 pt-16 md:pt-20 pb-6 md:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] gap-4 items-stretch">
            {/* Left: Main hero panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative bg-white rounded-2xl border border-neutral-100 overflow-hidden flex flex-col justify-between p-7 sm:p-9 md:p-10 min-h-[400px] md:min-h-[460px]"
            >
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-[#DDF8FD] to-white opacity-60 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-[#F0FEFF] opacity-50 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

              <HeroSlider slides={heroSlides} />

              <div className="relative z-10 flex items-center gap-8 sm:gap-12 pt-6 mt-6 border-t border-neutral-100">
                {HERO_STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-neutral-900 leading-none">
                      {s.num}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1.5 tracking-wide">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Promo card + 4 product line cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <PromoCarousel />

              <div className="grid grid-cols-2 gap-3 flex-1">
                {HERO_CATS.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className={`group rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-neutral-100 hover:shadow-sm transition-all ${cat.cardCls}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${cat.iconBg}`}
                    >
                      <cat.icon
                        size={17}
                        strokeWidth={1.9}
                        className={cat.iconC}
                      />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-neutral-900 leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">
                        {cat.sub}
                      </p>
                      <p
                        className={`text-[11px] font-medium flex items-center gap-0.5 mt-2 ${cat.linkC}`}
                      >
                        Shop now <ArrowRight size={9} />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────── */}
      <section className="bg-neutral-950 py-4 md:py-5">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:divide-x md:divide-white/8 justify-items-center">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 md:px-8 w-full"
              >
                <Icon
                  size={16}
                  className="text-[#19B5D8] shrink-0"
                  strokeWidth={1.8}
                />
                <div className="text-center md:text-left">
                  <p className="text-[12px] font-semibold text-white">
                    {label}
                  </p>
                  <p className="text-[11px] text-white/50">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Five product lines ───────────────────────────── */}
      <ProductLinesSection />

      {/* ── Popular Products ─────────────────────────────── */}
      <PopularProducts />

      {/* ── EV Showcase + trending products ─────────────── */}
      <ShowcaseSection products={trendingProducts} />

      {/* ── Featured product + Shop by Category ─────────── */}
      <FeaturedAndCategories />

      {/* ── Promotional banners ──────────────────────────── */}
      <PromoBanners />

      {/* ── Why EVWheels ─────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-md mb-12">
            <p className="text-[#0C7290] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
              Why EVWheels
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              More than a
              <br />
              parts shop.
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={GRID_VARIANTS}
            className="grid md:grid-cols-3 gap-4"
          >
            {WHY.map((item) => (
              <motion.div
                key={item.n}
                variants={CARD_VARIANTS}
                className="p-6 rounded-xl bg-white border border-neutral-100"
              >
                <p className="text-4xl font-black text-neutral-100 mb-4 select-none leading-none">
                  {item.n}
                </p>
                <h3 className="text-[15px] font-bold text-neutral-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Image + CTA ──────────────────────────────────── */}
      <section className="relative h-[65vh] md:h-[80vh] overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1621394457665-6e6d4961f686?q=80&w=1469&auto=format&fit=crop"
          alt="Electric mobility"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
              Start your EV
              <br />
              journey today.
            </h2>
            <p className="text-white/55 text-base mb-8 leading-relaxed">
              Electric cycles and scooters built in Patna. Conversion kits for
              your existing cycle. 240+ spare parts and accessories. Retail
              pricing or wholesale rates — you choose.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Explore Our Range <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/8 transition-colors"
              >
                Get Wholesale Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Instagram ────────────────────────────────────── */}
      <section className="py-10 md:py-14 bg-white border-t border-neutral-100">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center mb-8 md:mb-10">
            <a
              href="https://www.instagram.com/evwheels_patna"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EVWheels on Instagram"
              className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
              Follow our journey
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-1">
              @evwheels_patna
            </h2>
            <p className="text-sm text-neutral-500">
              EV cycles, scooters, dealer stories &amp; updates from Patna
            </p>
          </div>

          {instagramPosts && instagramPosts.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={GRID_VARIANTS}
              className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 md:gap-2"
            >
              {instagramPosts.map((post, i) => (
                <motion.a
                  key={post._id || i}
                  href={post.link || "https://www.instagram.com/evwheels_patna"}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={CARD_VARIANTS}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 block"
                  title={post.caption || ""}
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || `EVWheels post ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-neutral-400 mb-3">No posts added yet.</p>
              <a
                href="https://www.instagram.com/evwheels_patna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#19B5D8] hover:underline"
              >
                Visit @evwheels_patna on Instagram →
              </a>
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="https://www.instagram.com/evwheels_patna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Follow us on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── WhatsApp float ────────────────────────────────── */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918298922623"}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#19B5D8] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle size={22} className="text-white" />
      </a>
    </div>
  );
}
