"use client";

import { memo } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/Toast";

function WishlistButton({ productId }) {
  const items = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToast();

  const isInWishlist = items.some(
    (item) => item._id?.toString() === productId?.toString()
  );

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    if (isAuthenticated) {
      toast(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        "wishlist"
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-neutral-100 transition-all hover:border-red-200 hover:bg-red-50 z-10 ${
        isInWishlist ? "text-red-500" : "text-neutral-400"
      }`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={14}
        strokeWidth={1.8}
        className={isInWishlist ? "fill-red-500" : ""}
      />
    </button>
  );
}

export default memo(WishlistButton);
