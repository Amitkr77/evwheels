"use client";

import FeaturedProductCard from "./FeaturedProductCard";
import ShopByCategory from "./ShopBycategory";

// One section, two halves: the trending/featured product on the left,
// categories on the right. Stacks (product on top) below lg.
export default function FeaturedAndCategories() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-neutral-100">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <FeaturedProductCard />
          <ShopByCategory />
        </div>
      </div>
    </section>
  );
}
