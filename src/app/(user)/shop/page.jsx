"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "RangeX City",
    price: "₹54,999",
    range: "140 km",
    weight: "25 kg",
    image:
      "https://images.unsplash.com/photo-1631631480669-535cc43f232c?auto=format&fit=crop&q=90&w=800",
  },
  {
    name: "TrailX Pro",
    price: "₹74,999",
    range: "120 km",
    weight: "28 kg",
    image:
      "https://images.unsplash.com/photo-1649972077917-2d9b0d2e3e8d?auto=format&fit=crop&q=90&w=800",
  },
  {
    name: "LiteX Fold",
    price: "₹44,999",
    range: "90 km",
    weight: "22 kg",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=90&w=800",
  },
];

export default function CyclesPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-medium text-center mb-16 md:mb-24"
        >
          Our Cycles
        </motion.h1>

        {/* Filters + Sorting + View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 md:mb-16">
          {/* Left: Filters */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Filter by:
              </span>
              <select className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white">
                <option>All Types</option>
                <option>City</option>
                <option>Trail / Off-road</option>
                <option>Foldable</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Price:
              </span>
              <select className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white">
                <option>All Prices</option>
                <option>Under ₹50,000</option>
                <option>₹50,000 – ₹75,000</option>
                <option>Above ₹75,000</option>
              </select>
            </div>
          </div>

          {/* Right: Sort + View Toggle */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-light text-neutral-600">
                Sort by:
              </span>
              <select className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm md:text-base font-light focus:outline-none focus:border-emerald-600 transition-colors bg-white">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Range: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            {/* View Toggle (Grid / List) */}
            <div className="flex items-center gap-3 border border-neutral-300 rounded-lg overflow-hidden">
              <button className="px-4 py-2.5 bg-neutral-100 text-neutral-900 font-medium text-sm md:text-base transition-colors hover:bg-neutral-200">
                Grid
              </button>
              <button className="px-4 py-2.5 text-neutral-600 hover:text-neutral-900 transition-colors text-sm md:text-base">
                List
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15 }}
              className="group"
            >
              <div className="aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium mb-3">
                {product.name}
              </h3>

              <div className="text-xl font-light text-emerald-800 mb-4">
                {product.price}
              </div>

              <div className="text-sm text-neutral-600 font-light space-y-1 mb-6">
                <p>Range: {product.range}</p>
                <p>Weight: {product.weight}</p>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 text-neutral-900 font-medium hover:text-emerald-800 transition-colors"
              >
                View Details
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
