"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Copy,
  Archive,
  ArchiveRestore,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckSquare,
  Square,
  MoreVertical,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Empty form template ────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  category: "",
  subcategory: "",
  shortDescription: "",
  description: "",
  price: "",
  discountType: "none",
  discountValue: "",
  sku: "",
  brand: "",
  stock: 0,
  moq: 1,
  boxQty: 1,
  image: "",
  priceRange: "",
  tags: "",
  isFeatured: false,
  isActive: true,
};

const ITEMS_PER_PAGE = 15;

export default function ProductsPage() {
  // ─── Data state ──────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // ─── Filter / search / sort / page state ─────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Selection & bulk state ──────────────────────────────────
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // ─── Modal states ────────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stockModal, setStockModal] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [formSubcategories, setFormSubcategories] = useState([]);

  // ─── Toast state ─────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Helper accessors ────────────────────────────────────────
  const getPrice = (p) => p.price?.base ?? p.price ?? 0;
  const getStock = (p) => p.inventory?.stock ?? p.stock ?? 0;
  const getMoq = (p) => p.inventory?.moq ?? p.moq ?? 1;
  const getBoxQty = (p) => p.inventory?.boxQty ?? p.boxQty ?? 1;
  const getIsFeatured = (p) => p.isFeatured ?? p.featured ?? false;
  const getImage = (p) =>
    p.images?.find((i) => i.isPrimary)?.url ||
    p.images?.[0]?.url ||
    p.image ||
    "";
  const getName = (p) => p.name || p.title || "";
  const getCategoryName = (p) => {
    if (typeof p.category === "object" && p.category?.name)
      return p.category.name;
    const cat = categories.find(
      (c) => c._id === p.category || c._id === p.category?._id
    );
    return cat?.name || "—";
  };
  const getSubcategoryName = (p) => {
    if (typeof p.subcategory === "object" && p.subcategory?.name)
      return p.subcategory.name;
    return "—";
  };
  const getStatus = (p) => {
    if (p.isArchived) return "archived";
    if (p.isActive === false) return "inactive";
    return "active";
  };

  // ─── Fetch products with filters ────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        admin: "true",
        limit: String(ITEMS_PER_PAGE),
        page: String(currentPage),
      });

      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (categoryFilter) params.set("categoryId", categoryFilter);
      if (subcategoryFilter) params.set("subcategory", subcategoryFilter);

      if (statusFilter === "active") {
        params.set("archived", "false");
      } else if (statusFilter === "inactive") {
        // inactive = not archived but isActive=false
        // no direct filter — we'll handle client-side
      } else if (statusFilter === "archived") {
        params.set("archived", "true");
      }

      if (priceRangeFilter) params.set("priceRange", priceRangeFilter);

      if (sortField) {
        const sortMap = {
          name: "name",
          price: "price.base",
          stock: "inventory.stock",
          createdAt: "createdAt",
        };
        params.set("sort", sortMap[sortField] || sortField);
        params.set("order", sortDir);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      let filteredProducts = data.products || [];

      // Client-side filtering for "inactive" status since API doesn't support it directly
      if (statusFilter === "inactive") {
        filteredProducts = filteredProducts.filter(
          (p) => !p.isArchived && p.isActive === false
        );
      } else if (statusFilter === "active") {
        filteredProducts = filteredProducts.filter(
          (p) => !p.isArchived && p.isActive !== false
        );
      }

      setProducts(filteredProducts);
      setTotalProducts(data.pagination?.total || filteredProducts.length);
    } catch (err) {
      console.error("Product fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, subcategoryFilter, statusFilter, priceRangeFilter, sortField, sortDir]);

  // ─── Fetch categories ───────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories?active=false");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  }, []);

  // ─── Fetch subcategories for filter bar ─────────────────────
  useEffect(() => {
    if (!categoryFilter) {
      setSubcategories([]);
      setSubcategoryFilter("");
      return;
    }
    const fetchSubs = async () => {
      try {
        const res = await fetch(
          `/api/subcategories?categoryId=${categoryFilter}`
        );
        const data = await res.json();
        setSubcategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Subcategory fetch error:", err);
        setSubcategories([]);
      }
    };
    fetchSubs();
  }, [categoryFilter]);

  // ─── Fetch form subcategories when form category changes ────
  useEffect(() => {
    const catId = formData.category;
    if (!catId) {
      setFormSubcategories([]);
      return;
    }
    const fetchSubs = async () => {
      try {
        const res = await fetch(`/api/subcategories?categoryId=${catId}`);
        const data = await res.json();
        setFormSubcategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Form subcategory fetch error:", err);
        setFormSubcategories([]);
      }
    };
    fetchSubs();
  }, [formData.category]);

  // ─── Initial data load ──────────────────────────────────────
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Reset page when filters change ─────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, subcategoryFilter, statusFilter, priceRangeFilter]);

  // ─── Close action menu on outside click ─────────────────────
  useEffect(() => {
    const handler = () => setActionMenuId(null);
    if (actionMenuId) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [actionMenuId]);

  // ─── Sort handler ───────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown size={14} className="text-neutral-400" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-emerald-700" />
    ) : (
      <ChevronDown size={14} className="text-emerald-700" />
    );
  };

  // ─── Selection helpers ──────────────────────────────────────
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length && products.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p._id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setBulkAction("");
  };

  // ─── Pagination helpers ─────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  // ─── Create product ─────────────────────────────────────────
  const handleCreate = async () => {
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!formData.category) {
      showToast("Category is required", "error");
      return;
    }
    if (!formData.subcategory) {
      showToast("Subcategory is required", "error");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      showToast("Price must be greater than 0", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        brand: formData.brand,
        stock: Number(formData.stock) || 0,
        moq: Number(formData.moq) || 1,
        boxQty: Number(formData.boxQty) || 1,
        sku: formData.sku || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        priceRange: formData.priceRange || undefined,
      };

      if (formData.discountType && formData.discountType !== "none") {
        payload.price = {
          base: Number(formData.price),
          gstPercent: 18,
          discount: {
            type: formData.discountType,
            value: Number(formData.discountValue) || 0,
          },
        };
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create product");
      }

      setShowCreateModal(false);
      setFormData({ ...EMPTY_FORM });
      showToast("Product created successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update product ─────────────────────────────────────────
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!formData.category) {
      showToast("Category is required", "error");
      return;
    }
    if (!formData.subcategory) {
      showToast("Subcategory is required", "error");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      showToast("Price must be greater than 0", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        shortDescription: formData.shortDescription,
        description: formData.description,
        image: formData.image,
        brand: formData.brand,
        stock: Number(formData.stock) || 0,
        moq: Number(formData.moq) || 1,
        boxQty: Number(formData.boxQty) || 1,
        sku: formData.sku || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        priceRange: formData.priceRange || undefined,
      };

      // Handle price with discount
      if (formData.discountType && formData.discountType !== "none") {
        payload.price = {
          base: Number(formData.price),
          gstPercent: 18,
          discount: {
            type: formData.discountType,
            value: Number(formData.discountValue) || 0,
          },
        };
      } else {
        payload.price = Number(formData.price);
      }

      const res = await fetch(`/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update product");
      }

      setEditProduct(null);
      setFormData({ ...EMPTY_FORM });
      showToast("Product updated successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete product ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/products/${deleteConfirm._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete product");
      }
      setDeleteConfirm(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteConfirm._id);
        return next;
      });
      showToast("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
      setDeleteConfirm(null);
    }
  };

  // ─── Duplicate product ──────────────────────────────────────
  const handleDuplicate = async (productId) => {
    try {
      const res = await fetch("/api/admin/products/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to duplicate product");
      }

      showToast("Product duplicated successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  // ─── Archive / Unarchive product ────────────────────────────
  const handleArchiveToggle = async (product) => {
    const action = product.isArchived ? "unarchive" : "archive";
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, productIds: [product._id] }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to ${action} product`);
      }

      showToast(
        product.isArchived
          ? "Product unarchived successfully!"
          : "Product archived successfully!"
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  // ─── Bulk action handler ────────────────────────────────────
  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;

    if (bulkAction === "delete") {
      const confirmed = window.confirm(
        `Delete ${selectedIds.size} product(s)? This cannot be undone.`
      );
      if (!confirmed) return;
    }

    setBulkSubmitting(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: bulkAction,
          productIds: Array.from(selectedIds),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Bulk action failed");
      }

      const data = await res.json();
      showToast(
        `${bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)} applied to ${data.modifiedCount || selectedIds.size} product(s)!`
      );
      clearSelection();
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setBulkSubmitting(false);
    }
  };

  // ─── Stock adjustment ───────────────────────────────────────
  const handleStockAdjust = async () => {
    if (!stockModal) return;
    const { type, quantity, reason } = stockModal;
    if (!quantity || Number(quantity) <= 0) {
      showToast("Quantity must be greater than 0", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: stockModal.productId,
          type,
          quantity: Number(quantity),
          reason: reason || "",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to adjust stock");
      }

      showToast("Stock adjusted successfully!");
      setStockModal(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  // ─── Open edit modal ────────────────────────────────────────
  const openEdit = (product) => {
    const discount = product.price?.discount || { type: "none", value: 0 };
    setFormData({
      name: getName(product),
      category:
        (typeof product.category === "object"
          ? product.category?._id
          : product.category) || "",
      subcategory:
        (typeof product.subcategory === "object"
          ? product.subcategory?._id
          : product.subcategory) || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: getPrice(product),
      discountType: discount.type || "none",
      discountValue: discount.value || "",
      sku: product.sku || "",
      brand: product.brand || "",
      stock: getStock(product),
      moq: getMoq(product),
      boxQty: getBoxQty(product),
      image: getImage(product),
      priceRange: product.priceRange || "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      isFeatured: getIsFeatured(product),
      isActive: product.isActive !== false,
    });
    setEditProduct(product);
  };

  // ─── Open create modal ──────────────────────────────────────
  const openCreate = () => {
    setFormData({ ...EMPTY_FORM });
    setFormSubcategories([]);
    setShowCreateModal(true);
  };

  // ─── Open stock modal ───────────────────────────────────────
  const openStockModal = (product) => {
    setStockModal({
      productId: product._id,
      productName: getName(product),
      currentStock: getStock(product),
      type: "increase",
      quantity: "",
      reason: "",
    });
  };

  // ─── Form input component ───────────────────────────────────
  const FormField = ({ label, required, children, span2 }) => (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-neutral-600 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass =
    "w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm";
  const selectClass =
    "w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm bg-white";

  // ─── Product form (shared for create & edit) ────────────────
  const renderForm = (onSubmit, submitLabel) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Product Name" required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          placeholder="e.g. E-Moto X500"
        />
      </FormField>

      <FormField label="Brand">
        <input
          type="text"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          className={inputClass}
          placeholder="e.g. EVWheels"
        />
      </FormField>

      <FormField label="Category" required>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
              subcategory: "",
            })
          }
          className={selectClass}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Subcategory" required>
        <select
          value={formData.subcategory}
          onChange={(e) =>
            setFormData({ ...formData, subcategory: e.target.value })
          }
          className={selectClass}
          disabled={!formData.category}
        >
          <option value="">Select Subcategory</option>
          {formSubcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Short Description" span2>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          className={inputClass}
          placeholder="Brief product tagline..."
        />
      </FormField>

      <FormField label="Full Description" span2>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`${inputClass} h-28 resize-none`}
          placeholder="Detailed product description..."
        />
      </FormField>

      <FormField label="Price (₹)" required>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          className={inputClass}
          placeholder="0"
          min="0"
          step="0.01"
        />
      </FormField>

      <FormField label="Discount">
        <div className="flex gap-3">
          <select
            value={formData.discountType}
            onChange={(e) =>
              setFormData({ ...formData, discountType: e.target.value })
            }
            className={`${selectClass} w-2/5`}
          >
            <option value="none">None</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
          {formData.discountType !== "none" && (
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({ ...formData, discountValue: e.target.value })
              }
              className={`${inputClass} flex-1`}
              placeholder="Value"
              min="0"
              step="0.01"
            />
          )}
        </div>
      </FormField>

      <FormField label="SKU">
        <input
          type="text"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className={inputClass}
          placeholder="e.g. EVM-X500-BLK"
        />
      </FormField>

      <FormField label="Stock">
        <input
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          className={inputClass}
          min="0"
        />
      </FormField>

      <FormField label="MOQ">
        <input
          type="number"
          value={formData.moq}
          onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
          className={inputClass}
          min="1"
        />
      </FormField>

      <FormField label="Box Qty">
        <input
          type="number"
          value={formData.boxQty}
          onChange={(e) =>
            setFormData({ ...formData, boxQty: e.target.value })
          }
          className={inputClass}
          min="1"
        />
      </FormField>

      <FormField label="Image URL" span2>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className={inputClass}
          placeholder="https://example.com/image.jpg"
        />
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-3 max-h-40 rounded-lg border border-neutral-200/60 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </FormField>

      <FormField label="Price Range">
        <input
          type="text"
          value={formData.priceRange}
          onChange={(e) =>
            setFormData({ ...formData, priceRange: e.target.value })
          }
          className={inputClass}
          placeholder="e.g. under-50000"
        />
      </FormField>

      <FormField label="Tags (comma-separated)">
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className={inputClass}
          placeholder="electric, scooter, commuter"
        />
      </FormField>

      <div className="md:col-span-2 flex items-center gap-8 pt-2">
        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, isFeatured: !formData.isFeatured })
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          {formData.isFeatured ? (
            <ToggleRight size={32} className="text-emerald-600" />
          ) : (
            <ToggleLeft size={32} className="text-neutral-400" />
          )}
          <span
            className={`text-sm font-medium ${
              formData.isFeatured ? "text-emerald-700" : "text-neutral-500"
            }`}
          >
            Featured
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setFormData({ ...formData, isActive: !formData.isActive })
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          {formData.isActive ? (
            <ToggleRight size={32} className="text-emerald-600" />
          ) : (
            <ToggleLeft size={32} className="text-neutral-400" />
          )}
          <span
            className={`text-sm font-medium ${
              formData.isActive ? "text-emerald-700" : "text-neutral-500"
            }`}
          >
            Active
          </span>
        </button>
      </div>

      <div className="flex gap-4 pt-4 md:col-span-2">
        <button
          onClick={() => {
            setShowCreateModal(false);
            setEditProduct(null);
            setFormData({ ...EMPTY_FORM });
          }}
          disabled={submitting}
          className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {submitting
            ? submitLabel === "Create Product"
              ? "Creating..."
              : "Updating..."
            : submitLabel}
        </button>
      </div>
    </div>
  );

  // ─── Loading skeleton ───────────────────────────────────────
  const renderLoading = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50/70">
            <tr>
              {[
                "",
                "Image",
                "Name",
                "Category",
                "Subcategory",
                "Brand",
                "Price",
                "Stock",
                "Status",
                "Featured",
                "Actions",
              ].map((h, i) => (
                <th
                  key={i}
                  className="py-5 px-4 text-left text-sm font-medium text-neutral-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                {[...Array(11)].map((_, j) => (
                  <td key={j} className="py-5 px-4">
                    <div className="h-4 bg-neutral-100 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Empty state ────────────────────────────────────────────
  const renderEmpty = () => (
    <div className="border border-neutral-200/60 rounded-xl py-20 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <Package size={36} className="text-neutral-400" />
      </div>
      <h3 className="text-xl font-['Playfair_Display'] font-medium text-neutral-800 mb-2">
        No products yet
      </h3>
      <p className="text-neutral-500 text-sm max-w-sm mb-8">
        {searchQuery || categoryFilter || statusFilter !== "all"
          ? "No products match your current filters. Try adjusting your search criteria."
          : "Create your first product to start building your catalogue."}
      </p>
      {!searchQuery && !categoryFilter && statusFilter === "all" && (
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      )}
    </div>
  );

  // ─── Status badge ───────────────────────────────────────────
  const StatusBadge = ({ product }) => {
    const status = getStatus(product);
    const styles = {
      active: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
      inactive: "bg-amber-50 text-amber-700 border-amber-200/60",
      archived: "bg-neutral-100 text-neutral-600 border-neutral-200/60",
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ─── Product table ──────────────────────────────────────────
  const renderTable = () => {
    if (products.length === 0) return renderEmpty();

    return (
      <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50/70">
              <tr>
                <th className="py-5 px-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-neutral-400 hover:text-emerald-700 transition-colors"
                  >
                    {selectedIds.size === products.length &&
                    products.length > 0 ? (
                      <CheckSquare size={18} className="text-emerald-700" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="py-5 px-4 w-16 text-left text-sm font-medium text-neutral-600">
                  Image
                </th>
                <th
                  className="py-5 px-4 text-left text-sm font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-900 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Name <SortIcon field="name" />
                  </span>
                </th>
                <th className="py-5 px-4 text-left text-sm font-medium text-neutral-600">
                  Category
                </th>
                <th className="py-5 px-4 text-left text-sm font-medium text-neutral-600 hidden xl:table-cell">
                  Subcategory
                </th>
                <th className="py-5 px-4 text-left text-sm font-medium text-neutral-600 hidden lg:table-cell">
                  Brand
                </th>
                <th
                  className="py-5 px-4 text-left text-sm font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-900 transition-colors"
                  onClick={() => handleSort("price")}
                >
                  <span className="inline-flex items-center gap-1">
                    Price <SortIcon field="price" />
                  </span>
                </th>
                <th
                  className="py-5 px-4 text-left text-sm font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-900 transition-colors"
                  onClick={() => handleSort("stock")}
                >
                  <span className="inline-flex items-center gap-1">
                    Stock <SortIcon field="stock" />
                  </span>
                </th>
                <th className="py-5 px-4 text-left text-sm font-medium text-neutral-600">
                  Status
                </th>
                <th className="py-5 px-4 text-left text-sm font-medium text-neutral-600 hidden md:table-cell">
                  Featured
                </th>
                <th className="py-5 px-4 w-28 text-right text-sm font-medium text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {products.map((product) => {
                const isSelected = selectedIds.has(product._id);
                const stock = getStock(product);
                return (
                  <tr
                    key={product._id}
                    className={`hover:bg-neutral-50/50 transition-colors ${
                      isSelected ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleSelect(product._id)}
                        className="text-neutral-400 hover:text-emerald-700 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare
                            size={18}
                            className="text-emerald-700"
                          />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>

                    {/* Image */}
                    <td className="py-4 px-4">
                      {getImage(product) ? (
                        <img
                          src={getImage(product)}
                          alt={getName(product)}
                          className="w-10 h-10 object-cover rounded-lg border border-neutral-200/60"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center text-neutral-400 text-xs ${
                          getImage(product) ? "hidden" : "flex"
                        }`}
                      >
                        N/A
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4">
                      <span
                        className="font-medium text-neutral-900 max-w-[200px] truncate block"
                        title={getName(product)}
                      >
                        {getName(product)}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-full">
                        {getCategoryName(product)}
                      </span>
                    </td>

                    {/* Subcategory */}
                    <td className="py-4 px-4 text-sm text-neutral-600 hidden xl:table-cell">
                      {getSubcategoryName(product)}
                    </td>

                    {/* Brand */}
                    <td className="py-4 px-4 text-sm text-neutral-600 hidden lg:table-cell">
                      {product.brand || "—"}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4">
                      <span className="font-medium text-emerald-800">
                        ₹{getPrice(product).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => openStockModal(product)}
                        className="flex items-center gap-1 group cursor-pointer"
                        title="Click to adjust stock"
                      >
                        <span
                          className={
                            stock < 10
                              ? "text-red-700 font-medium"
                              : "text-emerald-700 font-medium"
                          }
                        >
                          {stock}
                        </span>
                        {stock < 10 && stock > 0 && (
                          <TrendingDown
                            size={14}
                            className="text-red-500 group-hover:hidden"
                          />
                        )}
                        {stock < 10 && stock > 0 && (
                          <Edit2
                            size={12}
                            className="text-neutral-400 hidden group-hover:block"
                          />
                        )}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge product={product} />
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      {getIsFeatured(product) ? (
                        <Star
                          size={18}
                          className="text-amber-500 fill-amber-500"
                        />
                      ) : (
                        <Star
                          size={18}
                          className="text-neutral-300"
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product._id)}
                          className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Duplicate product"
                        >
                          <Copy size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(
                                actionMenuId === product._id
                                  ? null
                                  : product._id
                              );
                            }}
                            className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <AnimatePresence>
                            {actionMenuId === product._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-10 bg-white border border-neutral-200/70 rounded-xl shadow-xl py-2 w-48 z-50"
                              >
                                <button
                                  onClick={() => {
                                    handleArchiveToggle(product);
                                    setActionMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                >
                                  {product.isArchived ? (
                                    <>
                                      <ArchiveRestore size={16} />
                                      Unarchive
                                    </>
                                  ) : (
                                    <>
                                      <Archive size={16} />
                                      Archive
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    openStockModal(product);
                                    setActionMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                >
                                  <TrendingUp size={16} />
                                  Adjust Stock
                                </button>
                                <hr className="my-1 border-neutral-100" />
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(product);
                                    setActionMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ─── Pagination ─────────────────────────────────────────────
  const renderPagination = () => {
    if (totalProducts <= ITEMS_PER_PAGE) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-neutral-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of{" "}
          {totalProducts} products
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="w-10 h-10 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="w-10 h-10 flex items-center justify-center text-neutral-400 text-sm">
                  ...
                </span>
              )}
            </>
          )}
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-emerald-800 text-white"
                  : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="w-10 h-10 flex items-center justify-center text-neutral-400 text-sm">
                  ...
                </span>
              )}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="w-10 h-10 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  // ─── Bulk action bar ────────────────────────────────────────
  const renderBulkBar = () => {
    if (selectedIds.size === 0) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-neutral-200/70 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4"
        >
          <span className="text-sm font-medium text-neutral-700">
            {selectedIds.size} selected
          </span>

          <div className="h-6 w-px bg-neutral-200" />

          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="">Choose action...</option>
            <option value="activate">Activate</option>
            <option value="deactivate">Deactivate</option>
            <option value="archive">Archive</option>
            <option value="unarchive">Unarchive</option>
            <option value="feature">Feature</option>
            <option value="unfeature">Unfeature</option>
            <option value="delete">Delete</option>
          </select>

          <button
            onClick={handleBulkAction}
            disabled={!bulkAction || bulkSubmitting}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              bulkAction === "delete"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            }`}
          >
            {bulkSubmitting && <Loader2 size={16} className="animate-spin" />}
            Apply
          </button>

          <button
            onClick={clearSelection}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ─── Toast notification ─────────────────────────────────────
  const renderToast = () => {
    if (!toast) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={`fixed top-6 right-6 z-[100] px-6 py-3.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-800 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckSquare size={18} />
          )}
          {toast.message}
        </motion.div>
      </AnimatePresence>
    );
  };

  // ─── Main render ────────────────────────────────────────────
  return (
    <section>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
              Products
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              {totalProducts} total products
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* ─── Filters bar ─── */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter("");
            }}
            className="px-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Subcategory filter (cascading) */}
          {categoryFilter && (
            <select
              value={subcategoryFilter}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="px-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm min-w-[180px]"
            >
              <option value="">All Subcategories</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>

          {/* Price Range filter */}
          <select
            value={priceRangeFilter}
            onChange={(e) => setPriceRangeFilter(e.target.value)}
            className="px-5 py-3.5 border border-neutral-200/70 rounded-xl bg-white focus:outline-none focus:border-emerald-600 transition-colors text-sm min-w-[150px]"
          >
            <option value="">All Prices</option>
            <option value="under-10000">Under ₹10,000</option>
            <option value="10000-25000">₹10,000 – ₹25,000</option>
            <option value="25000-50000">₹25,000 – ₹50,000</option>
            <option value="50000-100000">₹50,000 – ₹1,00,000</option>
            <option value="above-100000">Above ₹1,00,000</option>
          </select>
        </div>

        {/* ─── Active filters indicator ─── */}
        {(searchQuery ||
          categoryFilter ||
          subcategoryFilter ||
          statusFilter !== "all" ||
          priceRangeFilter) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter size={14} className="text-neutral-400" />
            <span className="text-xs text-neutral-500">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                Search: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            {categoryFilter && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full">
                Category:{" "}
                {categories.find((c) => c._id === categoryFilter)?.name || "..."}
              </span>
            )}
            {subcategoryFilter && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full">
                Subcategory:{" "}
                {subcategories.find((s) => s._id === subcategoryFilter)?.name ||
                  "..."}
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                Status: {statusFilter}
              </span>
            )}
            {priceRangeFilter && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                Price: {priceRangeFilter}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setSubcategoryFilter("");
                setStatusFilter("all");
                setPriceRangeFilter("");
              }}
              className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ─── Table / Loading / Empty ─── */}
        {loading ? renderLoading() : renderTable()}

        {/* ─── Pagination ─── */}
        {!loading && products.length > 0 && renderPagination()}
      </motion.div>

      {/* ─── Bulk Action Bar ─── */}
      {renderBulkBar()}

      {/* ─── Toast ─── */}
      {renderToast()}

      {/* ─── Create Product Modal ─── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-3xl p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-['Playfair_Display'] font-medium">
                  Add New Product
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
              {renderForm(handleCreate, "Create Product")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Edit Product Modal ─── */}
      <AnimatePresence>
        {editProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-3xl p-8 md:p-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-['Playfair_Display'] font-medium">
                  Edit Product
                </h2>
                <button
                  onClick={() => {
                    setEditProduct(null);
                    setFormData({ ...EMPTY_FORM });
                  }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {renderForm(handleUpdate, "Update Product")}
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-['Playfair_Display'] font-medium text-neutral-900">
                    Delete Product
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-neutral-700 mb-8">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {getName(deleteConfirm)}
                </span>
                ? All product data will be permanently removed.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Stock Adjustment Modal ─── */}
      <AnimatePresence>
        {stockModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 md:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-['Playfair_Display'] font-medium">
                  Adjust Stock
                </h2>
                <button
                  onClick={() => setStockModal(null)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-sm text-neutral-500 mb-2">
                Product:{" "}
                <span className="font-medium text-neutral-800">
                  {stockModal.productName}
                </span>
              </p>
              <p className="text-sm text-neutral-500 mb-6">
                Current stock:{" "}
                <span className="font-semibold text-emerald-800">
                  {stockModal.currentStock}
                </span>
              </p>

              <div className="space-y-5">
                {/* Adjustment type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Adjustment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "increase", label: "Increase", icon: TrendingUp },
                      { value: "decrease", label: "Decrease", icon: TrendingDown },
                      { value: "restock", label: "Restock", icon: Package },
                      { value: "adjustment", label: "Set to", icon: ArrowUpDown },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() =>
                          setStockModal({ ...stockModal, type: value })
                        }
                        className={`flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                          stockModal.type === value
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                            : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    {stockModal.type === "adjustment"
                      ? "New Stock Level"
                      : "Quantity"}
                  </label>
                  <input
                    type="number"
                    value={stockModal.quantity}
                    onChange={(e) =>
                      setStockModal({ ...stockModal, quantity: e.target.value })
                    }
                    className={inputClass}
                    placeholder="0"
                    min="0"
                    autoFocus
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    Reason <span className="text-neutral-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={stockModal.reason}
                    onChange={(e) =>
                      setStockModal({ ...stockModal, reason: e.target.value })
                    }
                    className={inputClass}
                    placeholder="e.g. New shipment arrived"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStockModal(null)}
                  className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockAdjust}
                  className="flex-1 py-3.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
                >
                  Update Stock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
