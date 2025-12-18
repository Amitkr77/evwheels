import { Search, ShoppingCart, User, Zap } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-[#e5eadd] dark:border-[#2a3825]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
              <Zap className="w-5 h-5 fill-current"/>
            </div>
            <h2 className="text-text-main dark:text-white text-xl font-bold tracking-tight">
              EvWheels
            </h2>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full text-text-muted dark:text-gray-400 focus-within:text-text-main dark:focus-within:text-white">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-[20px]"/>
                  
              </div>
              <input
                className="block w-full rounded-lg bg-[#f1f5f0] dark:bg-[#22301d] border-none py-2.5 pl-10 pr-3 text-sm placeholder:text-text-muted/70 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-[#1a2c15] transition-all"
                placeholder="Search cycles, batteries, parts..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              <a
                className="text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Shop
              </a>
              <a
                className="text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Parts
              </a>
              <a
                className="text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Support
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#22301d] rounded-lg transition-colors group">
                <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors"/>
                  
                <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#22301d] rounded-lg transition-colors group">
                <User className="w-5 h-5 group-hover:text-primary transition-colors"/>
                  
              </button>
              <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#22301d] rounded-lg">
                <span className="w-5 h-5">menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
