"use client";

import Link from "next/link";

const tools = [
  {
    id: 127,
    name: "Professional Tool Kit",
    price: "₹2,999",
    image: "/products/toolkit.jpg",
  },
  {
    id: 128,
    name: "Advanced Repair Kit",
    price: "₹3,499",
    image: "/products/toolkit-2.jpg",
  },
  {
    id: 78,
    name: "High Pressure Pump",
    price: "₹799",
    image: "/products/pump.jpg",
  },
  {
    id: 113,
    name: "Service Stand Pro",
    price: "₹4,999",
    image: "/products/stand.jpg",
  },
];

export default function MechanicsChoice() {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">

        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.35em] text-[#19B5D8]">
            Workshop Essentials
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Mechanic's Choice
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-neutral-600 font-light leading-relaxed">
            Professional-grade tools and workshop equipment trusted by
            experienced mechanics.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-20">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/products/${tool.id}`}
              className="group"
            >
              {/* Image */}
              <div className="overflow-hidden mb-8">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-light text-neutral-900">
                  {tool.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-light text-neutral-900">
                    {tool.price}
                  </span>

                  <span className="text-sm text-neutral-500 transition-colors group-hover:text-[#19B5D8]">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}