"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Edit2 } from "lucide-react";

export default function page() {
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    expiryDate: "",
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Add a coupon
  const handleAddCoupon = async () => {
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      setCoupons((prev) => [...prev, data]);
      setShowAddCoupon(false);
      setNewCoupon({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: 0,
        expiryDate: "",
      });
    } catch (err) {
      console.error("Add coupon error:", err);
    }
  };

  // Delete a coupon
  const handleDeleteCoupon = async (id, code) => {
    if (!confirm(`Delete ${code}?`)) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete coupon error:", err);
    }
  };

  // Update a coupon (simple inline editing example)
  const handleUpdateCoupon = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/coupons?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const updatedCoupon = await res.json();
      setCoupons(coupons.map((c) => (c._id === id ? updatedCoupon : c)));
    } catch (err) {
      console.error("Update coupon error:", err);
    }
  };

  // Render Coupons Table
  const renderCouponsTable = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Code
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Type
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Value
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Min Order
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Expires
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Used
            </th>
            <th className="py-5 px-6 w-24"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {coupons.map((coupon) => (
            <tr
              key={coupon._id}
              className="hover:bg-neutral-50/50 transition-colors"
            >
              <td className="py-6 px-6 font-mono text-lg font-medium">
                {coupon.code}
              </td>
              <td className="py-6 px-6">
                <span className="px-3 py-1 text-xs font-medium bg-neutral-100 rounded-full">
                  {coupon.discountType === "percentage"
                    ? "Percentage"
                    : "Fixed ₹"}
                </span>
              </td>
              <td className="py-6 px-6 font-medium">
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue}`}
              </td>
              <td className="py-6 px-6">₹{coupon.minOrderAmount}</td>
              <td className="py-6 px-6 text-neutral-600">
                {coupon.expiryDate}
              </td>
              <td className="py-6 px-6 text-neutral-700">{coupon.used || 0}</td>
              <td className="py-6 px-6 flex gap-2">
                <button
                  onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
                {/* Optional: Inline edit button */}
                <button
                  onClick={() => {
                    const newValue = prompt("Enter new code", coupon.code);
                    if (newValue)
                      handleUpdateCoupon(coupon._id, { code: newValue });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section>
      <motion.div initial="hidden" animate="visible">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Coupons
          </h1>
          <button
            onClick={() => setShowAddCoupon(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>
        {loading ? <p>Loading...</p> : renderCouponsTable()}
      </motion.div>

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-10">
              Create Coupon
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors uppercase"
                  placeholder="SAVE10"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Type
                  </label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountType: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountValue: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        minOrderAmount: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Expiry
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                    }
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowAddCoupon(false)}
                className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoupon}
                className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
