"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { analytics } from "@/lib/analytics";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "@/components/shop/ProductCard";

const PAGE_SIZE = 24;

// Maps the UI's sort labels to the /api/products query params. "featured"
// is intentionally omitted — during a search, no explicit sort means the
// API falls back to relevance ranking (see src/app/api/products/route.js).
const SORT_TO_API = {
  newest: { sort: "createdAt", order: "desc" },
  price_asc: { sort: "price", order: "asc" },
  price_desc: { sort: "price", order: "desc" },
};

const ALL_PRODUCTS_ENTRY = { slug: "", label: "All Products" };

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-100" />
      <div className="px-3.5 pb-3.5 pt-3 space-y-2">
        <div className="h-3 bg-neutral-100 rounded w-full" />
        <div className="h-3 bg-neutral-100 rounded w-2/3" />
        <div className="h-3 bg-neutral-100 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ── Sidebar category list ──────────────────────────────────
function CategoryList({ active, onChange, categories }) {
  return (
    <div className="flex flex-col gap-0.5">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
            active === cat.slug
              ? "bg-neutral-900 text-white font-medium"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          {cat.label}
          {active === cat.slug && <ChevronRight size={13} />}
        </button>
      ))}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const pages = [];
  const delta = 1; // neighbours around current
  const left = page - delta;
  const right = page + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    } else if (i === left - 1 || i === right + 1) {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12 pb-2">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={15} /> Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-neutral-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ── Inner page (needs Suspense for useSearchParams) ────────
function ShopInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState("All Prices");
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [serverPagination, setServerPagination] = useState({ total: 0, pages: 1 });

  // Real categories from the DB, not a hardcoded list — this was silently
  // drifting out of sync with whatever admin actually has configured.
  const [categories, setCategories] = useState([ALL_PRODUCTS_ENTRY]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const real = (d.categories || []).map((c) => ({ slug: c.slug, label: c.name }));
        setCategories([ALL_PRODUCTS_ENTRY, ...real]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Read category from URL
  const urlCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(urlCategory);

  // Read subcategory from URL — only reachable today via a product's
  // breadcrumb link (no sidebar UI for it), so it's an ID (matching what
  // /api/products?subcategory= expects), not a slug.
  const urlSubcategory = searchParams.get("subcategory") || "";
  const [subcategory, setSubcategory] = useState(urlSubcategory);

  // Read search from URL — this is what makes the homepage hero search
  // (which does router.push('/shop?search=...')) actually land with results,
  // instead of the param being silently dropped.
  const urlSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search, 400);
  const isSearching = Boolean(debouncedSearch.trim());

  // Sync URL → state on navigation (covers browser back/forward too)
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setSubcategory(searchParams.get("subcategory") || "");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Update URL when category changes — picking a top-level category from the
  // sidebar also clears any subcategory drill-down, since it may not belong
  // to the newly-selected category.
  const handleCategoryChange = useCallback((slug) => {
    setCategory(slug);
    setSubcategory("");
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("subcategory");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Push the debounced search term into the URL so it's shareable/bookmarkable
  // and stays consistent with the homepage's own search hand-off.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    const next = params.toString();
    if (next !== searchParams.toString()) {
      router.push(`/shop${next ? `?${next}` : ""}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Default browse (no active search) — fetches up to 200 products for the
  // current category; price/sort/pagination are derived client-side below.
  // Unchanged from before, just skipped while a search is active.
  useEffect(() => {
    if (isSearching) return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    params.set("limit", "200");
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setProducts(d.products || []);
        const cat = categories.find((c) => c.slug === category) || ALL_PRODUCTS_ENTRY;
        analytics.track("Category Viewed", {
          category_id: cat.slug || "all",
          category_name: cat.label,
        });
      })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // categories is intentionally omitted — it only affects the analytics
    // label below, not the fetch itself, and including it would refire this
    // whole product fetch a second time once the category list arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subcategory, isSearching]);

  // Active search — real backend full-text search (title/description/brand),
  // relevance-ranked by default, combined with category/price/sort, and
  // properly server-paginated (search results can't be reasonably handled
  // by fetching a fixed batch and filtering client-side).
  useEffect(() => {
    const term = debouncedSearch.trim();
    if (!term) return;

    let cancelled = false;
    setLoading(true);
    const priceObj = PRICE_RANGES.find((p) => p.label === priceRange) || PRICE_RANGES[0];
    const params = new URLSearchParams();
    params.set("search", term);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (priceObj.min > 0) params.set("minPrice", String(priceObj.min));
    if (priceObj.max !== Infinity) params.set("maxPrice", String(priceObj.max));
    const sortApi = SORT_TO_API[sort];
    if (sortApi) {
      params.set("sort", sortApi.sort);
      params.set("order", sortApi.order);
    }
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setProducts(d.products || []);
        setServerPagination({
          total: d.pagination?.total || 0,
          pages: d.pagination?.pages || 1,
        });
        analytics.track("Search Performed", {
          query: term,
          number_of_results: d.pagination?.total ?? (d.products || []).length,
          filters: { category: category || null },
          sort,
          page,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
        setServerPagination({ total: 0, pages: 1 });
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedSearch, category, subcategory, priceRange, sort, page]);

  const activeCat = categories.find((c) => c.slug === category) || ALL_PRODUCTS_ENTRY;

  const displayed = useMemo(() => {
    if (isSearching) return products; // already filtered/sorted server-side
    const priceObj = PRICE_RANGES.find((p) => p.label === priceRange) || PRICE_RANGES[0];
    let r = products.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= priceObj.min && price <= priceObj.max;
    });
    if (sort === "newest") r = [...r].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "price_asc") r = [...r].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price_desc") r = [...r].sort((a, b) => Number(b.price) - Number(a.price));
    return r;
  }, [products, priceRange, sort, isSearching]);

  const activeFilterCount =
    (category ? 1 : 0) + (priceRange !== "All Prices" ? 1 : 0) + (search ? 1 : 0);

  // Reset to page 1 whenever filters/search/category/sort change
  useEffect(() => { setPage(1); }, [category, subcategory, priceRange, debouncedSearch, sort]);

  const totalPages = isSearching ? serverPagination.pages : Math.ceil(displayed.length / PAGE_SIZE);
  const paginated = isSearching ? products : displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resultsCount = isSearching ? serverPagination.total : displayed.length;

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white pt-[100px] pb-20">

      {/* ── Page header ── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-[#19B5D8] uppercase tracking-[0.2em] mb-1">
                Catalogue
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
                {activeCat.label}
              </h1>
            </div>
            {/* Search — desktop */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50 w-64 focus-within:border-[#19B5D8] focus-within:bg-white transition-colors">
              <Search size={14} className="text-neutral-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-sm outline-none text-neutral-700 placeholder:text-neutral-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400">
            <Link href="/" className="hover:text-neutral-600 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link href="/shop" className="hover:text-neutral-600 transition-colors">Shop</Link>
            {category && (
              <>
                <ChevronRight size={11} />
                <span className="text-neutral-600">{activeCat.label}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 mt-8">
        <div className="flex gap-8 lg:gap-12">

          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:flex flex-col gap-7 w-52 shrink-0">

            {/* Categories */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3 px-1">
                Categories
              </p>
              <CategoryList active={category} onChange={handleCategoryChange} categories={categories} />
            </div>

            {/* Price */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3 px-1">
                Price Range
              </p>
              <div className="flex flex-col gap-0.5">
                {PRICE_RANGES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPriceRange(p.label)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      priceRange === p.label
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3 px-1">
                Sort By
              </p>
              <div className="flex flex-col gap-0.5">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSort(o.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      sort === o.value
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(category || priceRange !== "All Prices" || search) && (
              <button
                onClick={() => { handleCategoryChange(""); setPriceRange("All Prices"); setSearch(""); }}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-3 transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile toolbar */}
            <div className="flex lg:hidden items-center gap-2 mb-5">
              {/* Search */}
              <div className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50">
                <Search size={13} className="text-neutral-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none text-neutral-700 placeholder:text-neutral-400"
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear search">
                    <X size={12} className="text-neutral-400" />
                  </button>
                )}
              </div>
              {/* Filter button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 bg-white"
              >
                <SlidersHorizontal size={14} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Result count + active sort (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-400">
                {loading ? "Loading…" : `${resultsCount} product${resultsCount !== 1 ? "s" : ""}${totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm text-neutral-700 border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#19B5D8] transition-colors"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile result count */}
            <p className="lg:hidden text-xs text-neutral-400 mb-4">
              {!loading && `${resultsCount} products${totalPages > 1 ? ` · page ${page}/${totalPages}` : ""}`}
            </p>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5">
                  <Search size={24} className="text-neutral-300" />
                </div>
                <p className="text-neutral-900 font-semibold mb-1">No products found</p>
                <p className="text-sm text-neutral-400 mb-6">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { handleCategoryChange(""); setPriceRange("All Prices"); setSearch(""); }}
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {paginated.map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto lg:hidden"
            >
              <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <h3 className="font-semibold text-neutral-900">Filters</h3>
                <button onClick={() => setDrawerOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                  <X size={20} />
                </button>
              </div>

              <div className="px-5 py-5 space-y-7">

                {/* Category */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                    Category
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => { handleCategoryChange(cat.slug); setDrawerOpen(false); }}
                        className={`py-2.5 px-3 rounded-xl text-sm text-left transition-colors border ${
                          category === cat.slug
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                    Price Range
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {PRICE_RANGES.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setPriceRange(p.label)}
                        className={`py-3 px-4 rounded-xl text-sm text-left border transition-colors ${
                          priceRange === p.label
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                    Sort By
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => setSort(o.value)}
                        className={`py-3 px-4 rounded-xl text-sm text-left border transition-colors ${
                          sort === o.value
                            ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                            : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-8 pt-2 flex gap-3">
                <button
                  onClick={() => { handleCategoryChange(""); setPriceRange("All Prices"); setSort("featured"); }}
                  className="flex-1 py-3.5 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Reset all
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 py-3.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  View {!loading && `${resultsCount} `}products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Suspense wrapper required by Next.js for useSearchParams
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-[100px] flex items-center justify-center">
        <div className="h-1 w-48 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#19B5D8] rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    }>
      <ShopInner />
    </Suspense>
  );
}
