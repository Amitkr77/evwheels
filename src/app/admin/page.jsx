"use client";

import React, { useState, useEffect } from "react";
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

  // Sample Data
  const [orders, setOrders] = useState([
    {
      id: "#ORD-9821",
      customer: "Rahul Verma",
      items: 3,
      total: "₹2,899",
      status: "Delivered",
      date: "Feb 28",
    },
    {
      id: "#ORD-9820",
      customer: "Priya Singh",
      items: 1,
      total: "₹899",
      status: "Shipped",
      date: "Feb 27",
    },
    {
      id: "#ORD-9819",
      customer: "Aman Kumar",
      items: 5,
      total: "₹4,299",
      status: "Pending",
      date: "Feb 27",
    },
    {
      id: "#ORD-9818",
      customer: "Sneha Gupta",
      items: 2,
      total: "₹1,599",
      status: "Delivered",
      date: "Feb 26",
    },
  ]);

  // Form States
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

  // Data
  const [products, setProducts] = useState([
    {
      id: "p1",
      title: "Wireless Headphones",
      description:
        "Premium noise-cancelling over-ear headphones with 40hr battery",
      price: "₹2,499",
      image: "https://picsum.photos/id/20/400/300",
      stock: 124,
      sold: 342,
    },
    {
      id: "p2",
      title: "Smart Watch Pro",
      description: '1.8" AMOLED display, heart rate, GPS & 14-day battery',
      price: "₹4,999",
      image: "https://picsum.photos/id/60/400/300",
      stock: 87,
      sold: 219,
    },
  ]);

  const [coupons, setCoupons] = useState([
    {
      id: "c1",
      code: "WELCOME20",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 999,
      expiryDate: "2026-03-15",
      used: 142,
    },
    {
      id: "c2",
      code: "FREESHIP",
      discountType: "fixed",
      discountValue: 99,
      minOrderAmount: 499,
      expiryDate: "2026-04-01",
      used: 89,
    },
  ]);

  const [reviews, setReviews] = useState([
    {
      id: "r1",
      product: "Wireless Headphones",
      user: "Neha Patel",
      rating: 5,
      comment: "Sound quality is amazing and noise cancellation is top class!",
      date: "Feb 28",
      status: "approved",
    },
    {
      id: "r2",
      product: "Smart Watch Pro",
      user: "Vikash Sharma",
      rating: 4,
      comment: "Battery lasts really long but strap could be better",
      date: "Feb 27",
      status: "pending",
    },
  ]);

  // Sales Chart Data
  const chartData = {
    labels: [
      "Feb 24",
      "Feb 25",
      "Feb 26",
      "Feb 27",
      "Feb 28",
      "Mar 1",
      "Mar 2",
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [12400, 18900, 15200, 22400, 19800, 27100, 31200],
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.08)",
        borderWidth: 4,
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
        backgroundColor: "#4c1d95",
        titleFont: { size: 14 },
        bodyFont: { size: 16, weight: "600" },
        displayColors: false,
        callbacks: {
          label: (ctx) => "₹" + ctx.raw.toLocaleString("en-IN"),
        },
      },
    },
    scales: {
      y: {
        grid: { color: "#f3e8ff" },
        ticks: { callback: (v) => "₹" + v / 1000 + "k" },
      },
      x: {
        grid: { color: "#f3e8ff" },
      },
    },
  };

  // Render Recent Orders (Dashboard)
  const renderRecentOrders = () => {
    return orders.slice(0, 4).map((order, i) => (
      <tr
        key={i}
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
      >
        <td className="py-5 px-8 font-mono text-sm">{order.id}</td>
        <td className="py-5 px-8">{order.customer}</td>
        <td className="py-5 px-8 font-medium">{order.total}</td>
        <td className="py-5 px-8">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-2xl
            ${
              order.status === "Delivered"
                ? "bg-emerald-100 text-emerald-700"
                : order.status === "Shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                order.status === "Delivered"
                  ? "bg-emerald-500"
                  : order.status === "Shipped"
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
            />
            {order.status}
          </span>
        </td>
        <td className="py-5 px-8 text-gray-500">{order.date}</td>
      </tr>
    ));
  };

  // Render Full Orders Table
  const renderOrdersTable = () => {
    return orders.map((order, i) => (
      <tr key={i} className="hover:bg-gray-50 transition-colors">
        <td className="py-6 px-8 font-mono">{order.id}</td>
        <td className="py-6 px-8">{order.customer}</td>
        <td className="py-6 px-8">{order.items} items</td>
        <td className="py-6 px-8 font-semibold">{order.total}</td>
        <td className="py-6 px-8">
          <span
            className={`px-4 py-1.5 text-xs font-medium rounded-2xl
            ${
              order.status === "Delivered"
                ? "bg-emerald-100 text-emerald-700"
                : order.status === "Shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="py-6 px-8 text-gray-500">{order.date}</td>
        <td className="py-6 px-8">
          <button className="text-violet-600 hover:text-violet-700 p-2">
            <Eye size={18} />
          </button>
        </td>
      </tr>
    ));
  };

  // Add Product
  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert("Please fill Title, Price & Image");
      return;
    }

    const product = {
      id: "p" + Date.now(),
      title: newProduct.title,
      description: newProduct.description,
      price: `₹${newProduct.price}`,
      image: newProduct.image,
      stock: Math.floor(Math.random() * 150) + 50,
      sold: Math.floor(Math.random() * 400) + 100,
    };

    setProducts([product, ...products]);
    setNewProduct({ title: "", description: "", price: "", image: "" });
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
      id: "c" + Date.now(),
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
      expiryDate: newCoupon.expiryDate,
      used: 0,
    };

    setCoupons([coupon, ...coupons]);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      expiryDate: "",
    });
    setShowAddCoupon(false);
    alert("✅ Coupon created successfully!");
  };

  // Review Actions
  const approveReview = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
  };

  const rejectReview = (id) => {
    if (confirm("Reject this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  // Render Products Table
  const renderProductsTable = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-6 px-8 text-left font-medium text-sm w-16">
              Image
            </th>
            <th className="py-6 px-8 text-left font-medium text-sm">Title</th>
            <th className="py-6 px-8 text-left font-medium text-sm">
              Description
            </th>
            <th className="py-6 px-8 text-left font-medium text-sm">Price</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Stock</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Sold</th>
            <th className="py-6 px-8 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-6 px-8">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded-xl"
                />
              </td>
              <td className="py-6 px-8 font-semibold">{product.title}</td>
              <td className="py-6 px-8 text-gray-600 text-sm line-clamp-2 max-w-md">
                {product.description}
              </td>
              <td className="py-6 px-8 font-bold">{product.price}</td>
              <td className="py-6 px-8">
                <span
                  className={`font-medium ${product.stock < 100 ? "text-red-600" : "text-emerald-600"}`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="py-6 px-8 text-gray-600">{product.sold}</td>
              <td className="py-6 px-8 flex gap-3">
                <button className="text-violet-600">
                  <Edit2 size={18} />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => {
                    if (confirm("Delete product?"))
                      setProducts(products.filter((p) => p.id !== product.id));
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
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-6 px-8 text-left font-medium text-sm">Code</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Type</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Value</th>
            <th className="py-6 px-8 text-left font-medium text-sm">
              Min Order
            </th>
            <th className="py-6 px-8 text-left font-medium text-sm">Expires</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Used</th>
            <th className="py-6 px-8 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="py-6 px-8 font-mono text-lg font-semibold">
                {coupon.code}
              </td>
              <td className="py-6 px-8">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {coupon.discountType === "percentage"
                    ? "Percentage"
                    : "Fixed ₹"}
                </span>
              </td>
              <td className="py-6 px-8 font-semibold">
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue}`}
              </td>
              <td className="py-6 px-8">₹{coupon.minOrderAmount}</td>
              <td className="py-6 px-8 text-gray-500">{coupon.expiryDate}</td>
              <td className="py-6 px-8">{coupon.used}</td>
              <td className="py-6 px-8">
                <button
                  onClick={() => {
                    if (confirm(`Delete ${coupon.code}?`)) {
                      setCoupons(coupons.filter((c) => c.id !== coupon.id));
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
            <th className="py-6 px-8 text-left font-medium text-sm">
              Customer
            </th>
            <th className="py-6 px-8 text-left font-medium text-sm">Rating</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Comment</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Date</th>
            <th className="py-6 px-8 text-left font-medium text-sm">Status</th>
            <th className="py-6 px-8 w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <tr key={review.id} className="hover:bg-gray-50">
              <td className="py-6 px-8 font-medium">{review.product}</td>
              <td className="py-6 px-8">{review.user}</td>
              <td className="py-6 px-8 text-amber-500 font-bold">
                {"★".repeat(review.rating)}
              </td>
              <td className="py-6 px-8 text-gray-600 max-w-md line-clamp-2">
                {review.comment}
              </td>
              <td className="py-6 px-8 text-gray-500">{review.date}</td>
              <td className="py-6 px-8">
                <span
                  className={`px-4 py-1 text-xs font-medium rounded-full
                  ${
                    review.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : review.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {review.status?.toUpperCase()}
                </span>
              </td>
              <td className="py-6 px-8 flex gap-2">
                {review.status === "pending" && (
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

  const addNewProduct = () => {
    const name = prompt("Product name:");
    if (!name) return;
    const price = prompt("Price (₹):", "1999");
    if (!price) return;

    const newProduct = {
      name,
      price: `₹${price}`,
      stock: Math.floor(Math.random() * 200) + 80,
      sold: Math.floor(Math.random() * 400) + 100,
      img: `https://picsum.photos/id/${Math.floor(Math.random() * 300) + 100}/400/300`,
    };
    setProducts([newProduct, ...products]);
    alert("✅ Product added successfully!");
  };

  const createCoupon = () => {
    const code = prompt("Enter coupon code (e.g. SUMMER25):", "SUMMER25");
    if (!code) return;
    const discount = prompt("Discount? (e.g. 25% off)", "25% off");
    if (!discount) return;

    const newCoupon = {
      code: code.toUpperCase(),
      discount,
      expiry: "Apr 30, 2026",
      used: 0,
    };
    setCoupons([newCoupon, ...coupons]);
    alert(`✅ Coupon ${code.toUpperCase()} created!`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
              S
            </div>
            <div>
              <span className="font-bold text-3xl tracking-tighter">
                Shopify
              </span>
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
              { icon: Star, label: "Reviews", tab: 4, badge: "18" },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-2xl transition-all sidebar-link ${
                  activeTab === item.tab
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
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

          <div className="mt-12 px-5">
            <div className="uppercase text-xs font-semibold tracking-widest text-gray-500 mb-4">
              Management
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-3 px-5 py-3 hover:text-gray-900 cursor-pointer">
                <Users size={18} /> Customers
              </div>
              <div className="flex items-center gap-3 px-5 py-3 hover:text-gray-900 cursor-pointer">
                <TrendingUp size={18} /> Analytics
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl overflow-hidden">
              <img
                src="https://i.pravatar.cc/128?u=amit"
                alt="Amit"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Amit Sharma</div>
              <div className="text-xs text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
                Online
              </div>
            </div>
            <button
              onClick={() => alert("Logged out! 👋")}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, products..."
                className="w-full bg-gray-100 border border-transparent focus:border-violet-400 rounded-2xl py-3 pl-12 text-sm focus:outline-none"
              />
              <Search
                className="absolute left-5 top-3.5 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                7
              </span>
            </div>

            <button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 h-11 rounded-2xl transition-all active:scale-95"
            >
              <Plus size={20} />
              New
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-sm">Amit Sharma</div>
                <div className="text-xs text-gray-500">Patna, Bihar</div>
              </div>
              <div className="w-9 h-9 bg-zinc-200 rounded-2xl overflow-hidden border border-white">
                <img
                  src="https://i.pravatar.cc/128?u=amit"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* DASHBOARD */}
          {activeTab === 0 && (
            <div>
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Good afternoon, Amit 👋
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Here&apos;s what&apos;s happening with your store today
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-3 flex items-center gap-3 text-sm">
                    <Calendar size={18} />
                    Feb 24 – Mar 2, 2026
                  </div>
                  <button
                    onClick={() => alert("Report exported as CSV 📊")}
                    className="flex items-center gap-3 border border-gray-300 hover:bg-gray-50 px-6 h-12 rounded-2xl text-sm font-medium"
                  >
                    <Download size={18} /> Export
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: "₹1,24,890",
                    change: "+18.2%",
                    color: "emerald",
                  },
                  {
                    title: "Total Orders",
                    value: "342",
                    change: "+12%",
                    color: "blue",
                  },
                  {
                    title: "Products",
                    value: "87",
                    change: "-3 low stock",
                    color: "amber",
                  },
                  {
                    title: "Avg. Rating",
                    value: "4.8",
                    change: "★★★★☆",
                    color: "yellow",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-7 border border-gray-100"
                  >
                    <div className="text-sm text-gray-500">{stat.title}</div>
                    <div className="text-4xl font-bold mt-3">{stat.value}</div>
                    <div
                      className={`mt-6 text-sm flex items-center gap-2 ${stat.color === "emerald" ? "text-emerald-600" : stat.color === "blue" ? "text-blue-600" : stat.color === "amber" ? "text-amber-600" : "text-yellow-600"}`}
                    >
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sales Chart */}
              <div className="mt-10 bg-white rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold">Sales Overview</h2>
                  <select className="bg-gray-100 border-0 rounded-2xl py-2.5 px-5 text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="h-96">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mt-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab(1)}
                    className="text-violet-600 font-medium hover:underline flex items-center gap-2"
                  >
                    View all orders →
                  </button>
                </div>
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-5 px-8 font-medium text-sm text-gray-500">
                          Order ID
                        </th>
                        <th className="text-left py-5 px-8 font-medium text-sm text-gray-500">
                          Customer
                        </th>
                        <th className="text-left py-5 px-8 font-medium text-sm text-gray-500">
                          Amount
                        </th>
                        <th className="text-left py-5 px-8 font-medium text-sm text-gray-500">
                          Status
                        </th>
                        <th className="text-left py-5 px-8 font-medium text-sm text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderRecentOrders()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 1 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Orders</h1>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="bg-white border border-gray-300 rounded-2xl px-6 py-3 w-96 focus:outline-none focus:border-violet-400"
                  />
                  <button className="bg-violet-600 text-white px-8 rounded-2xl font-medium">
                    Filter
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Order ID
                      </th>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Customer
                      </th>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Items
                      </th>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Total
                      </th>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Status
                      </th>
                      <th className="py-6 px-8 text-left font-medium text-sm">
                        Date
                      </th>
                      <th className="py-6 px-8 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {renderOrdersTable()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
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

          {/* COUPONS TAB */}
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

          {/* REVIEWS TAB */}
          {activeTab === 4 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Customer Reviews</h1>
                <div className="text-gray-500">
                  Showing {reviews.length} reviews
                </div>
              </div>
              {renderReviewsTable()}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold mb-8">Quick Add</h2>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    setActiveTab(2);
                    setTimeout(() => setShowAddProduct(true), 300);
                  }}
                  className="h-32 border-2 border-dashed border-gray-300 hover:border-violet-400 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all"
                >
                  <Package size={42} className="text-violet-500" />
                  <span className="font-semibold">Product</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    setActiveTab(3);
                    setTimeout(() => setShowAddCoupon(true), 300);
                  }}
                  className="h-32 border-2 border-dashed border-gray-300 hover:border-violet-400 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all"
                >
                  <Ticket size={42} className="text-violet-500" />
                  <span className="font-semibold">Coupon</span>
                </button>
              </div>
            </div>
            <div className="border-t p-5 flex justify-end">
              <button
                onClick={() => setShowQuickAdd(false)}
                className="px-10 py-3.5 text-gray-500 hover:bg-gray-100 rounded-2xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD PRODUCT MODAL ==================== */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-10">
              <h2 className="text-3xl font-bold mb-8">Add New Product</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="Wireless Headphones Pro"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
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
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 h-32 focus:outline-none focus:border-violet-500"
                    placeholder="Premium noise cancelling headphones..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="2499"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    placeholder="https://picsum.photos/id/20/400/300"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {newProduct.image && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Image Preview</p>
                  <img
                    src={newProduct.image}
                    alt="preview"
                    className="h-48 w-auto rounded-2xl border"
                  />
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
                  <label className="block text-sm font-medium mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-5 py-4 font-mono uppercase focus:outline-none focus:border-violet-500"
                    placeholder="SUMMER25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountType: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      value={newCoupon.discountValue}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountValue: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Min Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          minOrderAmount: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t px-10 py-6 flex gap-4 justify-end">
              <button
                onClick={() => setShowAddCoupon(false)}
                className="px-8 py-3.5 font-medium text-gray-600 hover:bg-gray-100 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoupon}
                className="px-10 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
