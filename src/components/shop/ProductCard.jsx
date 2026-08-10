"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ product }) {
  const inStock = product.stock > 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-[#19B5D8]/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)] transition-all duration-300"
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
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-neutral-500 px-2.5 py-1 rounded-full border border-neutral-100 leading-none">
            {product.category.name}
          </span>
        )}

        {/* MOQ badge — top-right */}
        {(product.moq || 1) > 1 && (
          <span className="absolute top-2.5 right-2.5 bg-neutral-900 text-white text-[9px] font-semibold tracking-wide px-2 py-1 rounded-full leading-none">
            MOQ {product.moq}
          </span>
        )}

        {/* Hover affordance — teal circle */}
        <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#19B5D8] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 shadow-md">
          <ArrowUpRight size={14} className="text-white" strokeWidth={2.2} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
        <h3 className="text-[12px] sm:text-[13px] font-semibold text-neutral-800 line-clamp-2 leading-snug flex-1">
          {product.title}
        </h3>

        <div className="flex items-center justify-between gap-1.5 mt-auto min-w-0">
          <p className="text-[13px] sm:text-[15px] font-bold text-neutral-900 tracking-tight truncate">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          <span
            className={`shrink-0 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full leading-none ${
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
