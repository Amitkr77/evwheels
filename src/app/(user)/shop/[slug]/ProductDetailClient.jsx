"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { analytics } from "@/lib/analytics";
import ProductCard from "@/components/shop/ProductCard";
import PincodeChecker from "@/components/shop/PincodeChecker";

export default function ProductDetailClient() {
  const params = useParams();
  const { slug } = params;

  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [recommended, setRecommended] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (cancelled) return;

        if (!res.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (cancelled) return;
        setProduct(data.product);
        setSelectedImage(0);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?._id) return;

    analytics.track("Product Viewed", {
      product_id: product._id,
      slug: product.slug,
      product_name: product.title,
      category: product.category?.name,
      brand: product.brand,
      price: product.price,
      currency: "INR",
      stock: product.stock,
    });
  }, [product?._id]);

  useEffect(() => {
    if (!product?._id) return;

    let cancelled = false;
    setLoadingReviews(true);
    setReviews([]);

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?id=${product._id}`);
        const data = await res.json();
        if (cancelled) return;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch reviews", err);
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [product?._id]);

  // "You may also like" — same category when we have one, otherwise fall
  // back to general newest products so the section still has something to
  // show rather than rendering nothing at all.
  useEffect(() => {
    if (!product?._id) return;

    let cancelled = false;
    setLoadingRecommended(true);

    const categorySlug = product.category?.slug;
    const url = categorySlug
      ? `/api/products?category=${encodeURIComponent(categorySlug)}&limit=9`
      : "/api/products?sort=createdAt&order=desc&limit=9";

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const others = (d.products || [])
          .filter((p) => p._id !== product._id)
          .slice(0, 8);
        setRecommended(others);
      })
      .catch(() => {
        if (!cancelled) setRecommended([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRecommended(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product?._id, product?.category?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin" />
          <p className="text-neutral-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const formattedPrice = `₹${product.price.toLocaleString("en-IN")}`;

  const getSpecValue = (key) =>
    product.specifications?.find((s) =>
      s.key.toLowerCase().includes(key.toLowerCase())
    )?.value;

  const handleBuyNow = () => {
    if (!product) return;
    // Buy Now is an isolated single-item checkout — it must never touch the
    // shared cart, so we route straight to checkout with just this product
    // instead of calling addToCart().
    router.push(`/checkout?buyNow=${product._id}&qty=${product.moq || 1}`);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">

        {/* Breadcrumb — the product's real category/subcategory, not a
            hardcoded "Cycles" that had nothing to do with the actual catalog. */}
        <nav className="mb-10 mt-4 text-sm text-neutral-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-3">
            <li>
              <Link href="/" className="hover:text-[#19B5D8] transition-colors">Home</Link>
            </li>
            <li>/</li>
            {product.category?.slug ? (
              <>
                <li>
                  <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#19B5D8] transition-colors">
                    {product.category.name}
                  </Link>
                </li>
                <li>/</li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/shop" className="hover:text-[#19B5D8] transition-colors">Shop</Link>
                </li>
                <li>/</li>
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
                <li>/</li>
              </>
            )}
            <li className="text-neutral-900 font-medium">{product.title}</li>
          </ol>
        </nav>

        {/* Product Hero */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
              <Image
                src={product.images?.[selectedImage] || product.images?.[0] || "/logo.png"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 border cursor-pointer transition-colors ${
                      selectedImage === i ? "border-[#19B5D8] border-2" : "border-neutral-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">{product.title}</h1>

            {product.brand && (
              <p className="text-neutral-500 text-sm mb-4">Brand: {product.brand}</p>
            )}

            <div className="text-3xl text-[#19B5D8] font-medium mb-6">
              {formattedPrice}
            </div>

            <div className="space-y-2 mb-6 text-sm text-neutral-700">
              {getSpecValue("range") && <p>Range: {getSpecValue("range")} km</p>}
              {getSpecValue("weight") && <p>Weight: {getSpecValue("weight")} kg</p>}
              {product.colors?.length > 0 && <p>Color: {product.colors.join(", ")}</p>}
              {product.warranty > 0 && <p>Warranty: {product.warranty} months</p>}
              <p className={`font-medium ${product.stock > 0 ? "text-[#22C55E]" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </p>
              {(product.moq || 1) > 1 && (
                <p className="text-[#19B5D8] font-medium">
                  Min. Order: {product.moq} pcs
                </p>
              )}
            </div>

            <p className="text-neutral-600 mb-8 leading-relaxed">{product.description}</p>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, product.moq || 1, { source: "pdp" })}
                disabled={product.stock === 0}
                className="px-8 py-4 bg-black text-white rounded-full cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(product.moq || 1) > 1 ? `Add ${product.moq} to Cart` : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="px-8 py-4 bg-[#19B5D8] text-white rounded-full cursor-pointer hover:bg-[#1297B5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6">
              <PincodeChecker cod={true} />
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-10">Specifications</h2>

          {product.specifications?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between border-b py-3">
                  <span className="text-neutral-600">{spec.key}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No specifications available for this product.
            </p>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="text-3xl font-medium mb-6">Customer Reviews</h2>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{review.user?.name}</span>
                    <span className="text-yellow-500" role="img" aria-label={`${review.rating} out of 5 stars`}>
                      {"⭐".repeat(Math.min(review.rating, 5))}
                    </span>
                  </div>
                  <p className="text-neutral-700">{review.comment}</p>
                  <small className="text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* You may also like */}
        {(loadingRecommended || recommended.length > 0) && (
          <div className="mt-24">
            <h2 className="text-3xl font-medium mb-8">You May Also Like</h2>
            {loadingRecommended ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-neutral-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-neutral-100" />
                    <div className="px-3.5 pb-3.5 pt-3 space-y-2">
                      <div className="h-3 bg-neutral-100 rounded w-full" />
                      <div className="h-3 bg-neutral-100 rounded w-2/3" />
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
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918298922623"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#19B5D8] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
      </a>
    </div>
  );
}
