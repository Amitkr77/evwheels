"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// Live-search box with a results dropdown — lives in the header now (moved
// out of the homepage hero so search is available from every page).
export default function HeaderSearch({ className = "" }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    const term = debouncedQ.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(term)}&limit=5`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setResults(d.products || []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const goToResults = (term) => {
    const trimmed = term.trim();
    if (trimmed) router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goToResults(q);
  };

  const showDropdown = open && q.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-neutral-50 border border-neutral-200 rounded-full overflow-hidden focus-within:border-[#19B5D8] focus-within:ring-2 focus-within:ring-[#19B5D8]/10 transition-all"
      >
        <Search size={15} className="ml-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search parts, accessories…"
          aria-label="Search products"
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none min-w-0"
        />
        <button
          type="submit"
          className="mr-1.5 px-4 py-1.5 bg-[#0C7290] text-white text-xs font-semibold rounded-full hover:bg-[#0a5f78] transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-30">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-500">
              <Loader2 size={16} className="animate-spin" />
              Searching…
            </div>
          ) : results.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {results.map((p) => (
                  <li key={p._id}>
                    <Link
                      href={`/shop/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-neutral-50 overflow-hidden shrink-0">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs font-bold">
                            {p.title?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-900 truncate">{p.title}</p>
                        <p className="text-xs text-neutral-500">
                          ₹{Number(p.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goToResults(q)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-[#0C7290] border-t border-neutral-100 hover:bg-neutral-50 transition-colors"
              >
                See all results for “{q.trim()}”
              </button>
            </>
          ) : (
            <p className="px-4 py-5 text-sm text-neutral-500 text-center">
              No products found for “{q.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
