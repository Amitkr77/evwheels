'use client';

import React, { useState } from 'react';
import { 
  Home, ShoppingCart, Package, Ticket, Star, Bell, Plus, Search, 
  Calendar, Download, Users, TrendingUp, LogOut, Eye, Trash2, Edit2 
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' ,
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
  });

  // Data
  const [products, setProducts] = useState([
    { 
      id: 'p1', 
      title: "Wireless Headphones", 
      description: "Premium noise-cancelling over-ear headphones with 40hr battery", 
      price: "₹2,499", 
      image: "https://picsum.photos/id/20/400/300", 
      stock: 124, 
      sold: 342 
    },
    { 
      id: 'p2', 
      title: "Smart Watch Pro", 
      description: "1.8\" AMOLED display, heart rate, GPS & 14-day battery", 
      price: "₹4,999", 
      image: "https://picsum.photos/id/60/400/300", 
      stock: 87, 
      sold: 219 
    },
  ]);

  const [coupons, setCoupons] = useState([
    { 
      id: 'c1', 
      code: "WELCOME20", 
      discountType: 'percentage', 
      discountValue: 20, 
      minOrderAmount: 999, 
      expiryDate: "2026-03-15", 
      used: 142 
    },
    { 
      id: 'c2', 
      code: "FREESHIP", 
      discountType: 'fixed', 
      discountValue: 99, 
      minOrderAmount: 499, 
      expiryDate: "2026-04-01", 
      used: 89 
    },
  ]);

  const [reviews, setReviews] = useState([
    { 
      id: 'r1', 
      product: "Wireless Headphones", 
      user: "Neha Patel", 
      rating: 5, 
      comment: "Sound quality is amazing and noise cancellation is top class!", 
      date: "Feb 28", 
      status: 'approved' 
    },
    { 
      id: 'r2', 
      product: "Smart Watch Pro", 
      user: "Vikash Sharma", 
      rating: 4, 
      comment: "Battery lasts really long but strap could be better", 
      date: "Feb 27", 
      status: 'pending' 
    },
  ]);

  // Chart Data (same as before)
  const chartData = { /* same as previous */ };
  const chartOptions = { /* same as previous */ };

  // Add Product
  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert("Please fill Title, Price & Image");
      return;
    }

    const product = {
      id: 'p' + Date.now(),
      title: newProduct.title,
      description: newProduct.description,
      price: `₹${newProduct.price}`,
      image: newProduct.image,
      stock: Math.floor(Math.random() * 150) + 50,
      sold: Math.floor(Math.random() * 400) + 100,
    };

    setProducts([product, ...products]);
    setNewProduct({ title: '', description: '', price: '', image: '' });
    setShowAddProduct(false);
    alert("✅ Product added successfully!");
  };

  // Add Coupon
  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.discountValue || !newCoupon.expiryDate) {
      alert("Please fill all fields");
      return;
    }

    const coupon = {
      id: 'c' + Date.now(),
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
      expiryDate: newCoupon.expiryDate,
      used: 0,
    };

    setCoupons([coupon, ...coupons]);
    setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiryDate: '' });
    setShowAddCoupon(false);
    alert("✅ Coupon created successfully!");
  };

  // Review Actions
  const approveReview = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const rejectReview = (id) => {
    if (confirm("Reject this review?")) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  // Render Products Table
  const renderProductsTable = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-6 px-8 text-left font-medium text-sm w-16">Image</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Title</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Description</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Price</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Stock</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Sold</th>
            <th className="py-6 px-8 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-6 px-8">
                <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-xl" />
              </td>
              <td className="py-6 px-8 font-semibold">{product.title}</td>
              <td className="py-6 px-8 text-gray-600 text-sm line-clamp-2 max-w-md">{product.description}</td>
              <td className="py-6 px-8 font-bold">{product.price}</td>
              <td className="py-6 px-8">
                <span className={`font-medium ${product.stock < 100 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {product.stock}
                </span>
              </td>
              <td className="py-6 px-8 text-gray-600">{product.sold}</td>
              <td className="py-6 px-8 flex gap-3">
                <button className="text-violet-600"><Edit2 size={18} /></button>
                <button className="text-red-500" onClick={() => {
                  if (confirm('Delete product?')) setProducts(products.filter(p => p.id !== product.id));
                }}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Coupons Table
  const renderCouponsTable = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-6 px-8 text-left font-medium text-sm">Code</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Type</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Value</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Min Order</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Expires</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Used</th>
            <th className="py-6 px-8 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map(coupon => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="py-6 px-8 font-mono text-lg font-semibold">{coupon.code}</td>
              <td className="py-6 px-8">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed ₹'}
                </span>
              </td>
              <td className="py-6 px-8 font-semibold">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </td>
              <td className="py-6 px-8">₹{coupon.minOrderAmount}</td>
              <td className="py-6 px-8 text-gray-500">{coupon.expiryDate}</td>
              <td className="py-6 px-8">{coupon.used}</td>
              <td className="py-6 px-8">
                <button 
                  onClick={() => {
                    if (confirm(`Delete ${coupon.code}?`)) {
                      setCoupons(coupons.filter(c => c.id !== coupon.id));
                    }
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Reviews Table
  const renderReviewsTable = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-6 px-8 text-left font-medium text-sm">Product</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Customer</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Rating</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Comment</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Date</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Status</th>
            <th className="py-6 px-8 w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reviews.map(review => (
            <tr key={review.id} className="hover:bg-gray-50">
              <td className="py-6 px-8 font-medium">{review.product}</td>
              <td className="py-6 px-8">{review.user}</td>
              <td className="py-6 px-8 text-amber-500 font-bold">{'★'.repeat(review.rating)}</td>
              <td className="py-6 px-8 text-gray-600 max-w-md line-clamp-2">{review.comment}</td>
              <td className="py-6 px-8 text-gray-500">{review.date}</td>
              <td className="py-6 px-8">
                <span className={`px-4 py-1 text-xs font-medium rounded-full
                  ${review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    review.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {review.status.toUpperCase()}
                </span>
              </td>
              <td className="py-6 px-8 flex gap-2">
                {review.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => approveReview(review.id)}
                      className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-2xl hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => rejectReview(review.id)}
                      className="bg-red-600 text-white text-xs px-4 py-2 rounded-2xl hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar (same as before) */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* ... same sidebar code as previous version ... */}
        {/* (I'm keeping it identical for brevity - copy from your previous file) */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">S</div>
            <div>
              <span className="font-bold text-3xl tracking-tighter">Shopify</span>
              <span className="text-xs text-gray-500 block -mt-1">admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="space-y-1">
            {[
              { icon: Home, label: "Dashboard", tab: 0 },
              { icon: ShoppingCart, label: "Orders", tab: 1, badge: "42" },
              { icon: Package, label: "Products", tab: 2 },
              { icon: Ticket, label: "Coupons", tab: 3 },
              { icon: Star, label: "Reviews", tab: 4, badge: reviews.length.toString() },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-2xl transition-all ${
                  activeTab === item.tab ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100">
          {/* user footer same */}
        </div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar (same) */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          {/* same topbar */}
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Dashboard Tab - unchanged */}
          {activeTab === 0 && (/* same dashboard code */
            <div> dashboard</div>
          )}

          {/* Orders Tab - unchanged */}
          {activeTab === 1 && (/* same orders table */ 
             <div> dashboard</div>
          )}

          {/* ==================== PRODUCTS TAB ==================== */}
          {activeTab === 2 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Products</h1>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-3 px-8 h-12 rounded-2xl font-medium"
                >
                  <Plus size={20} /> Add New Product
                </button>
              </div>
              {renderProductsTable()}
            </div>
          )}

          {/* ==================== COUPONS TAB ==================== */}
          {activeTab === 3 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Coupons</h1>
                <button 
                  onClick={() => setShowAddCoupon(true)}
                  className="bg-violet-600 text-white flex items-center gap-3 px-8 h-12 rounded-2xl font-medium"
                >
                  <Plus size={20} /> Create Coupon
                </button>
              </div>
              {renderCouponsTable()}
            </div>
          )}

          {/* ==================== REVIEWS TAB ==================== */}
          {activeTab === 4 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Customer Reviews</h1>
                <div className="text-gray-500">Showing {reviews.length} reviews</div>
              </div>
              {renderReviewsTable()}
            </div>
          )}
        </div>
      </div>

      {/* ==================== ADD PRODUCT MODAL ==================== */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold mb-8">Add New Product</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Title</label>
                  <input 
                    type="text" 
                    value={newProduct.title}
                    onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="Wireless Headphones Pro"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 h-32 focus:outline-none focus:border-violet-500"
                    placeholder="Premium noise cancelling headphones..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="2499"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input 
                    type="text" 
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="https://picsum.photos/id/20/400/300"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {newProduct.image && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Image Preview</p>
                  <img src={newProduct.image} alt="preview" className="h-48 w-auto rounded-2xl border" />
                </div>
              )}
            </div>

            <div className="border-t px-10 py-6 flex gap-4 justify-end">
              <button 
                onClick={() => setShowAddProduct(false)}
                className="px-8 py-3.5 font-medium text-gray-600 hover:bg-gray-100 rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD COUPON MODAL ==================== */}
      {showAddCoupon && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold mb-8">Create New Coupon</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <input 
                    type="text" 
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 font-mono uppercase focus:outline-none focus:border-violet-500"
                    placeholder="SUMMER25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Type</label>
                    <select 
                      value={newCoupon.discountType}
                      onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Value</label>
                    <input 
                      type="number" 
                      value={newCoupon.discountValue}
                      onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Order Amount (₹)</label>
                    <input 
                      type="number" 
                      value={newCoupon.minOrderAmount}
                      onChange={e => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input 
                      type="date" 
                      value={newCoupon.expiryDate}
                      onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t px-10 py-6 flex gap-4 justify-end">
              <button onClick={() => setShowAddCoupon(false)} className="px-8 py-3.5 font-medium text-gray-600 hover:bg-gray-100 rounded-2xl">Cancel</button>
              <button onClick={handleAddCoupon} className="px-10 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl">Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;