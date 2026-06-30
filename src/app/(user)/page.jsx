"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import ShopByCategory from "@/components/home/ShopBycategory";

const TRUST = [
  { icon: Truck, label: "Free Delivery", sub: "Orders above ₹5,000" },
  { icon: ShieldCheck, label: "Genuine Products", sub: "100% authentic" },
  { icon: Package, label: "240+ Products", sub: "Across 23 categories" },
  { icon: MapPin, label: "Bihar & Jharkhand", sub: "Pan-state delivery" },
];

const HERO_STATS = [
  { num: "240+", label: "Products" },
  { num: "23", label: "Categories" },
  { num: "500+", label: "Dealers served" },
];

const WHY = [
  {
    n: "01",
    title: "Wholesale Pricing",
    desc: "Direct-from-source pricing. No middlemen, no markups — honest wholesale rates for dealers across Bihar.",
  },
  {
    n: "02",
    title: "Bulk Ready",
    desc: "MOQ-based ordering across 240+ SKUs. Bells to hydraulic disc brakes — everything stocked and dispatch-ready.",
  },
  {
    n: "03",
    title: "Local Support",
    desc: "Based in Patna, serving Bihar & Jharkhand. Same-day response, real people, real accountability.",
  },
];

const EV_FEATURES = [
  { icon: Zap, label: "Electric Assist", desc: "Pedal-assist motors up to 250W" },
  { icon: Leaf, label: "Zero Emissions", desc: "Clean commute, reduced carbon footprint" },
  { icon: BarChart3, label: "80km Range", desc: "Single charge on flat terrain" },
];

// ── Clean product card ─────────────────────────────────────
function ProductCard({ p }) {
  return (
    <Link
      href={`/shop/${p.slug}`}
      className="group flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200"
    >
      {/* Image area */}
      <div className="relative bg-neutral-50 p-4 aspect-square overflow-hidden">
        {p.images?.[0] ? (
          <img
            src={p.images[0]}
            alt={p.title}
            className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-neutral-100 select-none uppercase">
              {p.title?.charAt(0)}
            </span>
          </div>
        )}
        {(p.moq || 1) > 1 && (
          <span className="absolute top-2.5 right-2.5 bg-neutral-900 text-white text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-md">
            MOQ {p.moq}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="px-3.5 pb-3.5 pt-3 flex flex-col gap-1.5">
        <h3 className="text-[13px] font-medium text-neutral-800 line-clamp-2 leading-snug">
          {p.title}
        </h3>
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-sm font-bold text-neutral-900">
            ₹{Number(p.price).toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-neutral-400 group-hover:text-[#19B5D8] transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton card ──────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100 p-4" />
      <div className="px-3.5 pb-3.5 pt-3 space-y-2">
        <div className="h-3 bg-neutral-100 rounded w-full" />
        <div className="h-3 bg-neutral-100 rounded w-2/3" />
        <div className="h-3 bg-neutral-100 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ── Featured Products ──────────────────────────────────────
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=8&sort=createdAt&order=desc")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 md:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[#19B5D8] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              New Arrivals
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <ProductCard p={p} />
                </motion.div>
              ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link href="/shop" className="text-sm font-medium text-[#19B5D8]">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── EV Showcase + Product cards side-by-side ──────────────
function ShowcaseSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4&sort=createdAt&order=desc")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch">

          {/* Left — big image + content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative lg:w-[52%] rounded-2xl overflow-hidden min-h-[480px] md:min-h-[560px] flex items-end"
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop"
              alt="EV Cycle"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

            <div className="relative z-10 p-7 md:p-10 w-full">
              <p className="text-[#19B5D8] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                EV Cycle Range
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                The future of
                <br />two-wheeled travel.
              </h2>
              <p className="text-sm text-white/55 leading-relaxed mb-7 max-w-sm">
                Our electric cycle range blends lightweight aluminium frames with
                reliable pedal-assist motors — built for daily commutes, last-mile
                delivery, and everything in between.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-7">
                {EV_FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <Icon size={16} className="text-[#19B5D8] mb-2" strokeWidth={1.8} />
                    <p className="text-white text-[12px] font-semibold leading-tight mb-0.5">{label}</p>
                    <p className="text-white/40 text-[10px] leading-tight">{desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Explore EV Cycles <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Right — product cards grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:flex-1 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                Top Picks
              </p>
              <h3 className="text-xl font-bold text-neutral-900">Trending right now</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                    >
                      <ProductCard p={p} />
                    </motion.div>
                  ))}
            </div>

            <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center justify-between">
              <p className="text-sm text-neutral-400">240+ products in stock</p>
              <Link
                href="/shop"
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
export default function Home() {
  return (
    <div className="bg-white text-neutral-900">

      {/* Hero */}
      <section className="relative min-h-screen flex items-end pb-16 md:pb-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1621577239950-449fb208e624?q=80&w=1469&auto=format&fit=crop"
            alt="Cycling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="text-[#19B5D8] text-[11px] font-semibold tracking-[0.25em] uppercase mb-5">
              Bihar's Leading Wholesaler
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.0] tracking-tight mb-6">
              Cycle Parts.
              <br />
              <span className="text-white/55">Wholesale</span>{" "}
              <span className="text-white">Price.</span>
            </h1>
            <p className="text-base md:text-lg text-white/55 max-w-lg mb-10 leading-relaxed">
              240+ accessories across 23 categories — Shimano, disc brakes,
              lights, helmets & more. Serving dealers across Bihar & Jharkhand.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Browse Catalogue <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/8 transition-colors"
              >
                Get Wholesale Pricing
              </Link>
            </div>

            <div className="flex items-center gap-10 pt-8 border-t border-white/12">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-bold text-white">{s.num}</p>
                  <p className="text-[11px] text-white/35 mt-0.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-neutral-950 py-4 md:py-5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:divide-x md:divide-white/8">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 md:px-8 first:pl-0 last:pr-0">
                <Icon size={16} className="text-[#19B5D8] shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="text-[12px] font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-white/35">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* EV Showcase + product cards */}
      <ShowcaseSection />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Why EVWheels */}
      <section className="py-20 md:py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-md mb-12">
            <p className="text-[#19B5D8] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
              Why EVWheels
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              Built for dealers,
              <br />not casual buyers.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {WHY.map((item, i) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white border border-neutral-100"
              >
                <p className="text-4xl font-black text-neutral-100 mb-4 select-none leading-none">
                  {item.n}
                </p>
                <h3 className="text-[15px] font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image + CTA */}
      <section className="relative h-[65vh] md:h-[80vh] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1621394457665-6e6d4961f686?q=80&w=1469&auto=format&fit=crop"
          alt="Cycling"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
              Start ordering
              <br />today.
            </h2>
            <p className="text-white/55 text-base mb-8 leading-relaxed">
              Create an account and access wholesale rates on 240+ cycle accessories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
              >
                Browse Catalogue <ArrowRight size={14} />
              </Link>
              <Link
                href="/account/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/8 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Instagram ── */}
      <section className="py-16 md:py-20 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-10">
            {/* Instagram gradient icon */}
            <a
              href="https://www.instagram.com/evwheels_patna"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
              }}
            >
              {/* Instagram SVG */}
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-1">
              Follow our journey
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight mb-1">
              @evwheels_patna
            </h2>
            <p className="text-sm text-neutral-400">Cycle parts, dealer stories & daily updates from Patna</p>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 md:gap-2">
            {[
              {
                src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
                alt: "Cycle accessories",
              },
              {
                src: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80&auto=format&fit=crop",
                alt: "Cycling road",
              },
              {
                src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80&auto=format&fit=crop",
                alt: "Cyclist outdoors",
              },
              {
                src: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80&auto=format&fit=crop",
                alt: "Mountain biking",
              },
              {
                src: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600&q=80&auto=format&fit=crop",
                alt: "Cycling gear",
              },
              {
                src: "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80&auto=format&fit=crop",
                alt: "Cycle parts",
              },
            ].map((post, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/evwheels_patna"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 block"
              >
                <img
                  src={post.src}
                  alt={post.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <a
              href="https://www.instagram.com/evwheels_patna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
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

      {/* WhatsApp float */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
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
