"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

// Shared product tile — used on the homepage, the shop listing, and the
// product detail page's "You may also like" rail, so the card only needs
// fixing (and only looks) one way everywhere it appears.
export default function ProductCard({ product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-200"
    >
      <div className="relative bg-neutral-50 p-4 aspect-square overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-neutral-100 select-none uppercase">
              {product.title?.charAt(0)}
            </span>
          </div>
        )}

        {(product.moq || 1) > 1 && (
          <span className="absolute top-2.5 right-2.5 bg-neutral-900 text-white text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded-md">
            MOQ {product.moq}
          </span>
        )}

        {/* View affordance — a quiet icon that appears on hover/focus instead
            of a permanent "View →" label competing with the price. */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200">
          <ArrowUpRight size={15} className="text-neutral-700" />
        </div>
      </div>

      <div className="px-3.5 pb-3.5 pt-3 flex flex-col gap-1.5">
        <h3 className="text-[13px] font-medium text-neutral-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <p className="text-sm font-bold text-neutral-900">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}
