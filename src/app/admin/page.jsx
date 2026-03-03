"use client";

import React, { useState } from "react";
import {
  Home,
  ShoppingCart,
  Package,
  Ticket,
  Star,
  Bell,
  Plus,
  Search,
  Calendar,
  Download,
  Users,
  TrendingUp,
  LogOut,
  Eye,
  Trash2,
  Edit2,
  ArrowRight 
} from "lucide-react";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  // Sample Data (unchanged)
  const [orders, setOrders] = useState([
    { id: "#ORD-9821", customer: "Rahul Verma", items: 3, total: "₹2,899", status: "Delivered", date: "Feb 28" },
    { id: "#ORD-9820", customer: "Priya Singh", items: 1, total: "₹899", status: "Shipped", date: "Feb 27" },
    { id: "#ORD-9819", customer: "Aman Kumar", items: 5, total: "₹4,299", status: "Pending", date: "Feb 27" },
    { id: "#ORD-9818", customer: "Sneha Gupta", items: 2, total: "₹1,599", status: "Delivered", date: "Feb 26" },
  ]);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const [products, setProducts] = useState([
    { id: "p1", title: "Wireless Headphones", description: "Premium noise-cancelling over-ear headphones with 40hr battery", price: "₹2,499", image: "https://picsum.photos/id/20/400/300", stock: 124, sold: 342 },
    { id: "p2", title: "Smart Watch Pro", description: '1.8" AMOLED display, heart rate, GPS & 14-day battery', price: "₹4,999", image: "https://picsum.photos/id/60/400/300", stock: 87, sold: 219 },
  ]);

  const [coupons, setCoupons] = useState([
    { id: "c1", code: "WELCOME20", discountType: "percentage", discountValue: 20, minOrderAmount: 999, expiryDate: "2026-03-15", used: 142 },
    { id: "c2", code: "FREESHIP", discountType: "fixed", discountValue: 99, minOrderAmount: 499, expiryDate: "2026-04-01", used: 89 },
  ]);

  const [reviews, setReviews] = useState([
    { id: "r1", product: "Wireless Headphones", user: "Neha Patel", rating: 5, comment: "Sound quality is amazing and noise cancellation is top class!", date: "Feb 28", status: "approved" },
    { id: "r2", product: "Smart Watch Pro", user: "Vikash Sharma", rating: 4, comment: "Battery lasts really long but strap could be better", date: "Feb 27", status: "pending" },
  ]);

  // Sales Chart Data (unchanged)
  const chartData = {
    labels: ["Feb 24", "Feb 25", "Feb 26", "Feb 27", "Feb 28", "Mar 1", "Mar 2"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [12400, 18900, 15200, 22400, 19800, 27100, 31200],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.08)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#064e3b",
        titleFont: { size: 14 },
        bodyFont: { size: 16, weight: "600" },
        displayColors: false,
        callbacks: { label: (ctx) => "₹" + ctx.raw.toLocaleString("en-IN") },
      },
    },
    scales: {
      y: { grid: { color: "#e5e7eb" }, ticks: { callback: (v) => "₹" + v / 1000 + "k" } },
      x: { grid: { color: "#e5e7eb" } },
    },
  };

  // Render Recent Orders (Dashboard)
  const renderRecentOrders = () => {
    return orders.slice(0, 4).map((order, i) => (
      <tr key={i} className="border-b border-neutral-200/60 last:border-b-0 hover:bg-neutral-50/50 transition-colors">
        <td className="py-5 px-6 font-mono text-sm text-neutral-600">{order.id}</td>
        <td className="py-5 px-6">{order.customer}</td>
        <td className="py-5 px-6 font-medium">{order.total}</td>
        <td className="py-5 px-6">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
              order.status === "Delivered"
                ? "bg-emerald-50 text-emerald-800"
                : order.status === "Shipped"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                order.status === "Delivered"
                  ? "bg-emerald-600"
                  : order.status === "Shipped"
                  ? "bg-blue-600"
                  : "bg-amber-600"
              }`}
            />
            {order.status}
          </span>
        </td>
        <td className="py-5 px-6 text-neutral-600">{order.date}</td>
      </tr>
    ));
  };

  // Render Full Orders Table
  const renderOrdersTable = () => {
    return orders.map((order, i) => (
      <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
        <td className="py-6 px-8 font-mono text-sm">{order.id}</td>
        <td className="py-6 px-8">{order.customer}</td>
        <td className="py-6 px-8">{order.items} items</td>
        <td className="py-6 px-8 font-medium">{order.total}</td>
        <td className="py-6 px-8">
          <span
            className={`px-4 py-1.5 text-xs font-medium rounded-full ${
              order.status === "Delivered"
                ? "bg-emerald-50 text-emerald-800"
                : order.status === "Shipped"
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="py-6 px-8 text-neutral-600">{order.date}</td>
        <td className="py-6 px-8">
          <button className="text-emerald-700 hover:text-emerald-900">
            <Eye size={18} />
          </button>
        </td>
      </tr>
    ));
  };

  // Render Products Table
  const renderProductsTable = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600 w-16">Image</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Title</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Description</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Price</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Stock</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Sold</th>
            <th className="py-5 px-6 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
              <td className="py-6 px-6">
                <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
              </td>
              <td className="py-6 px-6 font-medium">{product.title}</td>
              <td className="py-6 px-6 text-neutral-600 text-sm line-clamp-2 max-w-md">{product.description}</td>
              <td className="py-6 px-6 font-medium text-emerald-800">{product.price}</td>
              <td className="py-6 px-6">
                <span className={`font-medium ${product.stock < 100 ? "text-red-700" : "text-emerald-700"}`}>
                  {product.stock}
                </span>
              </td>
              <td className="py-6 px-6 text-neutral-600">{product.sold}</td>
              <td className="py-6 px-6 flex gap-4">
                <button className="text-emerald-700 hover:text-emerald-900">
                  <Edit2 size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    if (confirm("Delete product?")) setProducts(products.filter((p) => p.id !== product.id));
                  }}
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

  // Render Coupons Table
  const renderCouponsTable = () => (
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Code</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Type</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Value</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Min Order</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Expires</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Used</th>
            <th className="py-5 px-6 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors">
              <td className="py-6 px-6 font-mono text-lg font-medium">{coupon.code}</td>
              <td className="py-6 px-6">
                <span className="px-3 py-1 text-xs font-medium bg-neutral-100 rounded-full">
                  {coupon.discountType === "percentage" ? "Percentage" : "Fixed ₹"}
                </span>
              </td>
              <td className="py-6 px-6 font-medium">
                {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </td>
              <td className="py-6 px-6">₹{coupon.minOrderAmount}</td>
              <td className="py-6 px-6 text-neutral-600">{coupon.expiryDate}</td>
              <td className="py-6 px-6 text-neutral-700">{coupon.used}</td>
              <td className="py-6 px-6">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${coupon.code}?`)) setCoupons(coupons.filter((c) => c.id !== coupon.id));
                  }}
                  className="text-red-600 hover:text-red-800"
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
    <div className="border border-neutral-200/60 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50/70">
          <tr>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Product</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Customer</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Rating</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Comment</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
            <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
            <th className="py-5 px-6 w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/60">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-neutral-50/50 transition-colors">
              <td className="py-6 px-6 font-medium">{review.product}</td>
              <td className="py-6 px-6">{review.user}</td>
              <td className="py-6 px-6 text-amber-700 font-medium">{"★".repeat(review.rating)}</td>
              <td className="py-6 px-6 text-neutral-600 max-w-md line-clamp-2">{review.comment}</td>
              <td className="py-6 px-6 text-neutral-600">{review.date}</td>
              <td className="py-6 px-6">
                <span
                  className={`px-4 py-1 text-xs font-medium rounded-full ${
                    review.status === "approved"
                      ? "bg-emerald-50 text-emerald-800"
                      : review.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {review.status?.toUpperCase()}
                </span>
              </td>
              <td className="py-6 px-8 flex gap-3">
                {review.status === "pending" && (
                  <>
                    <button
                      onClick={() => approveReview(review.id)}
                      className="px-4 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectReview(review.id)}
                      className="px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
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

  // Add Product Handler (simplified prompt version)
  const handleAddProduct = () => {
    const title = prompt("Product title:");
    if (!title) return;
    const price = prompt("Price (₹):", "2499");
    const image = prompt("Image URL:", "https://picsum.photos/400/300");

    const newItem = {
      id: "p" + Date.now(),
      title,
      description: "New product added",
      price: `₹${price}`,
      image,
      stock: Math.floor(Math.random() * 150) + 50,
      sold: Math.floor(Math.random() * 300),
    };
    setProducts([newItem, ...products]);
    alert("Product added!");
  };

  // Add Coupon Handler (simplified prompt version)
  const handleAddCoupon = () => {
    const code = prompt("Coupon code:", "SUMMER25");
    if (!code) return;
    const discount = prompt("Discount (e.g. 25% or ₹500):", "25%");

    const newCoupon = {
      id: "c" + Date.now(),
      code: code.toUpperCase(),
      discountType: discount.includes("%") ? "percentage" : "fixed",
      discountValue: parseInt(discount) || 0,
      minOrderAmount: 0,
      expiryDate: "2026-12-31",
      used: 0,
    };
    setCoupons([newCoupon, ...coupons]);
    alert("Coupon created!");
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] font-['Inter']">
      {/* ─── Sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200/70 overflow-y-auto hidden lg:block">
        <div className="p-8 border-b border-neutral-200/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-['Playfair_Display'] font-semibold text-2xl shadow-sm">
              E
            </div>
            <span className="text-2xl font-['Playfair_Display'] font-medium tracking-tight text-neutral-900">
              EVWheels
            </span>
          </div>
        </div>

        <nav className="p-6 space-y-1">
          {[
            { icon: Home, label: "Dashboard", tab: 0 },
            { icon: ShoppingCart, label: "Orders", tab: 1, badge: "42" },
            { icon: Package, label: "Products", tab: 2 },
            { icon: Ticket, label: "Coupons", tab: 3 },
            { icon: Star, label: "Reviews", tab: 4, badge: "18" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.tab
                  ? "bg-emerald-50/60 text-emerald-800"
                  : "text-neutral-700 hover:bg-neutral-50/80"
              }`}
            >
              <item.icon size={20} strokeWidth={1.6} />
              {item.label}
              {item.badge && (
                <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral-200/60 mt-auto">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-neutral-200 rounded-full overflow-hidden border-2 border-white">
              <img src="https://i.pravatar.cc/128?u=admin" alt="Admin" width={44} height={44} className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-neutral-900">Admin</div>
              <div className="text-xs text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Online
              </div>
            </div>
            <button className="text-neutral-500 hover:text-red-600 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-neutral-200/70 flex items-center px-6 lg:px-12 justify-between">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, products..."
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-emerald-300 rounded-xl py-3 pl-11 pr-4 text-sm font-light focus:outline-none transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-neutral-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                7
              </span>
            </div>

            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
            >
              <Plus size={18} />
              New
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-900">Admin</div>
                <div className="text-xs text-neutral-500">Patna, Bihar</div>
              </div>
              <div className="w-9 h-9 bg-neutral-200 rounded-full overflow-hidden border-2 border-white">
                <img src="https://i.pravatar.cc/128?u=admin" alt="" width={36} height={36} className="object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-12">
          {/* DASHBOARD */}
          {activeTab === 0 && (
            <motion.div initial="hidden" animate="visible" 
            // variants={stagger}
            >
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-3">
                Good afternoon  
              </h1>
              <p className="text-neutral-600 font-light mb-12">Here's what's happening with your store today</p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
                {[
                  { title: "Total Revenue", value: "₹1,24,890", change: "+18.2%", color: "emerald" },
                  { title: "Total Orders", value: "342", change: "+12%", color: "blue" },
                  { title: "Products", value: "87", change: "-3 low stock", color: "amber" },
                  { title: "Avg. Rating", value: "4.8", change: "★★★★☆", color: "yellow" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    // variants={fadeIn}
                    className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
                  >
                    <div className="text-sm font-light text-neutral-600">{stat.title}</div>
                    <div className="text-3xl font-medium mt-2">{stat.value}</div>
                    <div className={`mt-4 text-sm font-light ${stat.color === "emerald" ? "text-emerald-700" : stat.color === "blue" ? "text-blue-700" : stat.color === "amber" ? "text-amber-700" : "text-yellow-700"}`}>
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sales Chart */}
              <div className="bg-white border border-neutral-200/70 rounded-xl p-8 mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-['Playfair_Display'] font-medium">Sales Overview</h2>
                  <select className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-600">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium">Recent Orders</h2>
                  <button onClick={() => setActiveTab(1)} className="text-emerald-800 font-medium flex items-center gap-2 hover:underline">
                    View all <ArrowRight size={18} />
                  </button>
                </div>

                <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50/70">
                      <tr>
                        <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Order ID</th>
                        <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Customer</th>
                        <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Amount</th>
                        <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                        <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>{renderRecentOrders()}</tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 1 && (
            <motion.div initial="hidden" animate="visible" 
            // variants={stagger}
            >
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-10">Orders</h1>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full sm:w-80 px-5 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
                <button className="px-8 py-3.5 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors">
                  Filter
                </button>
              </div>

              <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50/70">
                    <tr>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Order ID</th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Customer</th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Items</th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Total</th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Status</th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">Date</th>
                      <th className="py-5 px-6 w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60">{renderOrdersTable()}</tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 2 && (
            <motion.div initial="hidden" animate="visible" 
            // variants={stagger}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">Products</h1>
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
          )}

          {/* COUPONS TAB */}
          {activeTab === 3 && (
            <motion.div initial="hidden" animate="visible" 
            // variants={stagger}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">Coupons</h1>
                <button
                  onClick={() => setShowAddCoupon(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
                >
                  <Plus size={18} />
                  Create Coupon
                </button>
              </div>
              {renderCouponsTable()}
            </motion.div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 4 && (
            <motion.div initial="hidden" animate="visible" 
            // variants={stagger}
            >
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">Reviews</h1>
                <div className="text-neutral-600 font-light">Showing {reviews.length} reviews</div>
              </div>
              {renderReviewsTable()}
            </motion.div>
          )}
        </main>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-8"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-8">Quick Add</h2>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  setActiveTab(2);
                  setTimeout(() => setShowAddProduct(true), 300);
                }}
                className="h-32 border-2 border-dashed border-neutral-300 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-4 transition-colors"
              >
                <Package size={40} className="text-emerald-800" />
                <span className="font-medium">Product</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  setActiveTab(3);
                  setTimeout(() => setShowAddCoupon(true), 300);
                }}
                className="h-32 border-2 border-dashed border-neutral-300 hover:border-emerald-400 rounded-xl flex flex-col items-center justify-center gap-4 transition-colors"
              >
                <Ticket size={40} className="text-emerald-800" />
                <span className="font-medium">Coupon</span>
              </button>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowQuickAdd(false)}
                className="px-8 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-10">Add New Product</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">Title</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="Product name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full h-32 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="2499"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            {newProduct.image && (
              <div className="mt-8">
                <p className="text-sm font-medium text-neutral-600 mb-3">Preview</p>
                <img src={newProduct.image} alt="preview" className="max-h-48 rounded-lg border border-neutral-200/60" />
              </div>
            )}

            <div className="flex gap-4 mt-12">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add your handleAddProduct logic here
                  alert("Product added!");
                  setShowAddProduct(false);
                }}
                className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Add Product
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-10">Create Coupon</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors uppercase"
                  placeholder="SUMMER25"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Value</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Expiry</label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowAddCoupon(false)}
                className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add your handleAddCoupon logic here
                  alert("Coupon created!");
                  setShowAddCoupon(false);
                }}
                className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;