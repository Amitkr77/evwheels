"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setUser(data);
        setForm({ name: data.name || "", phone: data.phone || "" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save changes");
      }
      const updated = await res.json();
      setUser(updated);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-12">
        Profile
      </h1>

      <div className="bg-white border border-neutral-200/70 rounded-xl p-10 md:p-12">
        {/* Avatar + name header */}
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-12">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-800 rounded-2xl flex items-center justify-center text-white font-['Playfair_Display'] text-4xl font-medium shadow-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium mb-1">
              {user?.name}
            </div>
            <div className="text-neutral-600 font-light">
              {user?.email}
              {user?.phone && <span className="ml-2">• {user.phone}</span>}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-8 px-4 py-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Email <span className="text-neutral-400 font-light">(cannot be changed)</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-5 py-4 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-12 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
