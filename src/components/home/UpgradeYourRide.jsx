"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 155,
    name: "Premium Suspension Fork",
    category: "Suspension",
    price: "₹4,999",
    image: "/products/fork-1.jpg",
  },
  {
    id: 156,
    name: "Performance Suspension Fork",
    category: "Suspension",
    price: "₹5,499",
    image: "/products/fork-2.jpg",
  },
  {
    id: 230,
    name: "Hydraulic Brake Set",
    category: "Braking",
    price: "₹3,999",
    image: "/products/hydraulic-brake.jpg",
  },
  {
    id: 210,
    name: "Magnesium Alloy Wheel",
    category: "Wheels",
    price: "₹6,999",
    image: "/products/magnesium-wheel.jpg",
  },
];

export default function UpgradeYourRide() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.35em] text-[#19B5D8]">
            Premium Upgrades
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-medium">
            Upgrade Your Ride
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
            Enhance performance, comfort, and control with carefully selected
            components designed for riders who expect more.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-28">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center group ${
                index % 2 !== 0 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Image */}
              <div className="overflow-hidden rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#19B5D8]">
                  {product.category}
                </span>

                <h3 className="mt-5 text-3xl md:text-4xl font-light">
                  {product.name}
                </h3>

                <p className="mt-5 text-neutral-600 font-light leading-relaxed">
                  Crafted for smoother handling, greater confidence and a more
                  refined riding experience.
                </p>

                <div className="mt-8 flex items-center gap-8">
                  <span className="text-xl font-light text-neutral-900">
                    {product.price}
                  </span>

                  <span className="text-sm text-neutral-500 transition-colors group-hover:text-[#19B5D8]">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-32 text-center border-t border-neutral-200 pt-16">
          <h3 className="text-3xl font-light mb-6">Built for Better Riding</h3>

          <p className="max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
            Discover suspension, braking and wheel upgrades engineered to
            elevate every journey.
          </p>

          <Link
            href="/parts"
            className="inline-block mt-10 text-[#19B5D8] text-sm tracking-wide"
          >
            View All Components →
          </Link>
        </div>
      </div>
    </section>
  );
}
