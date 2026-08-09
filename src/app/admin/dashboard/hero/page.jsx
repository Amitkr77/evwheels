"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Loader2, ChevronUp, ChevronDown, MonitorPlay,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import StatusToggle from "@/components/admin/StatusToggle";

const ICON_OPTIONS = ["Zap", "Battery", "Settings", "Package", "Gauge"];

const EMPTY_FORM = {
  badgeIcon:   "Zap",
  badge:       "",
  headline0:   "",
  headline1:   "",
  accent:      "",
  description: "",
  cta1Label:   "Shop Now",
  cta1Href:    "/shop",
  cta2Label:   "",
  cta2Href:    "",
  isActive:    true,
};

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm ${className}`}
    />
  );
}

export default function HeroSlidesPage() {
  const showToast  = useToast();
  const confirmDlg = useConfirm();

  const [slides,      setSlides]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [reordering,  setReordering]  = useState(false);
  const [showCreate,  setShowCreate]  = useState(false);
  const [editSlide,   setEditSlide]   = useState(null);
  const [formData,    setFormData]    = useState({ ...EMPTY_FORM });
  const [error,       setError]       = useState("");

  const set = (key) => (val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/hero-slides", { credentials: "include" });
      const data = await res.json();
      setSlides(data.slides || []);
    } catch {
      showToast("Failed to load slides.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setFormData({ ...EMPTY_FORM });
    setError("");
    setShowCreate(true);
  };

  const openEdit = (slide) => {
    setFormData({
      badgeIcon:   slide.badgeIcon   || "Zap",
      badge:       slide.badge       || "",
      headline0:   slide.headline0   || "",
      headline1:   slide.headline1   || "",
      accent:      slide.accent      || "",
      description: slide.description || "",
      cta1Label:   slide.cta1Label   || "Shop Now",
      cta1Href:    slide.cta1Href    || "/shop",
      cta2Label:   slide.cta2Label   || "",
      cta2Href:    slide.cta2Href    || "",
      isActive:    slide.isActive    ?? true,
    });
    setError("");
    setEditSlide(slide);
  };

  const validate = () => {
    if (!formData.headline0.trim()) return "Headline (line 1) is required.";
    if (!formData.cta1Label.trim() || !formData.cta1Href.trim()) return "Primary CTA label and link are required.";
    return "";
  };

  const handleCreate = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true); setError("");
    try {
      const res  = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create slide."); return; }
      setSlides((prev) => [...prev, data.slide]);
      setShowCreate(false);
      showToast("Slide created!");
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true); setError("");
    try {
      const res  = await fetch(`/api/admin/hero-slides?id=${editSlide._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update slide."); return; }
      setSlides((prev) => prev.map((s) => (s._id === editSlide._id ? data.slide : s)));
      setEditSlide(null);
      showToast("Slide updated!");
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (slide) => {
    const ok = await confirmDlg({
      title: "Delete Slide",
      message: <>Delete the slide <strong>"{slide.headline0}"</strong>? This cannot be undone.</>,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${slide._id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      setSlides((prev) => prev.filter((s) => s._id !== slide._id));
      showToast("Slide deleted!");
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleToggle = async (slide) => {
    const newVal = !slide.isActive;
    setSlides((prev) => prev.map((s) => (s._id === slide._id ? { ...s, isActive: newVal } : s)));
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${slide._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ isActive: newVal }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setSlides((prev) => prev.map((s) => (s._id === slide._id ? { ...s, isActive: slide.isActive } : s)));
      showToast("Failed to toggle.", "error");
    }
  };

  const moveSlide = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= slides.length || reordering) return;
    setReordering(true);
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((s, i) => { s.displayOrder = i; });
    setSlides(next);
    try {
      await Promise.all(
        [next[index], next[target]].map((s) =>
          fetch(`/api/admin/hero-slides?id=${s._id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            credentials: "include", body: JSON.stringify({ displayOrder: s.displayOrder }),
          })
        )
      );
    } catch { showToast("Failed to save order.", "error"); fetchSlides(); }
    finally { setReordering(false); }
  };

  const closeModal = () => { setShowCreate(false); setEditSlide(null); };

  const renderForm = (onSubmit, label) => (
    <div className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Badge row */}
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Field label="Badge Icon">
          <select
            value={formData.badgeIcon}
            onChange={(e) => set("badgeIcon")(e.target.value)}
            className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm bg-white"
          >
            {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Badge Pill Text">
          <Input value={formData.badge} onChange={set("badge")} placeholder="In-house manufactured · COD Available" />
        </Field>
      </div>

      {/* Headline */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Headline Line 1" required>
          <Input value={formData.headline0} onChange={set("headline0")} placeholder="Electric Cycles" />
        </Field>
        <Field label="Headline Line 2">
          <Input value={formData.headline1} onChange={set("headline1")} placeholder="& Scooters." />
        </Field>
      </div>

      <Field label="Accent Text (teal coloured)">
        <Input value={formData.accent} onChange={set("accent")} placeholder="Made in Patna." />
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => set("description")(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors resize-none text-sm"
          placeholder="We manufacture electric cycles and lithium batteries in-house…"
        />
      </Field>

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary CTA Label" required>
          <Input value={formData.cta1Label} onChange={set("cta1Label")} placeholder="Shop Now" />
        </Field>
        <Field label="Primary CTA Link" required>
          <Input value={formData.cta1Href} onChange={set("cta1Href")} placeholder="/shop" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secondary CTA Label">
          <Input value={formData.cta2Label} onChange={set("cta2Label")} placeholder="Get Wholesale Quote" />
        </Field>
        <Field label="Secondary CTA Link">
          <Input value={formData.cta2Href} onChange={set("cta2Href")} placeholder="/contact" />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <StatusToggle
          size="md"
          checked={formData.isActive}
          onClick={() => set("isActive")(!formData.isActive)}
          ariaLabel="Toggle active"
        />
        <span className="text-sm text-neutral-600">Show this slide</span>
      </div>

      <div className="flex gap-4 pt-2">
        <button onClick={closeModal} disabled={submitting}
          className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors text-sm">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={submitting}
          className="flex-1 py-3.5 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Saving…" : label}
        </button>
      </div>
    </div>
  );

  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium">Hero Slides</h1>
            <p className="text-neutral-500 text-sm mt-2">
              Control the auto-rotating slides in the hero section on the homepage.
            </p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors shrink-0">
            <Plus size={18} /> Add Slide
          </button>
        </div>

        {loading && <p className="text-neutral-500 py-10 text-center">Loading slides…</p>}

        {!loading && slides.length === 0 && (
          <div className="border border-neutral-200/60 rounded-xl py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
              <MonitorPlay size={28} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-800 mb-2">No slides yet</h3>
            <p className="text-neutral-500 text-sm max-w-sm mb-8">
              Create the first slide to control the homepage hero section.
            </p>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors">
              <Plus size={18} /> Add Slide
            </button>
          </div>
        )}

        {!loading && slides.length > 0 && (
          <div className="space-y-3">
            {slides.map((slide, i) => (
              <div key={slide._id}
                className="flex items-center gap-4 bg-white border border-neutral-200/70 rounded-xl p-5">
                {/* Reorder */}
                <div className="flex flex-col shrink-0">
                  <button onClick={() => moveSlide(i, -1)} disabled={i === 0 || reordering} aria-label="Move up"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1 || reordering} aria-label="Move down"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Slide number */}
                <div className="w-8 h-8 rounded-full bg-[#DDF8FD] flex items-center justify-center text-[#19B5D8] text-xs font-bold shrink-0">
                  {i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">
                    {slide.headline0}{slide.headline1 ? ` ${slide.headline1}` : ""}
                    {slide.accent && <span className="text-[#19B5D8] ml-1">{slide.accent}</span>}
                  </p>
                  {slide.badge && (
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{slide.badge}</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {slide.cta1Label} → {slide.cta1Href}
                    {slide.cta2Label && ` · ${slide.cta2Label} → ${slide.cta2Href}`}
                  </p>
                </div>

                {/* Active */}
                <StatusToggle
                  checked={slide.isActive}
                  onClick={() => handleToggle(slide)}
                  ariaLabel={`Toggle slide "${slide.headline0}"`}
                  title={slide.isActive ? "Active — click to hide" : "Hidden — click to show"}
                />

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => openEdit(slide)} className="text-neutral-500 hover:text-[#19B5D8] transition-colors" title="Edit">
                    <Edit2 size={17} />
                  </button>
                  <button onClick={() => handleDelete(slide)} className="text-neutral-500 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              role="dialog" aria-modal="true" aria-labelledby="hero-create-title"
              className="bg-white rounded-2xl w-full max-w-xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-7">
                <h2 id="hero-create-title" className="text-2xl font-medium">Add Slide</h2>
                <button onClick={closeModal} aria-label="Close" className="text-neutral-400 hover:text-neutral-600"><X size={22} /></button>
              </div>
              {renderForm(handleCreate, "Create Slide")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editSlide && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              role="dialog" aria-modal="true" aria-labelledby="hero-edit-title"
              className="bg-white rounded-2xl w-full max-w-xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-7">
                <h2 id="hero-edit-title" className="text-2xl font-medium">Edit Slide</h2>
                <button onClick={closeModal} aria-label="Close" className="text-neutral-400 hover:text-neutral-600"><X size={22} /></button>
              </div>
              {renderForm(handleUpdate, "Update Slide")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
