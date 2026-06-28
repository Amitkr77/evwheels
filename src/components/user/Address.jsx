"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Star } from "lucide-react";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load addresses");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAdd = async () => {
    if (!form.fullName || !form.phone || !form.addressLine || !form.city || !form.state || !form.postalCode) {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save address");
      }
      await fetchAddresses();
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
          Addresses
        </h1>
        <button
          onClick={() => { setShowForm(true); setError(null); setForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#DDF8FD] border-t-[#19B5D8] rounded-full animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <p className="text-neutral-500 text-center py-16">
          No saved addresses. Add one to speed up checkout.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white border border-neutral-200/70 rounded-xl p-8 hover:border-[#19B5D8]/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-xs font-medium px-2.5 py-0.5 bg-[#DDF8FD] text-[#19B5D8] rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {addr.addressLine}, {addr.city}, {addr.state} – {addr.postalCode}
                  </p>
                  <p className="text-neutral-600 text-sm mt-1">{addr.country}</p>
                  <p className="text-neutral-600 text-sm mt-1">{addr.phone}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#19B5D8] hover:text-[#19B5D8] transition-colors"
                  >
                    <Star size={14} />
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors ml-auto"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-8">
              Add New Address
            </h2>

            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">Address Line *</label>
                <textarea
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House no, Building, Street, Area"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5">PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1.5">State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors bg-white"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-neutral-300 text-[#19B5D8] focus:ring-[#19B5D8]"
                />
                <label htmlFor="isDefault" className="text-sm text-neutral-600 cursor-pointer">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setShowForm(false); setError(null); }}
                className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 py-3.5 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
