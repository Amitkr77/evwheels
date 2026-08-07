"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Star,
  TrendingUp,
  Sparkles,
  Loader2,
  Package,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";

const TABS = [
  { key: "best-sellers", label: "Best Sellers", icon: TrendingUp },
  { key: "new-arrivals", label: "New Arrivals", icon: Sparkles },
  { key: "top-rated", label: "Top Rated", icon: Star },
];

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// Shared product-search box — used for both the featured-product picker and
// each showcase tab's "add a product" row.
function ProductSearchBox({ placeholder, exclude = [], onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query.trim())}&limit=8&admin=true`,
          { credentials: "include" }
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const excludeIds = new Set(exclude);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-5 py-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
        />
        {searching && (
          <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 animate-spin" />
        )}
      </div>

      {query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-neutral-200 rounded-xl shadow-lg z-20 max-h-72 overflow-y-auto">
          {results.length === 0 && !searching ? (
            <p className="px-4 py-4 text-sm text-neutral-400 text-center">No products found</p>
          ) : (
            results.map((p) => {
              const already = excludeIds.has(p._id);
              return (
                <button
                  key={p._id}
                  type="button"
                  disabled={already}
                  onClick={() => {
                    onPick(p);
                    setQuery("");
                    setResults([]);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 shrink-0 overflow-hidden flex items-center justify-center text-neutral-400 text-xs">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={14} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">{p.title}</p>
                    <p className="text-xs text-neutral-500">{fmt(p.price)}</p>
                  </div>
                  {already && <span className="text-[10px] text-neutral-400 shrink-0">Already added</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function ShowcasePage() {
  const showToast = useToast();

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [showcase, setShowcase] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [savingFeatured, setSavingFeatured] = useState(false);

  const fetchShowcase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/showcase", { credentials: "include" });
      const data = await res.json();
      setShowcase(data.showcase || {});
    } catch (err) {
      console.error(err);
      showToast("Failed to load showcase lists.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    setLoadingFeatured(true);
    try {
      const res = await fetch("/api/admin/homepage-settings", { credentials: "include" });
      const data = await res.json();
      setFeaturedProduct(data.settings?.featuredProduct || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeatured(false);
    }
  };

  useEffect(() => {
    fetchShowcase();
    fetchFeatured();
  }, []);

  const currentItems = showcase[activeTab] || [];

  const saveList = async (type, items) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/showcase?type=${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: items.map((p) => ({ product: p._id })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes: " + err.message, "error");
      fetchShowcase(); // revert to last known-good state
    } finally {
      setSaving(false);
    }
  };

  const addProduct = (product) => {
    if (currentItems.some((p) => p._id === product._id)) return;
    const next = [...currentItems, product];
    setShowcase((prev) => ({ ...prev, [activeTab]: next }));
    saveList(activeTab, next);
  };

  const removeProduct = (productId) => {
    const next = currentItems.filter((p) => p._id !== productId);
    setShowcase((prev) => ({ ...prev, [activeTab]: next }));
    saveList(activeTab, next);
  };

  const moveProduct = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= currentItems.length) return;
    const next = [...currentItems];
    [next[index], next[target]] = [next[target], next[index]];
    setShowcase((prev) => ({ ...prev, [activeTab]: next }));
    saveList(activeTab, next);
  };

  const setFeatured = async (product) => {
    setSavingFeatured(true);
    try {
      const res = await fetch("/api/admin/homepage-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ featuredProduct: product?._id || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setFeaturedProduct(data.settings?.featuredProduct || null);
      showToast(product ? "Featured product updated!" : "Featured product cleared.");
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setSavingFeatured(false);
    }
  };

  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-medium">Homepage Showcase</h1>
          <p className="text-neutral-500 text-sm mt-2">
            Curate what appears in the landing page&rsquo;s featured product card and Popular Products carousel. Changes go live immediately.
          </p>
        </div>

        {/* ─── Featured / Trending Product ─── */}
        <div className="bg-white border border-neutral-200/70 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-xl font-medium mb-1">Trending / Featured Product</h2>
          <p className="text-sm text-neutral-500 mb-5">
            The single product highlighted above the categories section.
          </p>

          {loadingFeatured ? (
            <div className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
          ) : (
            <div className="space-y-4">
              {featuredProduct && (
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="w-12 h-12 rounded-lg bg-white shrink-0 overflow-hidden flex items-center justify-center text-neutral-400">
                    {featuredProduct.images?.[0] ? (
                      <img src={featuredProduct.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{featuredProduct.title}</p>
                    <p className="text-sm text-neutral-500">{fmt(featuredProduct.price)}</p>
                  </div>
                  <button
                    onClick={() => setFeatured(null)}
                    disabled={savingFeatured}
                    className="text-sm text-red-500 hover:text-red-700 font-medium shrink-0 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              )}

              <ProductSearchBox
                placeholder={featuredProduct ? "Search to replace the featured product…" : "Search for a product to feature…"}
                exclude={featuredProduct ? [featuredProduct._id] : []}
                onPick={setFeatured}
              />
              {!featuredProduct && (
                <p className="text-xs text-neutral-400">
                  Nothing selected — the landing page will fall back to a featured/newest product automatically.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─── Showcase tabs ─── */}
        <div className="bg-white border border-neutral-200/70 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-1 p-2 border-b border-neutral-100 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = (showcase[tab.key] || []).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive ? "bg-[#19B5D8] text-white" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-neutral-500">
                Products shown on the landing page&rsquo;s <strong>{TABS.find((t) => t.key === activeTab)?.label}</strong> tab, in this order.
              </p>
              {saving && (
                <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Loader2 size={12} className="animate-spin" /> Saving…
                </span>
              )}
            </div>

            <div className="mb-6">
              <ProductSearchBox
                placeholder="Search products to add…"
                exclude={currentItems.map((p) => p._id)}
                onPick={addProduct}
              />
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />)}
              </div>
            ) : currentItems.length === 0 ? (
              <div className="py-14 text-center text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-xl">
                No products curated yet — the landing page will show an automatic fallback list until you add some here.
              </div>
            ) : (
              <div className="space-y-2">
                {currentItems.map((p, i) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100"
                  >
                    <div className="flex flex-col shrink-0">
                      <button
                        onClick={() => moveProduct(i, -1)}
                        disabled={i === 0}
                        aria-label="Move up"
                        className="p-0.5 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveProduct(i, 1)}
                        disabled={i === currentItems.length - 1}
                        aria-label="Move down"
                        className="p-0.5 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <span className="w-5 text-center text-xs font-medium text-neutral-400 shrink-0">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-white shrink-0 overflow-hidden flex items-center justify-center text-neutral-400">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{p.title}</p>
                      <p className="text-xs text-neutral-500">{fmt(p.price)}</p>
                    </div>
                    <button
                      onClick={() => removeProduct(p._id)}
                      aria-label={`Remove ${p.title}`}
                      className="text-neutral-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
