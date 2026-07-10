"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Tag,
  AlertTriangle,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
};

export default function SubcategoriesPage() {
  // ─── Data state ───
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ─── UI state ───
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // ─── Filter / search / sort state ───
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState("sortOrder");
  const [sortDir, setSortDir] = useState("asc");

  // ─── Form state ───
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // ─── Fetch subcategories ───
  const fetchSubcategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subcategories?active=false");
      const data = await res.json();
      setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error("Subcategories fetch error:", err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch categories (for dropdowns) ───
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories?active=false");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, [fetchSubcategories, fetchCategories]);

  // ─── Filtered & sorted subcategories ───
  const displayed = useMemo(() => {
    let list = [...subcategories];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.name?.toLowerCase().includes(q));
    }

    // Category filter
    if (categoryFilter) {
      list = list.filter(
        (s) =>
          s.category?._id === categoryFilter || s.category === categoryFilter
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA, valB;
      if (sortField === "name") {
        valA = a.name?.toLowerCase() || "";
        valB = b.name?.toLowerCase() || "";
      } else if (sortField === "sortOrder") {
        valA = a.sortOrder ?? 0;
        valB = b.sortOrder ?? 0;
      } else if (sortField === "createdAt") {
        valA = new Date(a.createdAt || 0).getTime();
        valB = new Date(b.createdAt || 0).getTime();
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [subcategories, searchQuery, categoryFilter, sortField, sortDir]);

  // ─── Sort toggle handler ───
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ─── Sort icon renderer ───
  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown size={14} className="text-neutral-400" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-[#19B5D8]" />
    ) : (
      <ChevronDown size={14} className="text-[#19B5D8]" />
    );
  };

  // ─── Toggle active/inactive ───
  const handleToggleActive = async (item) => {
    const newStatus = !item.isActive;
    // Optimistic update
    setSubcategories((prev) =>
      prev.map((s) =>
        s._id === item._id ? { ...s, isActive: newStatus } : s
      )
    );
    try {
      const res = await fetch(`/api/subcategories/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update status");
      }
      const updated = await res.json();
      setSubcategories((prev) =>
        prev.map((s) => (s._id === item._id ? updated.subcategory || updated : s))
      );
    } catch (err) {
      // Revert optimistic update
      setSubcategories((prev) =>
        prev.map((s) =>
          s._id === item._id ? { ...s, isActive: item.isActive } : s
        )
      );
      console.error("Toggle active error:", err);
      alert("Error updating status: " + err.message);
    }
  };

  // ─── Create subcategory ───
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.category) {
      alert("Name and Category are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive,
          sortOrder: Number(formData.sortOrder) || 0,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create subcategory");
      }
      const created = await res.json();
      setSubcategories((prev) => [created.subcategory || created, ...prev]);
      setShowCreateModal(false);
      setFormData({ ...EMPTY_FORM });
    } catch (err) {
      console.error("Create error:", err);
      alert("Error creating subcategory: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update subcategory ───
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.category) {
      alert("Name and Category are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/subcategories/${editItem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive,
          sortOrder: Number(formData.sortOrder) || 0,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update subcategory");
      }
      const updated = await res.json();
      setSubcategories((prev) =>
        prev.map((s) => (s._id === editItem._id ? updated.subcategory || updated : s))
      );
      setEditItem(null);
      setFormData({ ...EMPTY_FORM });
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating subcategory: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete subcategory ───
  const handleDelete = async (id) => {
    setDeleteError("");
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete subcategory");
      }
      setSubcategories((prev) => prev.filter((s) => s._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError(err.message);
    }
  };

  // ─── Open edit modal ───
  const openEdit = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || "",
      category: item.category?._id || item.category || "",
      description: item.description || "",
      image: item.image || "",
      isActive: item.isActive ?? true,
      sortOrder: item.sortOrder ?? 0,
    });
  };

  // ─── Helper: get category name from subcategory item ───
  const getCategoryName = (item) => {
    if (item.category?.name) return item.category.name;
    const cat = categories.find(
      (c) => c._id === item.category || c._id === item.category?._id
    );
    return cat?.name || "—";
  };

  // ─── Render: modal form ───
  const renderForm = (onSubmit, submitLabel) => (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          placeholder="e.g. Mountain Bikes"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full h-28 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors resize-none"
          placeholder="Optional description..."
        />
      </div>

      {/* Image */}
      <ImageUploadField
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        type="subcategory"
        label="Image"
        previewClassName="mt-3 max-h-36 rounded-lg border border-neutral-200/60"
      />

      {/* Sort Order */}
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Sort Order
        </label>
        <input
          type="number"
          value={formData.sortOrder}
          onChange={(e) =>
            setFormData({
              ...formData,
              sortOrder: e.target.value,
            })
          }
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          placeholder="0"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={formData.isActive}
          onClick={() =>
            setFormData({ ...formData, isActive: !formData.isActive })
          }
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#19B5D8] focus:ring-offset-2 ${
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

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => {
            setShowCreateModal(false);
            setEditItem(null);
            setFormData({ ...EMPTY_FORM });
          }}
          className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-4 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );

  // ─── Render: loading skeleton ───
  const renderLoading = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            {["Name", "Category", "Slug", "Status", "Sort Order", ""].map(
              (h) => (
                <th
                  key={h}
                  className="py-5 px-6 text-left text-sm font-medium text-neutral-600"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              {[...Array(6)].map((_, j) => (
                <td key={j} className="py-6 px-6">
                  <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Render: empty state ───
  const renderEmpty = () => (
    <div className="border border-neutral-200/60 rounded-xl py-20 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
        <Tag size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-xl font-medium text-neutral-800 mb-2">
        No subcategories found
      </h3>
      <p className="text-neutral-500 text-sm max-w-sm">
        {searchQuery || categoryFilter
          ? "Try adjusting your search or filter criteria."
          : "Create your first subcategory to organize products within categories."}
      </p>
    </div>
  );

  // ─── Render: table ───
  const renderTable = () => {
    if (loading) return renderLoading();
    if (displayed.length === 0) return renderEmpty();

    return (
      <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th
                  className="py-5 px-6 text-left text-sm font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-900 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Name <SortIcon field="name" />
                  </span>
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Category
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Slug
                </th>
                <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                  Status
                </th>
                <th
                  className="py-5 px-6 text-left text-sm font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-900 transition-colors"
                  onClick={() => handleSort("sortOrder")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Sort Order <SortIcon field="sortOrder" />
                  </span>
                </th>
                <th className="py-5 px-6 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {displayed.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  {/* Name */}
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      {sub.image ? (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 flex-shrink-0">
                          <Tag size={16} />
                        </div>
                      )}
                      <span className="font-medium truncate max-w-[200px]">
                        {sub.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 text-xs font-medium bg-[#DDF8FD] text-[#19B5D8] rounded-full">
                      {getCategoryName(sub)}
                    </span>
                  </td>

                  {/* Slug */}
                  <td className="py-6 px-6 text-neutral-500 text-sm font-mono">
                    {sub.slug || "—"}
                  </td>

                  {/* Status toggle */}
                  <td className="py-6 px-6">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={sub.isActive ?? true}
                      aria-label={`Toggle ${sub.name} active status`}
                      onClick={() => handleToggleActive(sub)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#19B5D8] focus:ring-offset-2 ${
                        sub.isActive !== false
                          ? "bg-[#19B5D8]"
                          : "bg-neutral-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          sub.isActive !== false
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Sort Order */}
                  <td className="py-6 px-6 text-sm font-medium text-neutral-700">
                    {sub.sortOrder ?? 0}
                  </td>

                  {/* Actions */}
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(sub)}
                        className="text-[#19B5D8] hover:text-[#19B5D8] transition-colors"
                        aria-label={`Edit ${sub.name}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteError("");
                          setDeleteConfirm(sub);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Delete ${sub.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium">
              Subcategories
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              {subcategories.length} total subcategories
              {categoryFilter && ` · Filtered: ${displayed.length}`}
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ ...EMPTY_FORM });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Plus size={18} />
            Add Subcategory
          </button>
        </div>

        {/* ─── Filters bar ─── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subcategories..."
              className="w-full pl-11 pr-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-[#19B5D8] transition-colors text-sm min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ─── Table ─── */}
        {renderTable()}
      </motion.div>

      {/* ─── Create Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">
                  New Subcategory
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ ...EMPTY_FORM });
                  }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleCreate, "Create Subcategory")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Edit Modal ─── */}
      <AnimatePresence>
        {editItem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">
                  Edit Subcategory
                </h2>
                <button
                  onClick={() => {
                    setEditItem(null);
                    setFormData({ ...EMPTY_FORM });
                  }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleUpdate, "Update Subcategory")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-900">
                    Delete Subcategory
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-neutral-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteConfirm.name}</span>?
              </p>

              {deleteError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    setDeleteError("");
                  }}
                  className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
