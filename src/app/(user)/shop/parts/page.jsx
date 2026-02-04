import React from "react";
import { BadgeCheck,CheckCircle,Truck,Lock } from "lucide-react";

export default function page() {
  return (
    <section classNameName="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex-grow">
          <section className="bg-[#131811] dark:bg-black text-white py-12 md:py-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-[1280px] mx-auto px-4 md:px-10 relative z-10">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="max-w-2xl">
                  <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Home
                    </a>
                    <span className="material-symbols-outlined text-[12px]">
                      chevron_right
                    </span>
                    <span className="text-white">Parts &amp; Spares</span>
                  </nav>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                    Genuine Parts &amp;{" "}
                    <span className="text-primary">Components</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-xl">
                    Restore performance and ensure longevity with verified spare
                    parts. Guaranteed fitment for all supported EvWheels models.
                  </p>
                </div>
                <div className="w-full md:w-auto bg-[#1a2c15]/80 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col sm:flex-row gap-4 shadow-xl">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Your Vehicle
                    </label>
                    <select className="block w-full rounded-lg bg-black/50 border-gray-700 text-white text-sm focus:ring-primary focus:border-primary">
                      <option>Select Brand</option>
                      <option>Tesla Cycles</option>
                      <option>Urban Glide</option>
                      <option>Volt Motors</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                      Model
                    </label>
                    <select className="block w-full rounded-lg bg-black/50 border-gray-700 text-white text-sm focus:ring-primary focus:border-primary">
                      <option>Select Model</option>
                      <option>Model X1</option>
                      <option>City Cruiser</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full sm:w-auto h-[38px] px-6 bg-primary hover:bg-[#3ce00b] text-primary-content font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                      Filter Parts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <div>
                  <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      category
                    </span>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        // checked=""
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        All Parts
                      </span>
                      <span className="ml-auto text-xs text-gray-400">124</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Batteries &amp; Power
                      </span>
                      <span className="ml-auto text-xs text-gray-400">18</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Tires &amp; Wheels
                      </span>
                      <span className="ml-auto text-xs text-gray-400">32</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Brakes
                      </span>
                      <span className="ml-auto text-xs text-gray-400">14</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Controllers
                      </span>
                      <span className="ml-auto text-xs text-gray-400">8</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Frames &amp; Body
                      </span>
                      <span className="ml-auto text-xs text-gray-400">21</span>
                    </label>
                  </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white mb-4">
                    Availability
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        In Stock
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary bg-transparent"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-primary transition-colors">
                        Pre-order
                      </span>
                    </label>
                  </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <h3 className="font-bold text-text-main dark:text-white mb-4">
                    Price Range
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-xs">$</span>
                      </div>
                      <input
                        className="block w-full rounded bg-white dark:bg-[#1a2c15] border-gray-300 dark:border-gray-700 py-1.5 pl-6 text-xs"
                        placeholder="Min"
                        type="number"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-xs">$</span>
                      </div>
                      <input
                        className="block w-full rounded bg-white dark:bg-[#1a2c15] border-gray-300 dark:border-gray-700 py-1.5 pl-6 text-xs"
                        placeholder="Max"
                        type="number"
                      />
                    </div>
                  </div>
                  <button className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                    Apply
                  </button>
                </div>
              </aside>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-text-muted dark:text-gray-400">
                    Showing{" "}
                    <span className="font-bold text-text-main dark:text-white">
                      6
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-text-main dark:text-white">
                      124
                    </span>{" "}
                    parts
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-text-muted dark:text-gray-400 hidden sm:block">
                      Sort by:
                    </label>
                    <select className="rounded-lg bg-white dark:bg-[#1a2c15] border-gray-300 dark:border-gray-700 text-sm py-2 pl-3 pr-8 focus:ring-primary focus:border-primary">
                      <option>Most Relevant</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest Arrivals</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCp_CS7nsjkCFk_kMALm_Lx3NEOsUgoGM69TUwWUxYOa9xa3MXrkjHZCdpnbqifRzjy3gZqxXnlQeKQxl1njKbSUvZiB--HQB2e8grFIwoamV_URXkfUDF2MDAMHbttGqdLf28aCRpvzm9--3MrCJju5sadvFSQ_Qjub80RYyyWN_W6XgbwcvMAnrRaCa-gs8QZCvlUXPdMEuNuwYp83wg8dqdLruhEF_0dtEWB66Zmd_8cSNi6Bj-B-05P-mmVEEmwPcM6roNvPT5F)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                        HOT
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Power
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          Li-Pro 48V Battery Pack
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          Universal Fit for Series X
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$349.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAex8OTOjELNQig8GrwSbh22EM-y8l6ASSZcm_jjTmz9s3r0saW7MVMrCBxrImdj3VuMKSDIlIHEfWWxk9KO0r39KCmKDFvvjNHJC6WunwTuVStzfeX4bmdjKffEKpkv8f3v0ZIkcztdrpJZ1QAEn2EnsVLRXqHBEueOZlel5ua0gD_7FBM4ZJfNJ7819gw1ZdD_9_byInbrR5k86rZwHdomicN6kJEEsTjWpjugeKrrdgqfn6ChCYh_US_OhOLJJGdOU1rUwWwMeaW)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                        STOCK LOW
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Wheels
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          All-Terrain Fat Tire
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          20" x 4.0" Puncture Resistant
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$45.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                          filter: "hue-rotate(45deg)",
                        }}
                      ></div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Electronics
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          Pro Motor Controller
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          Sinewave 35A Output
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$189.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAmlGQ-AjvRxIue5m-4_jlknyuCAEYQbwYH78T_YxSPg_LjnwQ3P4E_whT0n_ZASJFauiboMzBKHRvvtQN-HRcpq9yWZ89cUqNQjntqWcCoMZIFa5wOPtd8PNohB1UKuBrNxDrVQvzQqEahmDL7flCmRRMxrbY8yF3-CnQkkHYG2jeUbsaMUF6L0jPeTuzBQVJFDtBcnkKDOWQcNeh4aLADxHfFicVcCX46Iul8TgujSbCxsgYuN75h9MfEoZ8Q-mPnbWmCJgE_vhrm)",
                        }}
                      ></div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Safety
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          AeroSmart Helmet
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          With Integrated LED
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$120.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 grayscale opacity-80"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                          filter: "hue-rotate(180deg)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                        OEM
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Braking
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          Hydraulic Caliper Kit
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          Front &amp; Rear Set
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$89.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden p-6 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAex8OTOjELNQig8GrwSbh22EM-y8l6ASSZcm_jjTmz9s3r0saW7MVMrCBxrImdj3VuMKSDIlIHEfWWxk9KO0r39KCmKDFvvjNHJC6WunwTuVStzfeX4bmdjKffEKpkv8f3v0ZIkcztdrpJZ1QAEn2EnsVLRXqHBEueOZlel5ua0gD_7FBM4ZJfNJ7819gw1ZdD_9_byInbrR5k86rZwHdomicN6kJEEsTjWpjugeKrrdgqfn6ChCYh_US_OhOLJJGdOU1rUwWwMeaW)",
                          filter: "contrast(1.2)",
                        }}
                      ></div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Wheels
                        </span>
                        <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">
                          Street Slicks 20"
                        </h3>
                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                          High speed road tires
                        </p>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg">$42.00</span>
                        <button
                          className="size-8 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary hover:bg-primary hover:text-primary-content transition-colors"
                          title="Add to Cart"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <button className="size-10 rounded-lg bg-primary text-primary-content font-bold flex items-center justify-center">
                    1
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    2
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    3
                  </button>
                  <span className="text-gray-400 px-2">...</span>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    12
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white dark:bg-[#1a2c15] border-t border-gray-100 dark:border-gray-800 py-12">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary flex-shrink-0">
                    <BadgeCheck className="material-symbols-outlined text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white">
                      Quality Assured
                    </h4>
                    <p className="text-xs text-text-muted dark:text-gray-400">
                      Certified OEM parts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary flex-shrink-0">
                    <CheckCircle className="material-symbols-outlined text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white">
                      Compatibility Verified
                    </h4>
                    <p className="text-xs text-text-muted dark:text-gray-400">
                      Guaranteed fitment
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary flex-shrink-0">
                    <Truck className="material-symbols-outlined text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white">
                      Fast Delivery
                    </h4>
                    <p className="text-xs text-text-muted dark:text-gray-400">
                      2-3 Day shipping
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] flex items-center justify-center text-primary flex-shrink-0">
                    <Lock className="material-symbols-outlined text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white">
                      Secure Payments
                    </h4>
                    <p className="text-xs text-text-muted dark:text-gray-400">
                      256-bit encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
