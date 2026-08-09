"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Loader2, ChevronUp, ChevronDown, ExternalLink,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import StatusToggle from "@/components/admin/StatusToggle";

const EMPTY_FORM = { imageUrl: "", caption: "", link: "", isActive: true };

export default function InstagramPage() {
  const showToast   = useToast();
  const confirmDlg  = useConfirm();

  const [posts,         setPosts]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [reordering,    setReordering]    = useState(false);
  const [showCreate,    setShowCreate]    = useState(false);
  const [editPost,      setEditPost]      = useState(null);
  const [formData,      setFormData]      = useState({ ...EMPTY_FORM });
  const [error,         setError]         = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/instagram", { credentials: "include" });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      showToast("Failed to load posts.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setFormData({ ...EMPTY_FORM });
    setError("");
    setShowCreate(true);
  };

  const openEdit = (post) => {
    setFormData({ imageUrl: post.imageUrl, caption: post.caption || "", link: post.link || "", isActive: post.isActive ?? true });
    setError("");
    setEditPost(post);
  };

  const handleCreate = async () => {
    if (!formData.imageUrl.trim()) { setError("Image is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res  = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create post."); return; }
      setPosts((prev) => [...prev, data.post]);
      setShowCreate(false);
      showToast("Post added!");
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async () => {
    if (!formData.imageUrl.trim()) { setError("Image is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res  = await fetch(`/api/admin/instagram?id=${editPost._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update post."); return; }
      setPosts((prev) => prev.map((p) => (p._id === editPost._id ? data.post : p)));
      setEditPost(null);
      showToast("Post updated!");
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (post) => {
    const ok = await confirmDlg({
      title: "Delete Post",
      message: "Remove this post from the homepage grid? This cannot be undone.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/instagram?id=${post._id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed");
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      showToast("Post removed!");
    } catch (err) { showToast(err.message, "error"); }
  };

  const handleToggle = async (post) => {
    const newVal = !post.isActive;
    setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, isActive: newVal } : p)));
    try {
      const res = await fetch(`/api/admin/instagram?id=${post._id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ isActive: newVal }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, isActive: post.isActive } : p)));
      showToast("Failed to toggle status.", "error");
    }
  };

  const movePost = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= posts.length || reordering) return;
    setReordering(true);
    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((p, i) => { p.displayOrder = i; });
    setPosts(next);
    try {
      await Promise.all(
        [next[index], next[target]].map((p) =>
          fetch(`/api/admin/instagram?id=${p._id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            credentials: "include", body: JSON.stringify({ displayOrder: p.displayOrder }),
          })
        )
      );
    } catch { showToast("Failed to save order.", "error"); fetchPosts(); }
    finally { setReordering(false); }
  };

  const renderForm = (onSubmit, label) => (
    <div className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      <ImageUploadField
        value={formData.imageUrl}
        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
        type="banner"
        label="Post Image"
        required
      />
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">Caption</label>
        <textarea
          rows={3}
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors resize-none text-sm"
          placeholder="Electric cycle delivery day! 🚴‍♂️ #EVWheels"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">Instagram Post Link</label>
        <input
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors text-sm"
          placeholder="https://www.instagram.com/p/..."
        />
        <p className="text-xs text-neutral-400 mt-1">Leave blank to link to the profile page.</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusToggle
          size="md"
          checked={formData.isActive}
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          ariaLabel="Toggle active"
        />
        <span className="text-sm text-neutral-600">Show on homepage</span>
      </div>
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => { setShowCreate(false); setEditPost(null); }}
          disabled={submitting}
          className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-3.5 bg-[#19B5D8] text-white rounded-lg font-medium hover:bg-[#1297B5] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Saving…" : label}
        </button>
      </div>
    </div>
  );

  const IGIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium">Instagram Posts</h1>
            <p className="text-neutral-500 text-sm mt-2">
              Manage the photo grid on the homepage. Images are uploaded manually — no API required.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors shrink-0"
          >
            <Plus size={18} /> Add Post
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-neutral-500 py-10 text-center">Loading posts…</p>}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="border border-neutral-200/60 rounded-xl py-20 flex flex-col items-center justify-center text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-white"
              style={{ background: "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
            >
              <IGIcon />
            </div>
            <h3 className="text-xl font-medium text-neutral-800 mb-2">No posts yet</h3>
            <p className="text-neutral-500 text-sm max-w-sm mb-8">
              Add your first post to display a photo grid on the homepage.
            </p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 bg-[#19B5D8] text-white rounded-full text-sm font-medium hover:bg-[#1297B5] transition-colors"
            >
              <Plus size={18} /> Add Post
            </button>
          </div>
        )}

        {/* Post list */}
        {!loading && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <div
                key={post._id}
                className="flex items-center gap-4 bg-white border border-neutral-200/70 rounded-xl p-4"
              >
                {/* Reorder */}
                <div className="flex flex-col shrink-0">
                  <button onClick={() => movePost(i, -1)} disabled={i === 0 || reordering} aria-label="Move up"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => movePost(i, 1)} disabled={i === posts.length - 1 || reordering} aria-label="Move down"
                    className="p-1 text-neutral-400 hover:text-[#19B5D8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200/60 shrink-0 bg-neutral-100">
                  <img
                    src={post.imageUrl}
                    alt={post.caption || "Post"}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.opacity = "0"; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {post.caption ? (
                    <p className="text-sm font-medium text-neutral-800 truncate">{post.caption}</p>
                  ) : (
                    <p className="text-sm text-neutral-400 italic">No caption</p>
                  )}
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#19B5D8] hover:underline mt-0.5"
                    >
                      Custom link <ExternalLink size={10} />
                    </a>
                  )}
                  {!post.link && (
                    <p className="text-xs text-neutral-400 mt-0.5">→ Links to profile</p>
                  )}
                </div>

                {/* Toggle */}
                <StatusToggle
                  checked={post.isActive}
                  onClick={() => handleToggle(post)}
                  ariaLabel={`Toggle ${post.caption || "post"}`}
                  title={post.isActive ? "Active — click to hide" : "Hidden — click to show"}
                />

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => openEdit(post)} className="text-neutral-500 hover:text-[#19B5D8] transition-colors" title="Edit">
                    <Edit2 size={17} />
                  </button>
                  <button onClick={() => handleDelete(post)} className="text-neutral-500 hover:text-red-600 transition-colors" title="Delete">
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
              role="dialog" aria-modal="true" aria-labelledby="ig-create-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-7">
                <h2 id="ig-create-title" className="text-2xl font-medium">Add Post</h2>
                <button onClick={() => setShowCreate(false)} aria-label="Close" className="text-neutral-400 hover:text-neutral-600"><X size={22} /></button>
              </div>
              {renderForm(handleCreate, "Add Post")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editPost && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              role="dialog" aria-modal="true" aria-labelledby="ig-edit-title"
              className="bg-white rounded-2xl w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-7">
                <h2 id="ig-edit-title" className="text-2xl font-medium">Edit Post</h2>
                <button onClick={() => setEditPost(null)} aria-label="Close" className="text-neutral-400 hover:text-neutral-600"><X size={22} /></button>
              </div>
              {renderForm(handleUpdate, "Update Post")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
