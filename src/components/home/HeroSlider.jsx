"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Premium Electric Mobility",
    subtitle:
      "Discover high-performance E-Cycles, EV Parts, and Accessories designed for modern riders.",
    image:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2000&auto=format&fit=crop",
    primaryBtn: "/shop",
    secondaryBtn: "/parts",
  },
  {
    id: 2,
    title: "Power Your Next Adventure",
    subtitle:
      "Explore rugged mountain e-bikes engineered for performance, comfort, and endurance.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop",
    primaryBtn: "/shop/mtb",
    secondaryBtn: "/parts",
  },
  {
    id: 3,
    title: "Smart Urban Commuting",
    subtitle:
      "Efficient, sustainable, and stylish electric mobility solutions for everyday travel.",
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2000&auto=format&fit=crop",
    primaryBtn: "/scooty",
    secondaryBtn: "/parts",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative h-[100vh] min-h-[700px] overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white mb-6">
                  ⚡ Premium Electric Mobility
                </span>

                <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight">
                  {slide.title}
                </h1>

                <p className="mt-6 text-lg md:text-xl text-neutral-200 max-w-2xl leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href={slide.primaryBtn}
                    className="inline-flex items-center gap-2 rounded-full bg-[#19B5D8] px-8 py-4 text-white font-semibold transition-all duration-300 hover:bg-[#1297B5] hover:scale-105"
                  >
                    Explore Collection
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href={slide.secondaryBtn}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-white font-semibold transition-all duration-300 hover:bg-white/20"
                  >
                    Shop Parts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === index ? "w-10 bg-[#19B5D8]" : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Previous */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-10 z-30 hidden lg:flex items-center gap-3 text-white/80">
        <span className="text-sm uppercase tracking-[0.25em]">Scroll</span>

        <div className="h-12 w-[1px] bg-white/40" />
      </div>
    </section>
  );
}
