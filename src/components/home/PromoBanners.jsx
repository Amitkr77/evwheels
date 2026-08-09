"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Shown until the admin adds real banners — built from facts already stated
// elsewhere on the homepage (hero, trust bar), not invented claims, and every
// link points at a real route.
const FALLBACK_BANNERS = [
  {
    _id: "fallback-1",
    title: "Wholesale Pricing for Dealers",
    subtitle: "No Middlemen",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
    buttonText: "Get a Quote",
    buttonLink: "/contact",
  },
  {
    _id: "fallback-2",
    title: "240+ Products In Stock",
    subtitle: "Bells to Disc Brakes",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80&auto=format&fit=crop",
    buttonText: "Browse Catalogue",
    buttonLink: "/shop",
  },
  {
    _id: "fallback-3",
    title: "Free Delivery Above ₹5,000",
    subtitle: "COD Available",
    image: "https://images.unsplash.com/photo-1621394457665-6e6d4961f686?w=800&q=80&auto=format&fit=crop",
    buttonText: "Start Shopping",
    buttonLink: "/shop",
  },
];

export default function PromoBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/banners")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setBanners(d.banners || []);
      })
      .catch(() => {
        if (!cancelled) setBanners([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing admin-configured yet — show the fallback set rather than an
  // empty section, so the page never looks unfinished.
  const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  return (
    <section className="py-10 md:py-12 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-neutral-200 animate-pulse h-64" />
              ))
            : displayBanners.map((banner) => {
                const content = (
                  <>
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                      {banner.subtitle && (
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1.5">
                          {banner.subtitle}
                        </p>
                      )}
                      <h3 className="text-white text-xl font-bold tracking-tight mb-3 leading-tight">
                        {banner.title}
                      </h3>
                      {banner.buttonText && (
                        <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold w-fit group-hover:gap-2.5 transition-all">
                          {banner.buttonText} <ArrowRight size={14} />
                        </span>
                      )}
                    </div>
                  </>
                );

                const className =
                  "group relative rounded-2xl overflow-hidden h-64 bg-neutral-900 block";

                return banner.buttonLink ? (
                  <Link key={banner._id} href={banner.buttonLink} className={className}>
                    {content}
                  </Link>
                ) : (
                  <div key={banner._id} className={className}>
                    {content}
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
