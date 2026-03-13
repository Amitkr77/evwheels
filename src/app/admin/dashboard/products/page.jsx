"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    brand: "",
    stock: 0,
    featured: false,
    color: "",
    warranty: 0,
    specs: {
      battery: { capacity: 0, range: 0, chargingTime: 0, type: "" },
      motor: { power: 0, type: "", topSpeed: 0, pedalAssistLevels: 0 },
      physical: { weight: 0, frameMaterial: "", wheelSize: 0, maxLoad: 0 },
      components: { brakeType: "", suspension: "", gearSystem: "" },
      smartFeatures: { displayType: "", mobileAppSupport: false, gps: false },
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add product via API
  const handleAddProduct = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const addedProduct = await res.json();
      setProducts([addedProduct, ...products]);
      setShowAddProduct(false);
      setNewProduct({
        title: "",
        description: "",
        price: "",
        image: "",
        brand: "",
        stock: 0,
        featured: false,
        color: "",
        warranty: 0,
        specs: {
          battery: { capacity: 0, range: 0, chargingTime: 0, type: "" },
          motor: { power: 0, type: "", topSpeed: 0, pedalAssistLevels: 0 },
          physical: { weight: 0, frameMaterial: "", wheelSize: 0, maxLoad: 0 },
          components: { brakeType: "", suspension: "", gearSystem: "" },
          smartFeatures: {
            displayType: "",
            mobileAppSupport: false,
            gps: false,
          },
        },
      });
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding product!");
    }
  };

  const renderProductsTable = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            <th className="py-5 px-6 w-16 text-left text-sm font-medium text-neutral-600">
              Image
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Title
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Brand
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Price
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Stock
            </th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
              Featured
            </th>
            <th className="py-5 px-6 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {loading ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-neutral-500">
                Loading products...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-neutral-500">
                No products found.
              </td>
            </tr>
          ) : (
            products?.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-neutral-50/50 transition-colors"
              >
                <td className="py-6 px-6">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-6 px-6 font-medium">{product.title}</td>
                <td className="py-6 px-6">{product.brand}</td>
                <td className="py-6 px-6 font-medium text-emerald-800">
                  ₹{product.price?.toLocaleString("en-IN")}
                </td>
                <td className="py-6 px-6">
                  <span
                    className={
                      product.stock < 10
                        ? "text-red-700 font-medium"
                        : "text-emerald-700 font-medium"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="py-6 px-6">
                  {product.featured ? (
                    <span className="text-white text-xs bg-emerald-700 px-2 py-1 rounded-full">
                      Yes
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-xs">No</span>
                  )}
                </td>
                <td className="py-6 px-6 flex gap-4">
                  <button className="text-emerald-700 hover:text-emerald-900">
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      if (confirm("Delete product?"))
                        setProducts(
                          products.filter((p) => p._id !== product._id),
                        );
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
            Products
          </h1>
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
        {renderProductsTable()}
      </motion.div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-3xl p-8 md:p-10 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-10">
              Add New Product
            </h2>

            {/* Product Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-32 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={newProduct.color}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, color: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  checked={newProduct.featured}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, featured: e.target.checked })
                  }
                />
                <span>Featured</span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
                {newProduct.image && (
                  <img
                    src={newProduct.image}
                    alt="preview"
                    className="mt-4 max-h-48 rounded-lg border border-neutral-200/60"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Add Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
