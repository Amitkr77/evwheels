"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Edit2, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  minOrderAmount: 0,
  expiryDate: "",
  usageLimit: "",
  isActive: true,
};

export default function CouponsPage() {
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", { credentials: "include" });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Coupons fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setFormData({ ...EMPTY_FORM });
    setError("");
    setShowCreateModal(true);
  };

  const openEdit = (coupon) => {
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue ?? 0,
      minOrderAmount: coupon.minOrderAmount ?? 0,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.slice(0, 10) : "",
      usageLimit: coupon.usageLimit ?? "",
      isActive: coupon.isActive ?? true,
    });
    setError("");
    setEditCoupon(coupon);
  };

  const validateForm = () => {
    if (!formData.code.trim()) return "Code is required.";
    if (!formData.expiryDate) return "Expiry date is required.";
    if (new Date(formData.expiryDate) <= new Date()) return "Expiry date must be in the future.";
    const value = Number(formData.discountValue);
    if (isNaN(value) || value < 0) return "Discount value must be a positive number.";
    if (formData.discountType === "percentage" && value > 100) return "Percentage discount cannot exceed 100.";
    if (formData.usageLimit !== "" && Number(formData.usageLimit) < 1) return "Usage limit must be at least 1.";
    return "";
  };

  const handleCreate = async () => {
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          expiryDate: formData.expiryDate,
          usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : undefined,
          isActive: formData.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create coupon."); return; }
      setCoupons((prev) => [data, ...prev]);
      setShowCreateModal(false);
      showToast("Coupon created successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/coupons?id=${editCoupon._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount) || 0,
          expiryDate: formData.expiryDate,
          usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : undefined,
          isActive: formData.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update coupon."); return; }
      setCoupons((prev) => prev.map((c) => (c._id === editCoupon._id ? data : c)));
      setEditCoupon(null);
      showToast("Coupon updated successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (coupon) => {
    const ok = await confirmDialog({
      title: "Delete Coupon",
      message: (
        <>
          Delete coupon <span className="font-mono font-semibold">{coupon.code}</span>?
          This action cannot be undone.
        </>
      ),
      confirmLabel: "Delete",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${coupon._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete coupon");
      }
      setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));
      showToast("Coupon deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.message, "error");
    }
  };

  const renderForm = (onSubmit, submitLabel) => (
    <div className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors uppercase font-mono"
          placeholder="SAVE10"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Type</label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Value</label>
          <input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
            placeholder="20"
            min="0"
            max={formData.discountType === "percentage" ? 100 : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Min Order (₹)</label>
          <input
            type="number"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
            placeholder="1000"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Usage Limit</label>
          <input
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Expiry Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={formData.isActive}
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
            formData.isActive ? "bg-[#19B5D8]" : "bg-neutral-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              formData.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm font-medium text-neutral-700">
          {formData.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          onClick={() => { setShowCreateModal(false); setEditCoupon(null); }}
          disabled={submitting}
          className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-4 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-medium">Coupons</h1>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>

        {loading ? (
          <p className="text-neutral-500 py-10 text-center">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <div className="border border-neutral-200/60 rounded-xl py-20 text-center text-neutral-500">
            No coupons yet. Create your first coupon above.
          </div>
        ) : (
          <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50/70">
                  <tr>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Code</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Type</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Value</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Min Order</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Expires</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Used</th>
                    <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                    <th className="py-5 px-6 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-5 px-6 font-mono font-semibold text-neutral-900">{coupon.code}</td>
                      <td className="py-5 px-6">
                        <span className="px-3 py-1 text-xs font-medium bg-neutral-100 rounded-full">
                          {coupon.discountType === "percentage" ? "Percentage" : "Fixed ₹"}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-medium">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="py-5 px-6 text-neutral-600">
                        {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : "—"}
                      </td>
                      <td className="py-5 px-6 text-neutral-600">
                        {coupon.expiryDate
                          ? new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-5 px-6 text-neutral-700">
                        {coupon.usedCount ?? 0}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            coupon.isActive
                              ? "bg-[#DDF8FD] text-[#19B5D8]"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(coupon)}
                            className="text-neutral-500 hover:text-[#19B5D8] transition-colors"
                            title="Edit coupon"
                          >
                            <Edit2 size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            className="text-neutral-500 hover:text-red-600 transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">Create Coupon</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleCreate, "Create Coupon")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editCoupon && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">Edit Coupon</h2>
                <button
                  onClick={() => setEditCoupon(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleUpdate, "Update Coupon")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
