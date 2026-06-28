import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function Wishlist() {
  const { items, isLoading, fetchWishlist, toggleWishlist } =
    useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-neutral-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
        <p className="text-neutral-600 mb-8">Start adding items you love ♥</p>
        {/* You can add a "Browse Products" button here */}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4"
    >
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
          Wishlist ({items.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-[#19B5D8]/20 hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[4/3] bg-neutral-100">
              <Image
                src={item.image || "/logo.png"}
                alt={item.title || "Product image"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <button
                onClick={() => toggleWishlist(item._id)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                aria-label={`Remove ${item.title} from wishlist`}
              >
                <Heart size={18} className="text-red-600" fill="#dc2626" />
              </button>
            </div>

            <div className="p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-medium mb-2 line-clamp-2">
                {item.title}
              </h3>
              <div className="text-xl md:text-2xl font-light text-[#19B5D8] mb-5">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "INR",
                }).format(item.price)}{" "}
              </div>
              <button
                onClick={() => addToCart(item, 1)}
                className="w-full py-3.5 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
