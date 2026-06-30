"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 165,
    name: "Shimano EF500 Gear Shifter",
    price: "₹1,499",
    image: "/products/shimano-1.jpg",
  },
  {
    id: 166,
    name: "Shimano Altus Shifter",
    price: "₹1,799",
    image: "/products/shimano-2.jpg",
  },
  {
    id: 171,
    name: "Shimano Disc Brake Set",
    price: "₹2,499",
    image: "/products/shimano-3.jpg",
  },
  {
    id: 172,
    name: "Shimano Tourney Gear Set",
    price: "₹1,299",
    image: "/products/shimano-4.jpg",
  },
  {
    id: 173,
    name: "Shimano Chain System",
    price: "₹899",
    image: "/products/shimano-5.jpg",
  },
  {
    id: 174,
    name: "Shimano Freewheel Cassette",
    price: "₹1,099",
    image: "/products/shimano-6.jpg",
  },
];

export default function BestSellersShimano() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-[#19B5D8]">
            Trusted Components
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-medium">
            Shimano Collection
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
            Precision-engineered drivetrain and braking components trusted by
            riders around the world.
          </p>
        </div>

        {/* Products */}
        <div className="flex gap-10 overflow-x-auto pb-6 scrollbar-hide">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group min-w-[320px]"
            >
              {/* Image */}
              <div className="overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-[340px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-[1.03]
                  "
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-light text-neutral-900">
                  {product.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-light text-neutral-900">
                    {product.price}
                  </span>

                  <span className="text-sm text-neutral-500 group-hover:text-[#19B5D8] transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 text-center">
          <Link
            href="/brand/shimano"
            className="
              inline-flex
              items-center
              gap-2
              text-[#19B5D8]
              text-sm
              tracking-wide
              hover:opacity-70
              transition-opacity
            "
          >
            View Full Shimano Collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
