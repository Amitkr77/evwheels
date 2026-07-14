"use client";

import React, { useRef, useState } from "react";
import { Loader2, ImagePlus, X, GripVertical } from "lucide-react";

// Multi-image gallery upload for admin entity forms (currently: Product).
// Uploads through /api/admin/upload, which routes to a whitelisted
// Cloudinary folder based on `type`. The first image in `value` is treated
// as the cover/primary image shown on listings — drag thumbnails to reorder.
export default function MultiImageUploadField({
  value = [],
  onChange,
  type = "product",
  label = "Images",
  max = 6,
  required = false,
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const remainingSlots = max - value.length;

  const uploadOne = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url;
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, remainingSlots);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map(uploadOne));
      onChange([...value, ...uploaded]);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addByUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (value.length >= max) {
      alert(`Maximum ${max} images allowed.`);
      return;
    }
    onChange([...value, url]);
    setUrlInput("");
  };

  const removeAt = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index) => {
    const from = dragIndex.current;
    if (from === null || from === index) {
      setDragOverIndex(null);
      return;
    }
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    onChange(next);
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}{" "}
        <span className="text-xs font-normal text-neutral-400">
          ({value.length}/{max} — drag to reorder, first is the cover image)
        </span>
      </label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(i, e)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragOverIndex(null)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-move bg-neutral-50 transition-colors ${
                dragOverIndex === i ? "border-[#19B5D8]" : "border-neutral-200/60"
              }`}
            >
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-medium bg-[#19B5D8] text-white rounded">
                  Cover
                </span>
              )}
              <div className="absolute top-1 left-1 text-white/80 bg-black/30 rounded p-0.5">
                <GripVertical size={12} />
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label={`Remove image ${i + 1}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addByUrl();
            }
          }}
          disabled={remainingSlots <= 0}
          className="flex-1 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors disabled:opacity-50 disabled:bg-neutral-50"
          placeholder={remainingSlots > 0 ? "https://example.com/image.jpg — or upload below" : `Maximum ${max} images reached`}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || remainingSlots <= 0}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-600 hover:border-[#19B5D8] hover:text-[#19B5D8] hover:bg-[#DDF8FD]/40 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImagePlus size={16} />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
    </div>
  );
}
