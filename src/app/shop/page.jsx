import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  Heart,
  Eye,
  ShoppingCart,
  BadgeCheck,
  IndianRupee,
  Truck,
  CheckCircle,
  Lock,
  ChartBarBig,
} from "lucide-react";

export default function page() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <main className="flex-grow">
          <section className="relative w-full h-[300px] bg-gray-900 overflow-hidden flex items-center">
            <div className="absolute inset-0 w-full h-full">
              <img
                alt="Cycling through city"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFLheHY9EkKx8Ci0y-0xtrdiFfAFrLlodR0UT0EF3YnSWMYUC2S58VoOSeqxgvI_AS3VJ-8b2QPQBLI1fEiELJoyVDzxvBAdQNQT8ffv2Ta56QZHL2SCkm6D_gd9N2zPqc6l-6teHVN3kpNbNfSKl2XYh0JMXU-d8JeO1jBw0_Cc71bS0YQVlpMvjRh2KRqoqSdqcQvcfiJYvfAK7yFCSww_I8AdyYncdUfnkxaWBcIRM3xuwLLdX81VzT0LbV6o7ad48XXTtKc69Q"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>
            </div>
            <div className="relative z-20 max-w-[1280px] mx-auto px-4 md:px-10 w-full">
              <div className="max-w-xl">
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <a className="hover:text-primary transition-colors" href="#">
                    Home
                  </a>
                  <ChevronRight className="material-symbols-outlined text-[16px]" />

                  <span className="text-white font-medium">Shop</span>
                </nav>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-4">
                  Premium <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#7cfc52]">
                    Electric Mobility
                  </span>
                </h1>
                <p className="text-lg text-gray-300">
                  Explore our curated collection of high-performance electric
                  cycles and certified components.
                </p>
              </div>
            </div>
          </section>
          <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
            <div className="flex flex-col lg:flex-row gap-10">
              <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block space-y-10">
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white mb-5 flex items-center justify-between">
                    Categories
                    <ChartBarBig className="material-symbols-outlined text-text-muted text-[20px]" />
                  </h3>
                  <ul className="space-y-3 text-sm font-medium text-text-muted dark:text-gray-400">
                    <li>
                      <a
                        className="flex items-center justify-between group cursor-pointer"
                        href="#"
                      >
                        <span className="group-hover:text-primary transition-colors text-primary font-bold">
                          All Products
                        </span>
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs transition-colors">
                          48
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center justify-between group cursor-pointer"
                        href="#"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          Electric Cycles
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs group-hover:bg-primary group-hover:text-primary-content transition-colors">
                          12
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center justify-between group cursor-pointer"
                        href="#"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          Batteries
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs group-hover:bg-primary group-hover:text-primary-content transition-colors">
                          8
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center justify-between group cursor-pointer"
                        href="#"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          Spare Parts
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs group-hover:bg-primary group-hover:text-primary-content transition-colors">
                          24
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center justify-between group cursor-pointer"
                        href="#"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          Accessories
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs group-hover:bg-primary group-hover:text-primary-content transition-colors">
                          15
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white mb-5 flex items-center justify-between">
                    Price Range
                    <IndianRupee className="material-symbols-outlined text-text-muted text-[20px]"/>
                      
                  </h3>
                  <div className="px-1">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-6 relative">
                      <div className="absolute left-0 top-0 h-full w-2/3 bg-primary rounded-full"></div>
                      <div className="absolute left-2/3 top-1/2 -translate-y-1/2 size-5 bg-white border-2 border-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          ₹
                        </span>
                        <input
                          className="w-full bg-[#f1f5f0] dark:bg-[#22301d] border-none rounded-lg py-2 pl-6 pr-2 text-sm text-text-main dark:text-white font-bold"
                          type="text"
                          // value="0"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                          ₹
                        </span>
                        <input
                          className="w-full bg-[#f1f5f0] dark:bg-[#22301d] border-none rounded-lg py-2 pl-6 pr-2 text-sm text-text-main dark:text-white font-bold"
                          type="text"
                          // value="2500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-main dark:text-white mb-5 flex items-center justify-between">
                    Brands
                    <BadgeCheck className="material-symbols-outlined text-text-muted text-[20px]" />
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="form-checkbox size-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-transparent focus:ring-primary focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">
                        Urban Glide
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        // checked=""
                        className="form-checkbox size-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-transparent focus:ring-primary focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">
                        Tesla Cycles
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="form-checkbox size-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-transparent focus:ring-primary focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">
                        Volt Motors
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="form-checkbox size-4 text-primary rounded border-gray-300 dark:border-gray-600 bg-transparent focus:ring-primary focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span className="text-sm text-text-muted dark:text-gray-400 group-hover:text-text-main dark:group-hover:text-white transition-colors">
                        AeroSmart
                      </span>
                    </label>
                  </div>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary to-green-600 text-primary-content text-center mt-8">
                  <span className="material-symbols-outlined text-4xl mb-2">
                    bolt
                  </span>
                  <h4 className="font-bold text-lg mb-2">Power Up!</h4>
                  <p className="text-sm opacity-90 mb-4">
                    Get 20% off on all batteries this week.
                  </p>
                  <button className="bg-black/20 hover:bg-black/30 w-full py-2 rounded-lg text-sm font-bold transition-colors">
                    View Deals
                  </button>
                </div>
              </aside>
              <div className="flex-1">
                <div className="lg:hidden mb-6">
                  <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-full text-sm font-bold whitespace-nowrap">
                      All
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-full text-sm font-medium whitespace-nowrap">
                      Cycles
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-full text-sm font-medium whitespace-nowrap">
                      Batteries
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-full text-sm font-medium whitespace-nowrap">
                      Parts
                    </button>
                  </div>
                  <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[#1a2c15] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm text-text-main dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-[#22301d] transition-colors">
                    <span className="material-symbols-outlined">tune</span>
                    Filter Products
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1a2c15] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
                    Showing{" "}
                    <span className="font-bold text-text-main dark:text-white">
                      1-9
                    </span>{" "}
                    of 48 products
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-muted dark:text-gray-400 whitespace-nowrap">
                        Sort by:
                      </span>
                      <select className="bg-transparent border-none text-sm font-bold text-text-main dark:text-white focus:ring-0 cursor-pointer py-1 pl-2 pr-8">
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest Arrivals</option>
                      </select>
                    </div>
                    <div className="flex gap-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                      <button className="p-1 rounded text-primary bg-primary/10">
                        <LayoutGrid className="material-symbols-outlined text-[20px]" />
                      </button>
                      <button className="p-1 rounded text-text-muted dark:text-gray-500 hover:text-text-main dark:hover:text-white transition-colors">
                        <List className="material-symbols-outlined text-[20px]" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Urban Glide X1
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Electric Cycle
                        </span>
                        <span className="font-bold text-lg">₹1,299</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCp_CS7nsjkCFk_kMALm_Lx3NEOsUgoGM69TUwWUxYOa9xa3MXrkjHZCdpnbqifRzjy3gZqxXnlQeKQxl1njKbSUvZiB--HQB2e8grFIwoamV_URXkfUDF2MDAMHbttGqdLf28aCRpvzm9--3MrCJju5sadvFSQ_Qjub80RYyyWN_W6XgbwcvMAnrRaCa-gs8QZCvlUXPdMEuNuwYp83wg8dqdLruhEF_0dtEWB66Zmd_8cSNi6Bj-B-05P-mmVEEmwPcM6roNvPT5F)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -15%
                      </span>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Li-Pro 48V Battery
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Components
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-lg text-red-500">
                            ₹296
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹349
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAmlGQ-AjvRxIue5m-4_jlknyuCAEYQbwYH78T_YxSPg_LjnwQ3P4E_whT0n_ZASJFauiboMzBKHRvvtQN-HRcpq9yWZ89cUqNQjntqWcCoMZIFa5wOPtd8PNohB1UKuBrNxDrVQvzQqEahmDL7flCmRRMxrbY8yF3-CnQkkHYG2jeUbsaMUF6L0jPeTuzBQVJFDtBcnkKDOWQcNeh4aLADxHfFicVcCX46Iul8TgujSbCxsgYuN75h9MfEoZ8Q-mPnbWmCJgE_vhrm)",
                        }}
                      ></div>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        AeroSmart Helmet
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Accessories
                        </span>
                        <span className="font-bold text-lg">₹120</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAex8OTOjELNQig8GrwSbh22EM-y8l6ASSZcm_jjTmz9s3r0saW7MVMrCBxrImdj3VuMKSDIlIHEfWWxk9KO0r39KCmKDFvvjNHJC6WunwTuVStzfeX4bmdjKffEKpkv8f3v0ZIkcztdrpJZ1QAEn2EnsVLRXqHBEueOZlel5ua0gD_7FBM4ZJfNJ7819gw1ZdD_9_byInbrR5k86rZwHdomicN6kJEEsTjWpjugeKrrdgqfn6ChCYh_US_OhOLJJGdOU1rUwWwMeaW)",
                        }}
                      ></div>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        All-Terrain Tires
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Spares
                        </span>
                        <span className="font-bold text-lg">₹45</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                          filter: " hue-rotate(45deg)",
                        }}
                      ></div>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Pro Controller
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Components
                        </span>
                        <span className="font-bold text-lg">₹189</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            " url(https://lh3.googleusercontent.com/aida-public/AB6AXuAex8OTOjELNQig8GrwSbh22EM-y8l6ASSZcm_jjTmz9s3r0saW7MVMrCBxrImdj3VuMKSDIlIHEfWWxk9KO0r39KCmKDFvvjNHJC6WunwTuVStzfeX4bmdjKffEKpkv8f3v0ZIkcztdrpJZ1QAEn2EnsVLRXqHBEueOZlel5ua0gD_7FBM4ZJfNJ7819gw1ZdD_9_byInbrR5k86rZwHdomicN6kJEEsTjWpjugeKrrdgqfn6ChCYh_US_OhOLJJGdOU1rUwWwMeaW)",
                          filter: " grayscale(100%)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                        SOLD OUT
                      </span>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-gray-500/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center cursor-not-allowed text-white"
                          title="Out of stock"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            block
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        City Slicker Tires
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Spares
                        </span>
                        <span className="font-bold text-lg">₹38</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                        }}
                      ></div>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Carbon Fork - Matte
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Components
                        </span>
                        <span className="font-bold text-lg">₹249</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8)",
                          filter: "contrast(110%) brightness(90%)",
                        }}
                      ></div>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Urban Glide X1 Pro
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Electric Cycle
                        </span>
                        <span className="font-bold text-lg">₹1,899</span>
                      </div>
                    </div>
                  </div>
                  <div className="group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmlGQ-AjvRxIue5m-4_jlknyuCAEYQbwYH78T_YxSPg_LjnwQ3P4E_whT0n_ZASJFauiboMzBKHRvvtQN-HRcpq9yWZ89cUqNQjntqWcCoMZIFa5wOPtd8PNohB1UKuBrNxDrVQvzQqEahmDL7flCmRRMxrbY8yF3-CnQkkHYG2jeUbsaMUF6L0jPeTuzBQVJFDtBcnkKDOWQcNeh4aLADxHfFicVcCX46Iul8TgujSbCxsgYuN75h9MfEoZ8Q-mPnbWmCJgE_vhrm")',
                          filter: "hue-rotate(180deg)",
                        }}
                      ></div>
                      <span className="absolute top-3 left-3 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                      <button className="absolute top-3 right-3 size-8 rounded-full bg-white/50 backdrop-blur dark:bg-black/50 hover:bg-white dark:hover:bg-black flex items-center justify-center text-text-main dark:text-white transition-colors">
                        <Heart className="material-symbols-outlined text-[18px]" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-4 justify-end">
                        <button
                          className="size-10 bg-white/90 backdrop-blur dark:bg-black/80 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 transition-all text-text-main dark:text-white"
                          title="Quick View"
                        >
                          <Eye className="material-symbols-outlined text-[20px]" />
                        </button>
                        <button
                          className="size-10 bg-primary/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:scale-105 transition-all text-primary-content"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="material-symbols-outlined text-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-bold text-text-main dark:text-white truncate">
                        Smart Helmet Blue
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-text-muted dark:text-gray-400 text-sm">
                          Accessories
                        </span>
                        <span className="font-bold text-lg">₹145</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    disabled=""
                  >
                    <ChevronLeft className="material-symbols-outlined text-gray-600 dark:text-gray-300" />
                  </button>
                  <button className="size-10 rounded-lg bg-primary text-primary-content font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                    1
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-medium flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    2
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-medium flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    3
                  </button>
                  <span className="flex items-end px-2 text-gray-400">...</span>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 text-text-main dark:text-white font-medium flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    8
                  </button>
                  <button className="size-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronRight className="material-symbols-outlined text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full bg-[#131811] dark:bg-black text-white py-16">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-lg">
                      build
                    </span>
                    Compatibility Check
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Find parts that fit your ride perfectly.
                  </h2>
                  <p className="text-gray-400">
                    Select your electric vehicle brand and model to see a
                    curated list of compatible batteries, tires, and
                    accessories. No more guessing.
                  </p>
                </div>
                <div className="w-full md:w-auto bg-[#1a2c15] p-6 rounded-xl border border-gray-800 shadow-2xl flex flex-col gap-4 min-w-[320px] lg:min-w-[400px]">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Select Brand
                    </label>
                    <div className="relative">
                      <select className="block w-full rounded-lg bg-[#2a3825] border-gray-700 text-white focus:ring-primary focus:border-primary">
                        <option>Tesla Cycles</option>
                        <option>Urban Glide</option>
                        <option>Volt Motors</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Select Model
                    </label>
                    <div className="relative">
                      <select className="block w-full rounded-lg bg-[#2a3825] border-gray-700 text-white focus:ring-primary focus:border-primary">
                        <option>Model X1</option>
                        <option>City Cruiser</option>
                        <option>Mountain Pro</option>
                      </select>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-3 bg-primary hover:bg-[#3ce00b] text-primary-content font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    Find Parts
                    <span className="material-symbols-outlined text-[18px]">
                      search
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
    </div>
  );
}
