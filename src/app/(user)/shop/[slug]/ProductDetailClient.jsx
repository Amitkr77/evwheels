"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  ChevronDown,
  Star,
  RefreshCcw,
  Phone,
  ShoppingBag,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics";
import ProductCard from "@/components/shop/ProductCard";
import PincodeChecker from "@/components/shop/PincodeChecker";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-neutral-200 fill-neutral-200"
          }
        />
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full py-4 text-left gap-4"
      >
        <span className="text-[14px] font-semibold text-neutral-900 leading-snug">{q}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13.5px] text-neutral-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className="mb-8">
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C7290] mb-2">
          {label}
        </p>
      )}
      <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h2>
    </div>
  );
}

const TRUST = [
  { icon: Truck,       text: "Free delivery above ₹5,000"   },
  { icon: ShieldCheck, text: "100% genuine products"         },
  { icon: RefreshCcw,  text: "7-day hassle-free returns"     },
  { icon: Phone,       text: "WhatsApp support available"    },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function ProductDetailClient() {
  const { slug } = useParams();
  const router    = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product,           setProduct]           = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [selectedImage,     setSelectedImage]     = useState(0);
  const [reviews,           setReviews]           = useState([]);
  const [loadingReviews,    setLoadingReviews]    = useState(true);
  const [recommended,       setRecommended]       = useState([]);
  const [loadingRecommended,setLoadingRecommended]= useState(true);

  // ── Fetch product ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => { if (!cancelled) { setProduct(d.product); setSelectedImage(0); } })
      .catch(() => { if (!cancelled) setProduct(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  // ── Analytics ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!product?._id) return;
    analytics.track("Product Viewed", {
      product_id:   product._id,
      slug:         product.slug,
      product_name: product.title,
      category:     product.category?.name,
      brand:        product.brand,
      price:        product.price,
      currency:     "INR",
    });
  }, [product?._id]);

  // ── Fetch reviews ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!product?._id) return;
    let cancelled = false;
    setLoadingReviews(true);
    setReviews([]);
    fetch(`/api/reviews?id=${product._id}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setReviews(Array.isArray(d) ? d : []); })
      .catch(() => { if (!cancelled) setReviews([]); })
      .finally(() => { if (!cancelled) setLoadingReviews(false); });
    return () => { cancelled = true; };
  }, [product?._id]);

  // ── Fetch recommended ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!product?._id) return;
    let cancelled = false;
    setLoadingRecommended(true);
    const url = product.category?.slug
      ? `/api/products?category=${encodeURIComponent(product.category.slug)}&limit=9`
      : "/api/products?sort=createdAt&order=desc&limit=9";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled)
          setRecommended((d.products || []).filter((p) => p._id !== product._id).slice(0, 8));
      })
      .catch(() => { if (!cancelled) setRecommended([]); })
      .finally(() => { if (!cancelled) setLoadingRecommended(false); });
    return () => { cancelled = true; };
  }, [product?._id, product?.category?.slug]);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm">Loading product…</p>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  // ── Derived values ─────────────────────────────────────────────────────────
  const inStock    = product.stock > 0;
  const moq        = product.moq || 1;
  const price      = `₹${Number(product.price).toLocaleString("en-IN")}`;
  const avgRating  = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const getSpec = (key) =>
    product.specifications?.find((s) => s.key.toLowerCase().includes(key.toLowerCase()))?.value;

  const handleBuyNow = () =>
    router.push(`/checkout?buyNow=${product._id}&qty=${moq}`);

  // Key highlights shown as pills in the hero
  const highlights = [
    getSpec("range")   && { label: "Range",    value: `${getSpec("range")} km`   },
    getSpec("weight")  && { label: "Weight",   value: `${getSpec("weight")} kg`  },
    getSpec("motor")   && { label: "Motor",    value: getSpec("motor")            },
    getSpec("battery") && { label: "Battery",  value: getSpec("battery")          },
    product.colors?.length > 0 && { label: "Colors", value: product.colors.join(", ") },
    product.warranty > 0 && { label: "Warranty", value: `${product.warranty} mo` },
  ].filter(Boolean);

  const FAQ_ITEMS = [
    {
      q: "What does this product include?",
      a: "This product includes everything shown in the product images and described in the specifications. Contact us on WhatsApp if you need clarification on what's in the box.",
    },
    product.warranty > 0 && {
      q: "What is the warranty on this product?",
      a: `This product carries a ${product.warranty}-month manufacturer warranty covering defects in materials and workmanship under normal use. Damage due to misuse, accidents, or unauthorised modifications is not covered.`,
    },
    {
      q: "How long does delivery take?",
      a: "Delivery typically takes 3–7 business days depending on your pincode. Enter your pincode in the delivery checker above to see the estimated date for your location.",
    },
    {
      q: "Can I return or exchange this product?",
      a: "We accept returns within 7 days of delivery for unused products in their original condition and packaging. Contact our support team on WhatsApp or via the Support page to initiate a return.",
    },
    {
      q: "Do you offer wholesale or bulk pricing?",
      a: "Yes — we supply dealers and bulk buyers at wholesale rates. Reach out via WhatsApp or our Contact page and our team will provide a customised quote.",
    },
    {
      q: "How do I track my order?",
      a: "Once your order is shipped, you'll receive a tracking link by email or SMS. You can also visit Profile → Orders on this website for real-time tracking.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major UPI apps, credit/debit cards, net banking, and Cash on Delivery (COD) where available.",
    },
  ].filter(Boolean);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pt-20 pb-28 lg:pb-20">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex items-center gap-1.5 text-[12px] text-neutral-400 flex-wrap">
            <li><Link href="/" className="hover:text-[#19B5D8] transition-colors">Home</Link></li>
            <li><ChevronRight size={12} /></li>
            {product.category?.slug ? (
              <>
                <li>
                  <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#19B5D8] transition-colors">
                    {product.category.name}
                  </Link>
                </li>
                <li><ChevronRight size={12} /></li>
              </>
            ) : (
              <>
                <li><Link href="/shop" className="hover:text-[#19B5D8] transition-colors">Shop</Link></li>
                <li><ChevronRight size={12} /></li>
              </>
            )}
            {product.subcategory?.name && (
              <>
                <li>
                  <Link
                    href={`/shop?category=${product.category?.slug || ""}&subcategory=${product.subcategory._id}`}
                    className="hover:text-[#19B5D8] transition-colors"
                  >
                    {product.subcategory.name}
                  </Link>
                </li>
                <li><ChevronRight size={12} /></li>
              </>
            )}
            <li className="text-neutral-700 font-medium truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>
      </div>

      {/* ── Hero: Images + Info ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 lg:gap-16 items-start">

          {/* Gallery (left / sticky on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
          >
            {/* Main image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100">
              <AnimatePresence mode="sync">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images?.[selectedImage] || product.images?.[0] || "/logo.png"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-neutral-50 border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? "border-[#19B5D8] shadow-[0_0_0_3px_rgba(25,181,216,0.15)]"
                        : "border-neutral-100 hover:border-neutral-300"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info (right) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col"
          >
            {/* Brand + Category chips */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.brand && (
                <span className="text-[11px] font-semibold text-neutral-500 px-3 py-1 bg-neutral-100 rounded-full">
                  {product.brand}
                </span>
              )}
              {product.category?.name && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="text-[11px] font-semibold text-[#0C7290] px-3 py-1 bg-[#DDF8FD] rounded-full hover:bg-[#c5f1fb] transition-colors"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[26px] sm:text-3xl font-bold text-neutral-900 leading-tight tracking-tight mb-3">
              {product.title}
            </h1>

            {/* Rating summary (only when reviews exist) */}
            {!loadingReviews && reviews.length > 0 && (
              <div className="flex items-center gap-2.5 mb-4">
                <StarRating rating={avgRating} />
                <span className="text-[13px] font-semibold text-neutral-900">{avgRating.toFixed(1)}</span>
                <span className="text-[13px] text-neutral-400">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Price + Stock */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[32px] font-bold text-neutral-900 tracking-tight leading-none">
                {price}
              </span>
              <span
                className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Key highlights grid */}
            {highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex flex-col px-3 py-2.5 bg-neutral-50 rounded-xl border border-neutral-100"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-0.5">
                      {h.label}
                    </span>
                    <span className="text-[13px] font-semibold text-neutral-900 leading-tight">
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-[14px] text-neutral-500 leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {/* MOQ notice */}
            {moq > 1 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#DDF8FD]/60 border border-[#19B5D8]/20 rounded-xl mb-5 text-[13px]">
                <Zap size={13} className="text-[#19B5D8] shrink-0" />
                <span className="text-[#0C7290] font-medium">
                  Minimum order quantity: <strong>{moq} units</strong>
                </span>
              </div>
            )}

            {/* CTAs — hidden on mobile (sticky bar handles it) */}
            <div className="hidden sm:flex gap-3 mb-6">
              <button
                onClick={() => addToCart(product, moq, { source: "pdp" })}
                disabled={!inStock}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-neutral-900 text-white text-[13.5px] font-semibold rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={15} strokeWidth={1.8} />
                {moq > 1 ? `Add ${moq} to Cart` : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 h-12 flex items-center justify-center bg-[#19B5D8] text-white text-[13.5px] font-semibold rounded-xl hover:bg-[#1297B5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery checker */}
            <div className="mb-5">
              <PincodeChecker cod={true} />
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-2.5">
              {TRUST.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <Icon size={13} className="text-[#19B5D8] shrink-0" strokeWidth={1.8} />
                  <span className="text-[11.5px] text-neutral-600 leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Below-fold sections ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-10 md:mt-20 space-y-12 md:space-y-20">

        {/* Specifications */}
        {product.specifications?.length > 0 && (
          <section>
            <SectionHeader label="Product Details" title="Specifications" />
            <div className="rounded-2xl border border-neutral-100 overflow-hidden">
              {product.specifications.map((spec, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-5 py-4 border-b border-neutral-50 last:border-0 ${
                    i % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                  }`}
                >
                  <span className="text-[13px] text-neutral-500">{spec.key}</span>
                  <span className="text-[13px] font-semibold text-neutral-900 text-right max-w-[55%]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Warranty */}
        {product.warranty > 0 && (
          <section>
            <SectionHeader label="Coverage" title="Warranty" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3 p-5 bg-[#F0FEFF] rounded-2xl border border-[#19B5D8]/15">
                <div className="w-9 h-9 rounded-xl bg-[#DDF8FD] flex items-center justify-center">
                  <ShieldCheck size={17} className="text-[#0C7290]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#0C7290] mb-1">Duration</p>
                  <p className="text-[22px] font-bold text-neutral-900 leading-none">{product.warranty}</p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">months</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <ShieldCheck size={17} className="text-neutral-600" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1">What&apos;s Covered</p>
                  <p className="text-[13px] text-neutral-700 leading-relaxed">
                    Manufacturing defects in materials and workmanship under normal use and conditions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Phone size={17} className="text-neutral-600" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1">How to Claim</p>
                  <p className="text-[13px] text-neutral-700 leading-relaxed">
                    Contact us on WhatsApp or via the Support page with your order number and a photo of the issue.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <SectionHeader label="Got Questions?" title="Frequently Asked" />
          <div className="rounded-2xl border border-neutral-100 bg-white px-6 divide-y divide-neutral-50">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* Reviews — only shown when reviews actually exist */}
        {!loadingReviews && reviews.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-8">
              <SectionHeader label="What Customers Say" title="Reviews" />
              <div className="flex items-center gap-3 pb-8">
                <StarRating rating={avgRating} size={18} />
                <span className="text-2xl font-bold text-neutral-900">{avgRating.toFixed(1)}</span>
                <span className="text-[13px] text-neutral-400">/ 5</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex flex-col gap-3 p-5 bg-neutral-50 rounded-2xl border border-neutral-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#DDF8FD] flex items-center justify-center text-[12px] font-bold text-[#0C7290]">
                        {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="text-[13px] font-semibold text-neutral-900">
                        {review.user?.name || "Customer"}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size={12} />
                  </div>

                  {review.comment && (
                    <p className="text-[13px] text-neutral-600 leading-relaxed line-clamp-4">
                      {review.comment}
                    </p>
                  )}

                  <p className="text-[11px] text-neutral-400 mt-auto">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* You May Also Like */}
        {(loadingRecommended || recommended.length > 0) && (
          <section>
            <SectionHeader label="Explore More" title="You May Also Like" />
            {loadingRecommended ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
                    <div className="h-[190px] bg-neutral-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-neutral-100 rounded-full w-full" />
                      <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {recommended.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>

      {/* ── Mobile sticky CTA ── */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-neutral-100 px-4 py-3">
        <div className="flex gap-3">
          <button
            onClick={() => addToCart(product, moq, { source: "pdp-sticky" })}
            disabled={!inStock}
            className="flex-1 h-12 flex items-center justify-center gap-1.5 bg-neutral-900 text-white text-[13px] font-semibold rounded-xl disabled:opacity-40"
          >
            <ShoppingBag size={14} strokeWidth={1.8} />
            {moq > 1 ? `Add ${moq}` : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="flex-1 h-12 flex items-center justify-center bg-[#19B5D8] text-white text-[13px] font-semibold rounded-xl disabled:opacity-40"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* WhatsApp float */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918298922623"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 z-50 w-12 h-12 bg-[#19B5D8] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={22} className="text-white" />
      </a>
    </div>
  );
}
