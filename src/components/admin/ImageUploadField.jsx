"use client";

import React, { useRef, useState } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";

// Shared Cloudinary image upload field for admin entity forms
// (Segment, Category, Subcategory, Product). Uploads through
// /api/admin/upload, which routes to a whitelisted Cloudinary folder
// based on `type`.
export default function ImageUploadField({
  value,
  onChange,
  type = "product",
  label = "Image",
  required = false,
  inputClassName = "w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#19B5D8] transition-colors",
  previewClassName = "mt-4 max-h-40 rounded-lg border border-neutral-200/60 object-cover",
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
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
      onChange(url);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClassName} flex-1`}
          placeholder="https://example.com/image.jpg  or upload below"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
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

      {value && (
        <div className="mt-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className={previewClassName}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
