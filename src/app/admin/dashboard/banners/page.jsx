"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import StatusToggle from "@/components/admin/StatusToggle";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  image: "",
  buttonText: "",
  buttonLink: "",
  isActive: true,
};

export default function BannersPage() {
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState("");

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners", { credentials: "include" });
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error("Banners fetch error:", err);
      showToast("Failed to load banners. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setFormData({ ...EMPTY_FORM, displayOrder: banners.length });
    setError("");
    setShowCreateModal(true);
  };

  const openEdit = (banner) => {
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      isActive: banner.isActive ?? true,
    });
    setError("");
    setEditBanner(banner);
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.image.trim()) return "Banner image is required.";
    return "";
  };

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create banner."); return; }
      setBanners((prev) => [...prev, data.banner]);
      setShowCreateModal(false);
      showToast("Banner created successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/banners?id=${editBanner._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update banner."); return; }
      setBanners((prev) => prev.map((b) => (b._id === editBanner._id ? data.banner : b)));
      setEditBanner(null);
      showToast("Banner updated successfully!");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (banner) => {
    const ok = await confirmDialog({
      title: "Delete Banner",
      message: <>Delete <strong>{banner.title}</strong>? This action cannot be undone.</>,
      confirmLabel: "Delete",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${banner._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete banner");
      }
      setBanners((prev) => prev.filter((b) => b._id !== banner._id));
      showToast("Banner deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  const handleToggleActive = async (banner) => {
    const newStatus = !banner.isActive;
    setBanners((prev) => prev.map((b) => (b._id === banner._id ? { ...b, isActive: newStatus } : b)));
    try {
      const res = await fetch(`/api/admin/banners?id=${banner._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
      setBanners((prev) => prev.map((b) => (b._id === banner._id ? { ...b, isActive: banner.isActive } : b)));
      showToast("Error toggling status: " + err.message, "error");
    }
  };

  // Swap this banner's displayOrder with its neighbour, persist both.
  const moveBanner = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= banners.length || reordering) return;

    setReordering(true);
    const next = [...banners];
    [next[index], next[target]] = [next[target], next[index]];
    // Renumber displayOrder to match the new visual order exactly.
    next.forEach((b, i) => { b.displayOrder = i; });
    setBanners(next);

    try {
      await Promise.all(
        [next[index], next[target]].map((b) =>
          fetch(`/api/admin/banners?id=${b._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ displayOrder: b.displayOrder }),
          })
        )
      );
    } catch (err) {
      showToast("Failed to save new order: " + err.message, "error");
      fetchBanners();
    } finally {
      setReordering(false);
    }
  };

  const renderForm = (onSubmit, submitLabel) => (
    <div className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="banner-title" className="block text-sm font-medium text-neutral-600 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="banner-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          placeholder="e.g. Monsoon Sale — Up to 30% Off"
        />
      </div>

      <div>
        <label htmlFor="banner-subtitle" className="block text-sm font-medium text-neutral-600 mb-2">
          Subtitle
        </label>
        <input
          id="banner-subtitle"
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
          placeholder="e.g. On brakes, lights & tyres this week"
        />
      </div>

      <ImageUploadField
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        type="banner"
        label="Banner Image"
        required
      />

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="banner-btn-text" className="block text-sm font-medium text-neutral-600 mb-2">
            Button Text
          </label>
          <input
            id="banner-btn-text"
            type="text"
            value={formData.buttonText}
            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
            placeholder="Shop Now"
          />
        </div>
        <div>
          <label htmlFor="banner-btn-link" className="block text-sm font-medium text-neutral-600 mb-2">
            Button Link
          </label>
          <input
            id="banner-btn-link"
            type="text"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors"
            placeholder="/shop?category=brakes"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusToggle
          size="md"
          checked={formData.isActive}
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          ariaLabel="Toggle active status"
        />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          onClick={() => { setShowCreateModal(false); setEditBanner(null); }}
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
          <div>
            <h1 className="text-4xl md:text-5xl font-medium">Banners</h1>
            <p className="text-neutral-500 text-sm mt-2">
              Promotional banners shown on the landing page, in this order.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
          >
            <Plus size={18} />
            Create Banner
          </button>
        </div>

        {loading ? (
          <p className="text-neutral-500 py-10 text-center">Loading banners...</p>
        ) : banners.length === 0 ? (
          <div className="border border-neutral-200/60 rounded-xl py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
              <ImageIcon size={28} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-800 mb-2">No banners yet</h3>
            <p className="text-neutral-500 text-sm max-w-sm mb-8">
              Create your first promotional banner to feature it on the landing page.
            </p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
            >
              <Plus size={18} />
              Create Banner
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner, i) => (
              <div
                key={banner._id}
                className="flex items-center gap-4 bg-white border border-neutral-200/70 rounded-xl p-4"
              >
                <div className="flex flex-col shrink-0">
                  <button
                    onClick={() => moveBanner(i, -1)}
                    disabled={i === 0 || reordering}
                    aria-label="Move up"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveBanner(i, 1)}
                    disabled={i === banners.length - 1 || reordering}
                    aria-label="Move down"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-24 h-16 rounded-lg object-cover border border-neutral-200/60 shrink-0"
                  onError={(e) => { e.target.style.visibility = "hidden"; }}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{banner.title}</p>
                  {banner.subtitle && (
                    <p className="text-sm text-neutral-500 truncate">{banner.subtitle}</p>
                  )}
                  {banner.buttonText && (
                    <p className="text-xs text-[#19B5D8] mt-1">
                      &ldquo;{banner.buttonText}&rdquo; &rarr; {banner.buttonLink || "no link set"}
                    </p>
                  )}
                </div>

                <StatusToggle
                  checked={banner.isActive}
                  onClick={() => handleToggleActive(banner)}
                  ariaLabel={`Toggle ${banner.title} active status`}
                  title={banner.isActive ? "Click to deactivate" : "Click to activate"}
                />

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => openEdit(banner)}
                    className="text-neutral-500 hover:text-[#19B5D8] transition-colors"
                    title="Edit banner"
                  >
                    <Edit2 size={17} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="text-neutral-500 hover:text-red-600 transition-colors"
                    title="Delete banner"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="banner-create-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 id="banner-create-title" className="text-3xl font-medium">Create Banner</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleCreate, "Create Banner")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editBanner && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="banner-edit-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 id="banner-edit-title" className="text-3xl font-medium">Edit Banner</h2>
                <button
                  onClick={() => setEditBanner(null)}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleUpdate, "Update Banner")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
