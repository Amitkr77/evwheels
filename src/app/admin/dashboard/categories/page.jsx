"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  FolderOpen,
  Loader2,
} from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("sortOrder");
  const [sortDir, setSortDir] = useState("asc");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      alert("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
  }, [categories, searchQuery, sortField, sortDir]);

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
      alert("Error toggling status: " + err.message);
    }
  };

  // ─── Create category ───
  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert("Category name is required.");
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
      alert("Category created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating category: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update category ───
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert("Category name is required.");
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
      alert("Category updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating category: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete category ───
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await fetch(`/api/categories/${deleteConfirm._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((c) => c._id !== deleteConfirm._id)
      );
      setDeleteConfirm(null);
      alert("Category deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting category: " + err.message);
      setDeleteConfirm(null);
    }
  };

  // ─── Open edit modal ───
  const openEdit = (category) => {
    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder ?? 0,
    });
    setEditCategory(category);
  };

  // ─── Sort icon helper ───
  const SortIcon = ({ field }) => (
    <ArrowUpDown
      size={14}
      className={`inline ml-1 ${
        sortField === field
          ? "text-emerald-700"
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
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
          placeholder="e.g. Electric Scooters"
        />
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
          className="w-full h-28 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none"
          placeholder="Brief description of this category..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          Image URL
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
          placeholder="https://example.com/image.jpg"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-4 max-h-40 rounded-lg border border-neutral-200/60 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>

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
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            Status
          </label>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, isActive: !formData.isActive })
            }
            className="flex items-center gap-3 mt-1 cursor-pointer"
          >
            {formData.isActive ? (
              <>
                <ToggleRight
                  size={36}
                  className="text-emerald-600 transition-colors"
                />
                <span className="text-sm font-medium text-emerald-700">
                  Active
                </span>
              </>
            ) : (
              <>
                <ToggleLeft
                  size={36}
                  className="text-neutral-400 transition-colors"
                />
                <span className="text-sm font-medium text-neutral-500">
                  Inactive
                </span>
              </>
            )}
          </button>
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
          className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
            {["Name", "Slug", "Products", "Status", "Sort", "Actions"].map(
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
              {[1, 2, 3, 4, 5, 6].map((j) => (
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
      <h3 className="text-xl font-['Playfair_Display'] font-medium text-neutral-800 mb-2">
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
        className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
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
                <td className="py-5 px-6 text-sm text-neutral-500 font-mono">
                  {category.slug || "—"}
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-medium text-neutral-700">
                    {category.productCount ?? 0}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <button
                    onClick={() => handleToggleActive(category)}
                    className="flex items-center gap-2 cursor-pointer group"
                    title={
                      category.isActive
                        ? "Click to deactivate"
                        : "Click to activate"
                    }
                  >
                    {category.isActive ? (
                      <>
                        <ToggleRight
                          size={28}
                          className="text-emerald-600 group-hover:text-emerald-700 transition-colors"
                        />
                        <span className="text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft
                          size={28}
                          className="text-neutral-400 group-hover:text-neutral-500 transition-colors"
                        />
                        <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-600">
                          Inactive
                        </span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-5 px-6 text-sm text-neutral-600">
                  {category.sortOrder ?? 0}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(category)}
                      className="text-neutral-500 hover:text-emerald-700 transition-colors"
                      title="Edit category"
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
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
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Categories
          </h1>
          <button
            onClick={() => {
              setFormData({ ...emptyForm });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
          >
            <Plus size={18} />
            Create Category
          </button>
        </div>

        {/* ─── Search & Info Bar ─── */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
                className="w-full pl-11 pr-5 py-3 border border-neutral-200/70 rounded-lg bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm"
              />
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
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-['Playfair_Display'] font-medium">
                  Create Category
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ ...emptyForm });
                  }}
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
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-['Playfair_Display'] font-medium">
                  Edit Category
                </h2>
                <button
                  onClick={() => {
                    setEditCategory(null);
                    setFormData({ ...emptyForm });
                  }}
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

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-medium">
                  Delete Category
                </h2>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-8">
                <p className="text-neutral-600 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-neutral-900">
                    {deleteConfirm.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                {deleteConfirm.productCount > 0 && (
                  <div className="bg-red-50 border border-red-200/60 rounded-lg p-4 flex items-start gap-3">
                    <Trash2
                      size={20}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Cannot delete
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        This category has{" "}
                        <span className="font-semibold">
                          {deleteConfirm.productCount} product
                          {deleteConfirm.productCount !== 1 ? "s" : ""}
                        </span>{" "}
                        assigned to it. Remove or reassign the products first,
                        or deactivate the category instead.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirm.productCount > 0}
                  className="flex-1 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
