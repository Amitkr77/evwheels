"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/Toast";

export default function ProductCard({ product }) {
  const inStock = product.stock > 0;
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product._id));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToast();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
    if (isAuthenticated) {
      toast(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        "wishlist"
      );
    }
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group h-full flex flex-col bg-white rounded-none overflow-hidden border border-neutral-100 hover:border-[#19B5D8]/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden shrink-0">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 240px, 240px"
            className="object-cover group-hover:scale-[0.95] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-neutral-100 select-none uppercase">
              {product.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Category chip — top-left */}
        {product.category?.name && (
          <span className="hidden sm:block absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-neutral-500 px-2.5 py-1 rounded-none border border-neutral-100 leading-none">
            {product.category.name}
          </span>
        )}

        {/* Wishlist button — top-right */}
        <button
          onClick={handleWishlist}
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

        {/* MOQ badge */}
        {(product.moq || 1) > 1 && (
          <span className="absolute top-2.5 right-12 bg-neutral-900 text-white text-[9px] font-semibold tracking-wide px-2 py-1 rounded-none leading-none">
            MOQ {product.moq}
          </span>
        )}

        {/* Hover affordance */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-none bg-[#19B5D8] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 shadow-md">
          <ArrowUpRight size={14} className="text-white" strokeWidth={2.2} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-3.5 sm:p-5 flex-1">
        <h3 className="text-[13px] sm:text-[14px] font-semibold text-neutral-800 line-clamp-2 leading-snug flex-1">
          {product.title}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-auto min-w-0">
          <p className="text-[14px] sm:text-[16px] font-bold text-neutral-900 tracking-tight truncate">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          <span
            className={`shrink-0 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-none leading-none ${
              inStock
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {inStock ? "In stock" : "Sold out"}
          </span>
        </div>
      </div>
    </Link>
  );
}
