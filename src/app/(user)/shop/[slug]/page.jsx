"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 text-center">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const formattedPrice = `₹${product.price.toLocaleString("en-IN")}`;

  const displayedSpecs = [
    {
      label: "Motor",
      value: `${product.specs?.motor?.power}W ${product.specs?.motor?.type}`,
    },
    {
      label: "Battery",
      value: `${product.specs?.battery?.capacity}Wh ${product.specs?.battery?.type}`,
    },
    { label: "Range", value: `${product.specs?.battery?.range} km` },
    {
      label: "Charging Time",
      value: `${product.specs?.battery?.chargingTime} hours`,
    },
    { label: "Top Speed", value: `${product.specs?.motor?.topSpeed} km/h` },
    { label: "Weight", value: `${product.specs?.physical?.weight} kg` },
    { label: "Frame", value: product.specs?.physical?.frameMaterial },
    { label: "Brakes", value: product.specs?.components?.brakeType },
    { label: "Suspension", value: product.specs?.components?.suspension },
    { label: "Gears", value: product.specs?.components?.gearSystem },
    { label: "Display", value: product.specs?.smartFeatures?.displayType },
  ].filter((spec) => spec.value && spec.value.trim() !== "");

  const suggestedProducts = [
    {
      name: "TrailX Pro",
      price: "₹74,999",
      image:
        "https://images.unsplash.com/photo-1649972077917-2d9b0d2e3e8d?w=800",
    },
    {
      name: "LiteX Fold",
      price: "₹44,999",
      image:
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-20 pb-20">
      <div className="fixed top-0 left-0 w-full h-18 overflow-hidden">
        <div className="absolute inset-0 subtle-gradient"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-10 text-sm text-neutral-600">
          <ol className="flex items-center gap-3">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop">Cycles</Link>
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
            <img
              src={product.image || "/placeholder.png"}
              alt={product.title}
              className="w-full rounded-xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-semibold mb-6">{product.title}</h1>

            <div className="text-4xl text-emerald-800 mb-8">
              {formattedPrice}
            </div>

            <div className="space-y-2 mb-8">
              <p>Range: {product.specs?.battery?.range} km</p>
              <p>Weight: {product.specs?.physical?.weight} kg</p>
              {product.color && <p>Color: {product.color}</p>}
              {product.warranty && <p>Warranty: {product.warranty} months</p>}
            </div>

            <p className="text-neutral-600 mb-10">{product.description}</p>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, 1)}
                className="px-8 py-4 bg-black text-white rounded-full cursor-pointer"
              >
                Add to Cart
              </button>

              <button className="px-8 py-4 border rounded-full">Buy Now</button>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-10">Specifications</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {displayedSpecs.map((spec, i) => (
              <div key={i} className="flex justify-between border-b py-3">
                <span className="text-neutral-600">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-semibold">Reviews</h2>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-emerald-700 text-emerald-700"
                />
              ))}
            </div>
          </div>

          <p className="text-neutral-600">
            No reviews yet. Be the first to review!
          </p>
        </section>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-800 rounded-full flex items-center justify-center"
      >
        <MessageCircle size={28} className="text-white" />
      </a>
    </div>
  );
}
