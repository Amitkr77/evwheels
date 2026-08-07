"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

// Content only — no outer <section>/container, so it can sit as the left
// half of the combined "Featured + Categories" section in HomeClient.
export default function FeaturedProductCard() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/homepage-settings")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setProduct(d.featuredProduct || null);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-neutral-100 animate-pulse h-full min-h-[420px]" />;
  }

  // Nothing to show — the admin hasn't set one and there isn't even a
  // fallback product in the catalog yet. Fail quiet, not with an
  // empty-looking card sitting next to the categories.
  if (!product) return null;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col h-full min-h-[420px] overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-950"
    >
      <div className="relative w-full flex-1 min-h-[220px]">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
      </div>

      <div className="relative z-10 p-7 md:p-9">
        <span className="inline-flex items-center gap-1.5 bg-[#19B5D8]/20 text-[#19B5D8] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#19B5D8]/30 mb-4 w-fit">
          <Sparkles size={11} />
          Trending Now
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-3">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-2xl font-bold text-white">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-full text-sm font-semibold group-hover:bg-[#19B5D8] group-hover:text-white transition-colors">
            Shop Now <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
