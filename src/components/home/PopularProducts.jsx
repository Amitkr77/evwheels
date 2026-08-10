"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Sparkles, Star } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import Carousel from "@/components/shop/Carousel";

const TABS = [
  { key: "best-sellers", label: "Best Sellers", icon: TrendingUp },
  { key: "new-arrivals", label: "New Arrivals", icon: Sparkles },
  { key: "top-rated", label: "Top Rated", icon: Star },
];

function SkeletonCard() {
  return (
    <div className="w-[72vw] sm:w-[265px] rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-neutral-100" />
      <div className="p-5 space-y-2.5">
        <div className="h-3 bg-neutral-100 rounded-full w-full" />
        <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
        <div className="h-4 bg-neutral-100 rounded-full w-1/2 mt-1" />
      </div>
    </div>
  );
}

export default function PopularProducts() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [productsByTab, setProductsByTab] = useState({});
  const [loading, setLoading] = useState(true);
  const cache = useRef({});

  useEffect(() => {
    // Cache each tab's fetch so switching back and forth doesn't re-hit the
    // network — the admin-curated lists don't change mid-visit.
    if (cache.current[activeTab]) {
      setProductsByTab((prev) => ({ ...prev, [activeTab]: cache.current[activeTab] }));
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/showcase?type=${activeTab}&limit=12`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const products = d.products || [];
        cache.current[activeTab] = products;
        setProductsByTab((prev) => ({ ...prev, [activeTab]: products }));
      })
      .catch(() => {
        if (!cancelled) setProductsByTab((prev) => ({ ...prev, [activeTab]: [] }));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const products = productsByTab[activeTab] || [];

  return (
    <section className="py-10 md:py-12 bg-white border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <p className="text-[#0C7290] text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
              Popular Products
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
              What everyone&rsquo;s buying
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tabs — segmented card on mobile, pills on desktop */}

        {/* Mobile: full-width card segmented control */}
        <div className="sm:hidden grid grid-cols-3 bg-neutral-100 rounded-2xl p-1 gap-1 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-white shadow-sm" : ""
                }`}
              >
                <tab.icon
                  size={15}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={isActive ? "text-[#19B5D8]" : "text-neutral-400"}
                />
                <span className={`text-[10.5px] font-semibold leading-tight text-center ${
                  isActive ? "text-neutral-900" : "text-neutral-400"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop: pill tabs */}
        <div className="hidden sm:flex items-center gap-2 mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading && products.length === 0 ? (
          <div className="flex gap-3 md:gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-neutral-400 text-sm py-12 text-center border border-dashed border-neutral-200 rounded-xl">
            No products here yet.
          </p>
        ) : (
          <Carousel itemClassName="w-[72vw] sm:w-[265px]">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </Carousel>
        )}

        <div className="mt-6 sm:hidden text-center">
          <Link href="/shop" className="text-sm font-medium text-[#0C7290]">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
