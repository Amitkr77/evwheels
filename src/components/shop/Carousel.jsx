"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontally-scrolling carousel — native overflow-x scroll + scroll-snap
// gives smooth momentum scrolling and touch/swipe support for free on
// mobile; the prev/next buttons just nudge that same native scroll
// position, so keyboard/mouse and touch both drive the identical mechanism.
export default function Carousel({ children, itemClassName = "" }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [children]);

  const scrollByAmount = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.isArray(children) &&
          children.map((child, i) => (
            <div key={i} className={`snap-start shrink-0 ${itemClassName}`}>
              {child}
            </div>
          ))}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 items-center justify-center text-neutral-700 hover:text-[#19B5D8] transition-colors z-10"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-neutral-100 items-center justify-center text-neutral-700 hover:text-[#19B5D8] transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
