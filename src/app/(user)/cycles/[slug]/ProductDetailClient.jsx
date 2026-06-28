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

export default function ProductDetailClient() {
  const params = useParams();
  const { slug } = params;

  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);

        if (!res.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?id=${product._id}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
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

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Breadcrumb */}
        <nav className="mb-10 mt-4 text-sm text-neutral-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-3">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/cycles">Cycles</Link>
            </li>
            <li>/</li>
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
                src={product.images?.[0] || "/logo.png"}
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
                  <div
                    key={i}
                    className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
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

            <div className="text-3xl text-emerald-800 mb-6">
              {formattedPrice}
            </div>

            <div className="space-y-2 mb-6 text-sm text-neutral-700">
              {getSpecValue("range") && <p>Range: {getSpecValue("range")} km</p>}
              {getSpecValue("weight") && <p>Weight: {getSpecValue("weight")} kg</p>}
              {product.colors?.length > 0 && <p>Color: {product.colors.join(", ")}</p>}
              {product.warranty > 0 && <p>Warranty: {product.warranty} months</p>}
              <p className={`font-medium ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </p>
            </div>

            <p className="text-neutral-600 mb-8 leading-relaxed">{product.description}</p>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, 1)}
                disabled={product.stock === 0}
                className="px-8 py-4 bg-black text-white rounded-full cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="px-8 py-4 bg-emerald-800 text-white rounded-full cursor-pointer hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
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
                    <span className="text-yellow-500">
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
      </div>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
      </a>
    </div>
  );
}
