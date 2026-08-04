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
  Layers3,
  Loader2,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0,
};

export default function SegmentsPage() {
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("sortOrder");
  const [sortDir, setSortDir] = useState("asc");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editSegment, setEditSegment] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);

  // ─── Fetch segments ───
  const fetchSegments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/segments?active=false");
      if (!res.ok) throw new Error("Failed to fetch segments");
      const data = await res.json();
      setSegments(data.segments || []);
    } catch (err) {
      console.error("Segment fetch error:", err);
      showToast("Failed to load segments. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  // ─── Filtered & sorted segments ───
  const filteredSegments = useMemo(() => {
    let result = [...segments];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q)
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
  }, [segments, searchQuery, sortField, sortDir]);

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
  const handleToggleActive = async (segment) => {
    const newStatus = !segment.isActive;

    // Deactivating a segment can cascade to every category and product
    // beneath it — worth a pause. Reactivating only restores visibility.
    if (!newStatus) {
      const ok = await confirmDialog({
        title: "Deactivate Segment",
        message: <>Deactivate <strong>{segment.name}</strong>? Its categories and products may disappear from the storefront immediately.</>,
        confirmLabel: "Deactivate",
      });
      if (!ok) return;
    }

    // Optimistic update
    setSegments((prev) =>
      prev.map((s) =>
        s._id === segment._id ? { ...s, isActive: newStatus } : s
      )
    );

    try {
      const res = await fetch(`/api/segments/${segment._id}`, {
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
      setSegments((prev) =>
        prev.map((s) => (s._id === segment._id ? updated.segment || updated : s))
      );
    } catch (err) {
      // Revert optimistic update
      setSegments((prev) =>
        prev.map((s) =>
          s._id === segment._id ? { ...s, isActive: segment.isActive } : s
        )
      );
      console.error(err);
      showToast("Error toggling status: " + err.message, "error");
    }
  };

  // ─── Create segment ───
  const handleCreate = async () => {
    if (!formData.name.trim()) {
      showToast("Segment name is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/segments", {
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
        throw new Error(errData.error || "Failed to create segment");
      }

      const created = await res.json();
      setSegments((prev) => [...prev, created]);
      setShowCreateModal(false);
      setFormData({ ...emptyForm });
      showToast("Segment created successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error creating segment: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update segment ───
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      showToast("Segment name is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/segments/${editSegment._id}`, {
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
        throw new Error(errData.error || "Failed to update segment");
      }

      const updated = await res.json();
      setSegments((prev) =>
        prev.map((s) => (s._id === editSegment._id ? updated.segment || updated : s))
      );
      setEditSegment(null);
      setFormData({ ...emptyForm });
      showToast("Segment updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error updating segment: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete segment ───
  const handleDelete = async (segment) => {
    const ok = await confirmDialog({
      title: "Delete Segment",
      message: (
        <>
          Are you sure you want to delete <strong>{segment.name}</strong>?
          This action cannot be undone.
        </>
      ),
      confirmLabel: "Delete",
      blocked:
        segment.categoryCount > 0
          ? {
              reason: (
                <>
                  This segment has{" "}
                  <strong>
                    {segment.categoryCount} categor{segment.categoryCount !== 1 ? "ies" : "y"}
                  </strong>{" "}
                  assigned to it. Reassign the categories first, or
                  deactivate the segment instead.
                </>
              ),
            }
          : null,
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/segments/${segment._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete segment");
      }

      setSegments((prev) => prev.filter((s) => s._id !== segment._id));
      showToast("Segment deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error deleting segment: " + err.message, "error");
    }
  };

  // ─── Open edit modal ───
  const openEdit = (segment) => {
    setFormData({
      name: segment.name || "",
      description: segment.description || "",
      image: segment.image || "",
      isActive: segment.isActive ?? true,
      sortOrder: segment.sortOrder ?? 0,
    });
    setEditSegment(segment);
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

  // ─── Segment form (shared for create & edit) ───
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
          placeholder="e.g. Electric Vehicles"
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
          className="w-full h-28 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors resize-none"
          placeholder="Brief description of this segment..."
        />
      </div>

      <ImageUploadField
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        type="segment"
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
                  className="text-[#19B5D8] transition-colors"
                />
                <span className="text-sm font-medium text-[#19B5D8]">
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
            setEditSegment(null);
            setFormData({ ...emptyForm });
          }}
          disabled={submitting}
          className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={editSegment ? handleUpdate : handleCreate}
          disabled={submitting}
          className="flex-1 py-4 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {editSegment
            ? submitting
              ? "Updating..."
              : "Update Segment"
            : submitting
            ? "Creating..."
            : "Create Segment"}
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
            {["Name", "Slug", "Categories", "Status", "Sort", "Actions"].map(
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
        <Layers3 size={36} className="text-neutral-400" />
      </div>
      <h3 className="text-xl font-medium text-neutral-800 mb-2">
        No segments yet
      </h3>
      <p className="text-neutral-500 text-sm max-w-sm mb-8">
        Create your first segment to group categories into broader business
        lines.
      </p>
      <button
        onClick={() => {
          setFormData({ ...emptyForm });
          setShowCreateModal(true);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
      >
        <Plus size={18} />
        Create Segment
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
        No segments match &ldquo;{searchQuery}&rdquo;. Try a different search
        term.
      </p>
    </div>
  );

  // ─── Segments table ───
  const renderTable = () => {
    if (filteredSegments.length === 0 && searchQuery.trim()) {
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
                Categories
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
            {filteredSegments.map((segment) => (
              <tr
                key={segment._id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    {segment.image ? (
                      <img
                        src={segment.image}
                        alt={segment.name}
                        className="w-10 h-10 rounded-lg object-cover border border-neutral-200/60 flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-lg bg-neutral-100 items-center justify-center text-neutral-400 text-xs flex-shrink-0 ${
                        segment.image ? "hidden" : "flex"
                      }`}
                    >
                      N/A
                    </div>
                    <span className="font-medium text-neutral-900">
                      {segment.name}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-sm text-neutral-500 font-mono">
                  {segment.slug || "—"}
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-medium text-neutral-700">
                    {segment.categoryCount ?? 0}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <button
                    onClick={() => handleToggleActive(segment)}
                    className="flex items-center gap-2 cursor-pointer group"
                    title={
                      segment.isActive
                        ? "Click to deactivate"
                        : "Click to activate"
                    }
                  >
                    {segment.isActive ? (
                      <>
                        <ToggleRight
                          size={28}
                          className="text-[#19B5D8] group-hover:text-[#19B5D8] transition-colors"
                        />
                        <span className="text-xs font-medium text-[#19B5D8] group-hover:text-[#19B5D8]">
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
                  {segment.sortOrder ?? 0}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(segment)}
                      className="text-neutral-500 hover:text-[#19B5D8] transition-colors"
                      title="Edit segment"
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      onClick={() => handleDelete(segment)}
                      className="text-neutral-500 hover:text-red-600 transition-colors"
                      title="Delete segment"
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
            Segments
          </h1>
          <button
            onClick={() => {
              setFormData({ ...emptyForm });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Plus size={18} />
            Create Segment
          </button>
        </div>

        {/* ─── Search & Info Bar ─── */}
        {!loading && segments.length > 0 && (
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
                placeholder="Search segments..."
                className="w-full pl-11 pr-5 py-3 border border-neutral-200/70 rounded-lg bg-white focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
              />
            </div>
            <p className="text-sm text-neutral-500">
              {filteredSegments.length} of {segments.length} segments
            </p>
          </div>
        )}

        {/* ─── Table / Loading / Empty ─── */}
        {loading
          ? renderLoading()
          : segments.length === 0
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
                <h2 className="text-3xl font-medium">
                  Create Segment
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
        {editSegment && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-medium">
                  Edit Segment
                </h2>
                <button
                  onClick={() => {
                    setEditSegment(null);
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

    </section>
  );
}
