"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function CyclesPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & sort states
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [priceFilter, setPriceFilter] = useState("All Prices");
  const [sortOption, setSortOption] = useState("Featured");

  const [viewMode, setViewMode] = useState("Grid");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const result = await res.json();
        const fetched = result.products || [];
        setProducts(fetched);
        setFilteredProducts(fetched); // initial display = all
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Combined filtering + sorting logic → memoized
  const displayedProducts = useMemo(() => {
    let result = [...products];

    // 1. Type filter
    if (typeFilter !== "All Types") {
      result = result.filter((p) => {
        const category = p.category || p.type || ""; // adjust field name as per your data
        return category.toLowerCase() === typeFilter.toLowerCase();
      });
    }

    // 2. Price filter
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

    // 3. Sorting
    if (sortOption === "Price: Low to High") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "Range: High to Low") {
      result.sort((a, b) => {
        const rangeA = Number(a.specs?.battery?.range || 0);
        const rangeB = Number(b.specs?.battery?.range || 0);
        return rangeB - rangeA;
      });
    } else if (sortOption === "Newest First") {
      // Assuming you have a createdAt / date field (ISO string or timestamp)
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    }
    // "Featured" → we keep original order (or you can add featured logic later)

    return result;
  }, [products, typeFilter, priceFilter, sortOption]);

  // Sync filteredProducts when dependencies change (optional – can use displayedProducts directly)
  useEffect(() => {
    setFilteredProducts(displayedProducts);
  }, [displayedProducts]);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-800 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <p className="text-center text-sm text-neutral-500 mt-3 font-light">
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-center mb-16 md:mb-24"
        >
          Our Cycles
        </motion.h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 md:mb-16">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Filter by:
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white"
              >
                <option>All Types</option>
                <option>City</option>
                <option>Trail / Off-road</option>
                <option>Foldable</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Price:
              </span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white"
              >
                <option>All Prices</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 – ₹75,000</option>
                <option>Above ₹75,000</option>
              </select>
            </div>
          </div>

          {/* Sort + View */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Sort by:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Range: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border border-neutral-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("Grid")}
                className={`px-4 py-2.5 text-sm md:text-base font-medium transition-colors ${
                  viewMode === "Grid"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("List")}
                className={`px-4 py-2.5 text-sm md:text-base transition-colors ${
                  viewMode === "List"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <p className="text-center text-xl text-neutral-600">
            No cycles match the selected filters.
          </p>
        ) : (
          <div
            className={
              viewMode === "Grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16"
                : "flex flex-col gap-10"
            }
          >
            {displayedProducts.map((product, i) => (
              <motion.div
                key={product._id || product.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1 }}
                className={`group ${viewMode === "List" ? "flex gap-8 items-center" : ""}`}
              >
                <div
                  className={`overflow-hidden bg-neutral-100 ${
                    viewMode === "Grid"
                      ? "aspect-[4/3] mb-6"
                      : "w-48 md:w-64 h-36 md:h-48 flex-shrink-0"
                  }`}
                >
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/800x600?text=No+Image"
                    }
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      viewMode === "List" ? "object-contain" : ""
                    }`}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x600?text=Image+Error";
                    }}
                  />
                </div>

                <div className={viewMode === "List" ? "flex-1" : ""}>
                  <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium mb-3">
                    {product.title}
                  </h3>

                  <div className="text-xl font-light text-emerald-800 mb-4">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </div>

                  <div className="text-sm text-neutral-600 font-light space-y-1 mb-6">
                    <p>Range: {product.specs?.battery?.range || "N/A"} km</p>
                    <p>Weight: {product.specs?.physical?.weight || "N/A"} kg</p>
                  </div>

                  <Link
                    href={`/shop/${product.slug}` || "#"}
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
