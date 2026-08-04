"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  ArrowUpDown,
  FolderOpen,
  Loader2,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import StatusToggle from "@/components/admin/StatusToggle";

const emptyForm = {
  name: "",
  segment: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
};

export default function CategoriesPage() {
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const [categories, setCategories] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");
  const [sortField, setSortField] = useState("sortOrder");
  const [sortDir, setSortDir] = useState("asc");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);

  // ─── Fetch categories ───
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories?active=false");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Category fetch error:", err);
      showToast("Failed to load categories. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ─── Fetch segments (for dropdowns) ───
  const fetchSegments = useCallback(async () => {
    try {
      const res = await fetch("/api/segments?active=false");
      const data = await res.json();
      setSegments(data.segments || []);
    } catch (err) {
      console.error("Segments fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSegments();
  }, [fetchCategories, fetchSegments]);

  // ─── Filtered & sorted categories ───
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q)
      );
    }

    // Segment filter
    if (segmentFilter) {
      result = result.filter(
        (c) => c.segment?._id === segmentFilter || c.segment === segmentFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case "name":
          valA = a.name?.toLowerCase() || "";
          valB = b.name?.toLowerCase() || "";
          break;
        case "sortOrder":
          valA = a.sortOrder ?? 0;
          valB = b.sortOrder ?? 0;
          break;
        case "createdAt":
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          break;
        default:
          valA = a.sortOrder ?? 0;
          valB = b.sortOrder ?? 0;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [categories, searchQuery, segmentFilter, sortField, sortDir]);

  // ─── Sort toggle ───
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // ─── Toggle active/inactive ───
  const handleToggleActive = async (category) => {
    const newStatus = !category.isActive;

    // Deactivating a category can pull every product under it off the
    // storefront at once — worth a pause. Reactivating only restores
    // visibility, so it can stay a single click.
    if (!newStatus) {
      const ok = await confirmDialog({
        title: "Deactivate Category",
        message: <>Deactivate <strong>{category.name}</strong>? Its products may disappear from the storefront immediately.</>,
        confirmLabel: "Deactivate",
      });
      if (!ok) return;
    }

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) =>
        c._id === category._id ? { ...c, isActive: newStatus } : c
      )
    );

    try {
      const res = await fetch(`/api/categories/${category._id}`, {
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
      setCategories((prev) =>
        prev.map((c) => (c._id === category._id ? updated.category || updated : c))
      );
    } catch (err) {
      // Revert optimistic update
      setCategories((prev) =>
        prev.map((c) =>
          c._id === category._id ? { ...c, isActive: category.isActive } : c
        )
      );
      console.error(err);
      showToast("Error toggling status: " + err.message, "error");
    }
  };

  // ─── Create category ───
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.segment) {
      showToast("Name and Segment are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          segment: formData.segment,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive,
          sortOrder: Number(formData.sortOrder) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create category");
      }

      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setShowCreateModal(false);
      setFormData({ ...emptyForm });
      showToast("Category created successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error creating category: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update category ───
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.segment) {
      showToast("Name and Segment are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${editCategory._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          segment: formData.segment,
          description: formData.description,
          image: formData.image,
          isActive: formData.isActive,
          sortOrder: Number(formData.sortOrder) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update category");
      }

      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c._id === editCategory._id ? updated.category || updated : c))
      );
      setEditCategory(null);
      setFormData({ ...emptyForm });
      showToast("Category updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error updating category: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete category ───
  const handleDelete = async (category) => {
    const ok = await confirmDialog({
      title: "Delete Category",
      message: (
        <>
          Are you sure you want to delete <strong>{category.name}</strong>?
          This action cannot be undone.
        </>
      ),
      confirmLabel: "Delete",
      blocked:
        category.productCount > 0
          ? {
              reason: (
                <>
                  This category has{" "}
                  <strong>
                    {category.productCount} product{category.productCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  assigned to it. Remove or reassign the products first, or
                  deactivate the category instead.
                </>
              ),
            }
          : null,
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c._id !== category._id));
      showToast("Category deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error deleting category: " + err.message, "error");
    }
  };

  // ─── Open edit modal ───
  const openEdit = (category) => {
    setFormData({
      name: category.name || "",
      segment: category.segment?._id || category.segment || "",
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder ?? 0,
    });
    setEditCategory(category);
  };

  // ─── Helper: get segment name from category item ───
  const getSegmentName = (item) => {
    if (item.segment?.name) return item.segment.name;
    const seg = segments.find(
      (s) => s._id === item.segment || s._id === item.segment?._id
    );
    return seg?.name || "—";
  };

  // ─── Sort icon helper ───
  const SortIcon = ({ field }) => (
    <ArrowUpDown
      size={14}
      className={`inline ml-1 ${
        sortField === field
          ? "text-[#19B5D8]"
          : "text-neutral-400"
      }`}
    />
  );

  // ─── Category form (shared for create & edit) ───
  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          placeholder="e.g. Electric Scooters"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Segment <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.segment}
          onChange={(e) =>
            setFormData({ ...formData, segment: e.target.value })
          }
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
        >
          <option value="">Select Segment</option>
          {segments.map((seg) => (
            <option key={seg._id} value={seg._id}>
              {seg.name}
            </option>
          ))}
        </select>
      </div>

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
          placeholder="Brief description of this category..."
        />
      </div>

      <ImageUploadField
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        type="category"
        label="Image"
      />

      <div className="grid grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            Status
          </label>
          <StatusToggle
            size="md"
            checked={formData.isActive}
            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
            ariaLabel="Toggle active status"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => {
            setShowCreateModal(false);
            setEditCategory(null);
            setFormData({ ...emptyForm });
          }}
          disabled={submitting}
          className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={editCategory ? handleUpdate : handleCreate}
          disabled={submitting}
          className="flex-1 py-4 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {editCategory
            ? submitting
              ? "Updating..."
              : "Update Category"
            : submitting
            ? "Creating..."
            : "Create Category"}
        </button>
      </div>
    </div>
  );

  // ─── Loading skeleton ───
  const renderLoading = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            {["Name", "Segment", "Slug", "Products", "Status", "Sort", "Actions"].map(
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
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <td key={j} className="py-6 px-6">
                  <div className="h-4 bg-neutral-100 rounded animate-pulse w-3/4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Empty state ───
  const renderEmpty = () => (
    <div className="bg-white border border-neutral-200/70 rounded-xl p-16 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <FolderOpen size={36} className="text-neutral-400" />
      </div>
      <h3 className="text-xl font-medium text-neutral-800 mb-2">
        No categories yet
      </h3>
      <p className="text-neutral-500 text-sm max-w-sm mb-8">
        Create your first category to start organizing your products.
      </p>
      <button
        onClick={() => {
          setFormData({ ...emptyForm });
          setShowCreateModal(true);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
      >
        <Plus size={18} />
        Create Category
      </button>
    </div>
  );

  // ─── No search results ───
  const renderNoResults = () => (
    <div className="bg-white border border-neutral-200/70 rounded-xl p-12 flex flex-col items-center justify-center text-center">
      <Search size={36} className="text-neutral-300 mb-4" />
      <h3 className="text-lg font-medium text-neutral-700 mb-1">
        No results found
      </h3>
      <p className="text-neutral-500 text-sm">
        No categories match &ldquo;{searchQuery}&rdquo;. Try a different search
        term.
      </p>
    </div>
  );

  // ─── Categories table ───
  const renderTable = () => {
    if (filteredCategories.length === 0 && searchQuery.trim()) {
      return renderNoResults();
    }

    return (
      <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50/70">
            <tr>
              <th
                className="py-5 px-6 text-left text-sm font-medium text-neutral-600 cursor-pointer hover:text-neutral-900 transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                Name <SortIcon field="name" />
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Segment
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Slug
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Products
              </th>
              <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                Status
              </th>
              <th
                className="py-5 px-6 text-left text-sm font-medium text-neutral-600 cursor-pointer hover:text-neutral-900 transition-colors select-none"
                onClick={() => handleSort("sortOrder")}
              >
                Sort <SortIcon field="sortOrder" />
              </th>
              <th className="py-5 px-6 w-28"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {filteredCategories.map((category) => (
              <tr
                key={category._id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 rounded-lg object-cover border border-neutral-200/60 flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-lg bg-neutral-100 items-center justify-center text-neutral-400 text-xs flex-shrink-0 ${
                        category.image ? "hidden" : "flex"
                      }`}
                    >
                      N/A
                    </div>
                    <span className="font-medium text-neutral-900">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="px-3 py-1 text-xs font-medium bg-[#DDF8FD] text-[#19B5D8] rounded-full">
                    {getSegmentName(category)}
                  </span>
                </td>
                <td className="py-5 px-6 text-sm text-neutral-500 font-mono">
                  {category.slug || "—"}
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-medium text-neutral-700">
                    {category.productCount ?? 0}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <StatusToggle
                    checked={category.isActive}
                    onClick={() => handleToggleActive(category)}
                    ariaLabel={`Toggle ${category.name} active status`}
                    title={category.isActive ? "Click to deactivate" : "Click to activate"}
                  />
                </td>
                <td className="py-5 px-6 text-sm text-neutral-600">
                  {category.sortOrder ?? 0}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(category)}
                      className="text-neutral-500 hover:text-[#19B5D8] transition-colors"
                      title="Edit category"
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-neutral-500 hover:text-red-600 transition-colors"
                      title="Delete category"
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
    );
  };

  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-medium">
            Categories
          </h1>
          <button
            onClick={() => {
              setFormData({ ...emptyForm });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Plus size={18} />
            Create Category
          </button>
        </div>

        {/* ─── Search & Info Bar ─── */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-11 pr-5 py-3 border border-neutral-200/70 rounded-lg bg-white focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
                />
              </div>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="px-5 py-3 border border-neutral-200/70 rounded-lg bg-white focus:outline-none focus:border-[#19B5D8] transition-colors text-sm min-w-[200px]"
              >
                <option value="">All Segments</option>
                {segments.map((seg) => (
                  <option key={seg._id} value={seg._id}>
                    {seg.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-neutral-500">
              {filteredCategories.length} of {categories.length} categories
            </p>
          </div>
        )}

        {/* ─── Table / Loading / Empty ─── */}
        {loading
          ? renderLoading()
          : categories.length === 0
          ? renderEmpty()
          : renderTable()}
      </motion.div>

      {/* ─── Create Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-create-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 id="category-create-title" className="text-3xl font-medium">
                  Create Category
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ ...emptyForm });
                  }}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Edit Modal ─── */}
      <AnimatePresence>
        {editCategory && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-edit-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 id="category-edit-title" className="text-3xl font-medium">
                  Edit Category
                </h2>
                <button
                  onClick={() => {
                    setEditCategory(null);
                    setFormData({ ...emptyForm });
                  }}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
