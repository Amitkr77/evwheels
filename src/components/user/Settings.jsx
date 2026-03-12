import React from "react";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      // variants={stagger}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-12">
        Profile
      </h1>

      <div className="bg-white border border-neutral-200/70 rounded-xl p-10 md:p-12">
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-16">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
            <img
              src="https://i.pravatar.cc/128?u=amit"
              alt="Amit"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium mb-2">
              Amit Sharma
            </div>
            <div className="text-neutral-600 font-light">
              amit.sharma@email.com • +91 98765 43210
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Amit Sharma"
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="amit.sharma@email.com"
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Phone
            </label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              City
            </label>
            <input
              type="text"
              defaultValue="Patna"
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
        </div>

        <button className="mt-12 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors">
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
