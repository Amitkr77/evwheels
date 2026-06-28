"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Grid,
  Heart,
  List,
  SlidersHorizontal,
  IndianRupee,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useWishlistStore } from "@/store/wishlistStore";

function getSpec(specifications, key) {
  return specifications?.find((s) =>
    s.key.toLowerCase().includes(key.toLowerCase())
  )?.value;
}

export default function CyclesPage() {
  const [products, setProducts] = useState([]);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & sort states
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [priceFilter, setPriceFilter] = useState("All Prices");
  const [sortOption, setSortOption] = useState("Featured");

  const [viewMode, setViewMode] = useState("Grid");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const result = await res.json();
        setProducts(result.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== "All Types") count++;
    if (priceFilter !== "All Prices") count++;
    return count;
  }, [typeFilter, priceFilter]);

  const resetFilters = () => {
    setTypeFilter("All Types");
    setPriceFilter("All Prices");
  };

  const displayedProducts = useMemo(() => {
    let result = [...products];

    // Type filter
    if (typeFilter !== "All Types") {
      result = result.filter((p) => {
        const category = (p.category || p.type || "").toLowerCase();
        return category === typeFilter.toLowerCase();
      });
    }

    // Price filter
    if (priceFilter !== "All Prices") {
      result = result.filter((p) => {
        const price = Number(p.price) || 0;
        if (priceFilter === "Under ₹50,000") return price < 50000;
        if (priceFilter === "₹50,000 – ₹75,000")
          return price >= 50000 && price <= 75000;
        if (priceFilter === "Above ₹75,000") return price > 75000;
        return true;
      });
    }

    // Sorting
    if (sortOption === "Price: Low to High") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "Range: High to Low") {
      result.sort((a, b) => {
        const rangeA = Number(getSpec(a.specifications, "range") || 0);
        const rangeB = Number(getSpec(b.specifications, "range") || 0);
        return rangeB - rangeA;
      });
    } else if (sortOption === "Newest First") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    // Featured → original order

    return result;
  }, [products, typeFilter, priceFilter, sortOption]);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto pt-32">
        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-700 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-center text-sm text-neutral-500 mt-4 font-light">
          Preparing your ride...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] pt-24 pb-20 flex items-center justify-center">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-24 pb-20">
      <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-center mb-12 md:mb-20"
        >
          Our Cycles
        </motion.h1>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 md:gap-8 mb-10 md:mb-16">
          {/* Filters (mobile trigger + desktop inline) */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-neutral-300 rounded-full shadow-sm hover:border-emerald-600 transition md:hidden"
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm font-medium">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-light text-neutral-600">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="min-w-[150px] px-4 py-2.5 border border-neutral-300 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option>All Types</option>
                <option>City</option>
                <option>Trail / Off-road</option>
                <option>Foldable</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-sm font-light text-neutral-600">
                Price:
              </span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="min-w-[180px] px-4 py-2.5 border border-neutral-300 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option>All Prices</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 – ₹75,000</option>
                <option>Above ₹75,000</option>
              </select>
            </div>
          </div>

          {/* Sort + View */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setSortDrawerOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-neutral-300 rounded-full shadow-sm hover:border-emerald-600 transition md:hidden"
            >
              <SlidersHorizontal size={18} className="rotate-90" />
              <span className="text-sm font-medium">Sort</span>
            </button>

            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-sm font-light text-neutral-600">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="min-w-[190px] px-4 py-2.5 border border-neutral-300 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Range: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            {/* View toggle – desktop only */}
            <div className="hidden md:flex items-center border border-neutral-300 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("Grid")}
                className={`px-4 py-2.5 transition-colors ${
                  viewMode === "Grid"
                    ? "bg-neutral-900 text-white"
                    : "hover:bg-neutral-100"
                }`}
                aria-pressed={viewMode === "Grid"}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("List")}
                className={`px-4 py-2.5 transition-colors ${
                  viewMode === "List"
                    ? "bg-neutral-900 text-white"
                    : "hover:bg-neutral-100"
                }`}
                aria-pressed={viewMode === "List"}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Drawer (mobile) */}
        {filterDrawerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto md:hidden"
          >
            <div className="p-6 pb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button onClick={() => setFilterDrawerOpen(false)}>
                  <X size={28} strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-base font-medium mb-3">
                    Cycle Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full p-3.5 border border-neutral-300 rounded-2xl text-base focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                  >
                    <option>All Types</option>
                    <option>City</option>
                    <option>Trail / Off-road</option>
                    <option>Foldable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-medium mb-3">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full p-3.5 border border-neutral-300 rounded-2xl text-base focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                  >
                    <option>All Prices</option>
                    <option>Under ₹50,000</option>
                    <option>₹50,000 – ₹75,000</option>
                    <option>Above ₹75,000</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => {
                    resetFilters();
                    setFilterDrawerOpen(false);
                  }}
                  className="flex-1 py-3.5 border border-neutral-400 rounded-2xl text-base font-medium hover:bg-neutral-50 active:bg-neutral-100"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-3.5 bg-emerald-700 text-white rounded-2xl text-base font-medium hover:bg-emerald-800 active:bg-emerald-900"
                >
                  View Results
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sort Drawer (mobile) – simple version */}
        {sortDrawerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto md:hidden"
          >
            <div className="p-6 pb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Sort By</h3>
                <button onClick={() => setSortDrawerOpen(false)}>
                  <X size={28} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  "Featured",
                  "Price: Low to High",
                  "Price: High to Low",
                  "Range: High to Low",
                  "Newest First",
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setSortDrawerOpen(false);
                    }}
                    className={`py-3.5 px-5 text-left rounded-2xl border transition-colors ${
                      sortOption === opt
                        ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-medium"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {displayedProducts.length === 0 ? (
          <p className="text-center text-xl text-neutral-600 py-16">
            No cycles match the selected filters.
          </p>
        ) : (
          <div
            className={
              viewMode === "Grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                : "flex flex-col gap-10"
            }
          >
            {displayedProducts.map((product, i) => (
              <motion.div
                key={product._id || product.slug || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className={`group ${viewMode === "List" ? "flex gap-6 md:gap-10 items-center" : ""}`}
              >
                <div
                  className={`overflow-hidden bg-neutral-100 relative ${
                    viewMode === "Grid"
                      ? "aspect-[4/3] mb-5"
                      : "w-44 md:w-64 h-32 md:h-48 flex-shrink-0"
                  }`}
                >
                  <img
                    src={product.images?.[0] || "/logo.png"}
                    alt={product.title || "Cycle"}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      viewMode === "List" ? "object-contain p-3" : ""
                    }`}
                    onError={(e) => {
                      e.currentTarget.src = "/logo.png";
                    }}
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product); // ← assuming your store accepts full product object
                    }}
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/70 backdrop-blur-md hover:bg-white/90 transition-all shadow-sm"
                    aria-label={
                      isInWishlist(product._id || product.slug)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={20}
                      className={`transition-colors ${
                        isInWishlist(product._id || product.slug)
                          ? "fill-red-500 text-red-500"
                          : "text-neutral-600 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                <div className={viewMode === "List" ? "flex-1" : ""}>
                  <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium mb-2">
                    {product.title}
                  </h3>

                  <div className="text-xl font-light text-emerald-800 mb-4">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </div>

                  <div className="text-sm text-neutral-600 font-light space-y-1 mb-5">
                    <p>Range: {getSpec(product.specifications, "range") ?? "—"} km</p>
                    <p>Weight: {getSpec(product.specifications, "weight") ?? "—"} kg</p>
                  </div>

                  <Link
                    href={product.slug ? `/cycles/${product.slug}` : "#"}
                    className="inline-flex items-center gap-2 text-neutral-900 font-medium hover:text-emerald-800 transition-colors"
                  >
                    View Details
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
