import React from "react";
import {
  BadgeCheck,
  Zap,
  Bike,
  Battery,
  ShoppingBag,
  Settings,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Eye,
  ShoppingCart,
  CheckCircle2Icon,
  Truck,
  Lock,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <main className="flex-grow">
        <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-900 group">
            <div className="absolute inset-0 w-full h-full">
              <video
                autoPlay=""
                className="w-full h-full object-cover opacity-90"
                loop=""
                muted=""
                playsInline=""
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-riding-a-bike-through-the-city-streets-4157-large.mp4"
                  type="video/mp4"
                />
                <img
                  alt="Cycling fallback image"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFLheHY9EkKx8Ci0y-0xtrdiFfAFrLlodR0UT0EF3YnSWMYUC2S58VoOSeqxgvI_AS3VJ-8b2QPQBLI1fEiELJoyVDzxvBAdQNQT8ffv2Ta56QZHL2SCkm6D_gd9N2zPqc6l-6teHVN3kpNbNfSKl2XYh0JMXU-d8JeO1jBw0_Cc71bS0YQVlpMvjRh2KRqoqSdqcQvcfiJYvfAK7yFCSww_I8AdyYncdUfnkxaWBcIRM3xuwLLdX81VzT0LbV6o7ad48XXTtKc69Q"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
            </div>
            <div className="relative z-20 px-6 md:px-12 lg:px-16 py-16 md:py-24 max-w-2xl flex flex-col gap-6 items-start">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                Power Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#7cfc52]">
                  Next Ride.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium">
                Premium electric cycles and verified compatible parts for every
                journey. Experience the future of personal mobility with
                EvWheels.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="h-12 px-8 rounded-lg bg-primary hover:bg-[#3ce00b] text-primary-content font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2 group/btn-primary">
                  Shop Cycles
                  <ArrowRight className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover/btn-primary:translate-x-1" />
                </button>
                <button className="h-12 px-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 text-white font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg hover:shadow-white/5">
                  Explore Accessories
                </button>
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="material-symbols-outlined text-primary text-xl" />
                  <span className="font-semibold">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="material-symbols-outlined text-primary text-[20px]" />
                  <span className="font-semibold">Fast Charging</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <a
              className="text-sm font-bold text-primary hover:text-green-600 flex items-center gap-1"
              href="#"
            >
              View all{" "}
              <ArrowRight className="material-symbols-outlined text-[16px]" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              href="#"
            >
              <div className="p-4 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] group-hover:bg-primary/20 transition-colors">
                <Bike className="material-symbols-outlined text-4xl text-text-main dark:text-white group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-bold text-lg">Cycles</h3>
            </a>
            <a
              className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              href="#"
            >
              <div className="p-4 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] group-hover:bg-primary/20 transition-colors">
                <Battery className="material-symbols-outlined text-4xl text-text-main dark:text-white group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-bold text-lg">Batteries</h3>
            </a>
            <a
              className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              href="#"
            >
              <div className="p-4 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] group-hover:bg-primary/20 transition-colors">
                <Settings className="material-symbols-outlined text-4xl text-text-main dark:text-white group-hover:text-primary transition-all duration-300 group-hover:rotate-12" />
              </div>
              <h3 className="font-bold text-lg">Spare Parts</h3>
            </a>
            <a
              className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              href="#"
            >
              <div className="p-4 rounded-full bg-[#f1f5f0] dark:bg-[#22301d] group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="material-symbols-outlined text-4xl text-text-main dark:text-white group-hover:text-primary transition-all duration-300 group-hover:-rotate-12" />
              </div>
              <h3 className="font-bold text-lg">Accessories</h3>
            </a>
          </div>
        </section>
        <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Products
            </h2>
            <div className="flex gap-2">
              <button className="size-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="material-symbols-outlined text-gray-600 dark:text-gray-300" />
              </button>
              <button className="size-10 rounded-full bg-primary text-primary-content flex items-center justify-center hover:bg-[#3ce00b] transition-colors shadow-lg shadow-primary/20">
                <ArrowRight className="material-symbols-outlined" />
              </button>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth">
            <div className="min-w-[280px] sm:min-w-[300px] snap-start group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/5] sm:aspect-square bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Side profile of a sleek white electric bicycle"
                  style={{
                    backgroundImage: ` url(
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8"
                    )`,
                  }}
                ></div>
                <span className="absolute top-3 left-3 bg-primary text-primary-content text-xs font-bold px-2 py-1 rounded">
                  NEW
                </span>
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
            <div className="min-w-[280px] sm:min-w-[300px] snap-start group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/5] sm:aspect-square bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Close up of an electric bike lithium ion battery pack"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCp_CS7nsjkCFk_kMALm_Lx3NEOsUgoGM69TUwWUxYOa9xa3MXrkjHZCdpnbqifRzjy3gZqxXnlQeKQxl1njKbSUvZiB--HQB2e8grFIwoamV_URXkfUDF2MDAMHbttGqdLf28aCRpvzm9--3MrCJju5sadvFSQ_Qjub80RYyyWN_W6XgbwcvMAnrRaCa-gs8QZCvlUXPdMEuNuwYp83wg8dqdLruhEF_0dtEWB66Zmd_8cSNi6Bj-B-05P-mmVEEmwPcM6roNvPT5F")`,
                  }}
                ></div>
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
                  <span className="font-bold text-lg">₹349</span>
                </div>
              </div>
            </div>
            <div className="min-w-[280px] sm:min-w-[300px] snap-start group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/5] sm:aspect-square bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Modern bicycle helmet on a table"
                  style={{
                    backgroundImage: `url(
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmlGQ-AjvRxIue5m-4_jlknyuCAEYQbwYH78T_YxSPg_LjnwQ3P4E_whT0n_ZASJFauiboMzBKHRvvtQN-HRcpq9yWZ89cUqNQjntqWcCoMZIFa5wOPtd8PNohB1UKuBrNxDrVQvzQqEahmDL7flCmRRMxrbY8yF3-CnQkkHYG2jeUbsaMUF6L0jPeTuzBQVJFDtBcnkKDOWQcNeh4aLADxHfFicVcCX46Iul8TgujSbCxsgYuN75h9MfEoZ8Q-mPnbWmCJgE_vhrm"
                    )`,
                  }}
                ></div>
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
            <div className="min-w-[280px] sm:min-w-[300px] snap-start group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/5] sm:aspect-square bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Close up of durable off-road bicycle tires"
                  style={{
                    backgroundImage: ` url("https://lh3.googleusercontent.com/aida-public/AB6AXuAex8OTOjELNQig8GrwSbh22EM-y8l6ASSZcm_jjTmz9s3r0saW7MVMrCBxrImdj3VuMKSDIlIHEfWWxk9KO0r39KCmKDFvvjNHJC6WunwTuVStzfeX4bmdjKffEKpkv8f3v0ZIkcztdrpJZ1QAEn2EnsVLRXqHBEueOZlel5ua0gD_7FBM4ZJfNJ7819gw1ZdD_9_byInbrR5k86rZwHdomicN6kJEEsTjWpjugeKrrdgqfn6ChCYh_US_OhOLJJGdOU1rUwWwMeaW")`,
                  }}
                ></div>
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
            <div className="min-w-[280px] sm:min-w-[300px] snap-start group flex flex-col rounded-xl bg-white dark:bg-[#1a2c15] border border-[#dee6db] dark:border-[#2a3825] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/5] sm:aspect-square bg-[#f8faf7] dark:bg-[#22301d] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Electric cycle frame close up"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFzqZFXKzVgMDOLLTsLmCFJu4GVqFxG_DjPmZ1KSeaooGF8hLMiYOBJuR9Wwfm1zkYTYo3o4L_6d0a4HO9-ky8bumPxZ8xrg7QQuK2UVQhTrwxhbgWz2AdyVnZMbadvFNEyI7dWjYChUxg-L3lDMZuILiFl5iCWtYCKN_dWy_uyz0uyEPmBorJoMIxFvt0SG1e0dGLPaUxdTzOxzGyDjhgdMMfTYz7JoTORdb0673gZDQJKYgP4IbEVZESyfBhyuMHsyUAXEisYCG8"); filter: hue-rotate(45deg);'`,
                  }}
                ></div>
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
          </div>
        </section>
        <section className="mt-12 w-full bg-[#131811] dark:bg-black text-white py-16">
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
                  Select your electric vehicle brand and model to see a curated
                  list of compatible batteries, tires, and accessories. No more
                  guessing.
                </p>
              </div>
              <div className="w-full md:w-auto bg-[#1a2c15] p-6 rounded-xl border border-gray-800 shadow-2xl flex flex-col gap-4 min-w-[320px] lg:min-w-[400px]">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Select Brand
                  </label>
                  <div className="relative">
                    <select className="block w-full rounded-lg bg-[#2a3825] border-gray-700 text-white focus:ring-primary focus:border-primary p-2">
                      <option className=" ">Tesla Cycles</option>
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
                    <select className="block w-full rounded-lg bg-[#2a3825] border-gray-700 text-white focus:ring-primary focus:border-primary p-2">
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
                  <CheckCircle2Icon className="material-symbols-outlined text-2xl" />
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
  );
}
