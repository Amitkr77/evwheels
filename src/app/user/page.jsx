"use client";

import React, { useState } from "react";
import {
  Home,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  Plus,
  Search,
  Bell,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, stagger } from "framer-motion";

const UserDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // ── Sample data (unchanged) ──
  const [orders] = useState([
    {
      id: "#ORD-9821",
      date: "Feb 28, 2026",
      items: 3,
      total: "₹2,899",
      status: "Delivered",
      image: "https://picsum.photos/id/20/80/80",
    },
    {
      id: "#ORD-9817",
      date: "Feb 22, 2026",
      items: 1,
      total: "₹4,999",
      status: "Shipped",
      image: "https://picsum.photos/id/60/80/80",
    },
    {
      id: "#ORD-9812",
      date: "Feb 18, 2026",
      items: 2,
      total: "₹1,798",
      status: "Delivered",
      image: "https://picsum.photos/id/201/80/80",
    },
  ]);


  const [wishlist, setWishlist] = useState([
    {
      id: "w1",
      title: "Noise Cancelling Headphones",
      price: "₹2,499",
      image: "https://picsum.photos/id/20/300/300",
    },
    {
      id: "w2",
      title: "Leather Wallet",
      price: "₹899",
      image: "https://picsum.photos/id/201/300/300",
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: "a1",
      type: "Home",
      name: "Amit Sharma",
      address: "House No. 45, Rajendra Nagar, Patna, Bihar 800016",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: "a2",
      type: "Office",
      name: "Amit Sharma",
      address: "3rd Floor, Boring Road, Patna, Bihar 800001",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    type: "Home",
    name: "Amit Sharma",
    address: "",
    phone: "",
  });

  const addAddress = () => {
    if (!newAddress.address) return alert("Please enter address");
    const address = {
      id: "a" + Date.now(),
      type: newAddress.type,
      name: newAddress.name,
      address: newAddress.address,
      phone: newAddress.phone || "+91 98765 43210",
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      type: "Home",
      name: "Amit Sharma",
      address: "",
      phone: "",
    });
    setShowAddAddress(false);
    alert("Address added successfully!");
  };

  const removeFromWishlist = (id) =>
    setWishlist(wishlist.filter((item) => item.id !== id));

  const tabs = [
    { icon: Home, label: "Overview", id: 0 },
    { icon: Package, label: "My Orders", id: 1 },
    { icon: Heart, label: "Wishlist", id: 2 },
    { icon: MapPin, label: "Addresses", id: 3 },
    { icon: User, label: "Profile", id: 4 },
  ];

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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-50/60 text-emerald-800"
                  : "text-neutral-700 hover:bg-neutral-50/80"
              }`}
            >
              <tab.icon size={20} strokeWidth={1.6} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-neutral-200/60 mt-auto">
          <button
            onClick={() => confirm("Logout?") && router.push("/login")}
            className="w-full flex items-center justify-center gap-3 py-3.5 text-red-700 hover:bg-red-50/50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} strokeWidth={1.6} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200/70 flex items-center px-6 lg:px-12 justify-between">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search orders, wishlist..."
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-emerald-300 rounded-xl py-3 pl-11 pr-4 text-sm font-light focus:outline-none transition-colors"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-neutral-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-900">
                  Amit Sharma
                </div>
                <div className="text-xs text-neutral-500">Patna, Bihar</div>
              </div>
              <div className="w-9 h-9 bg-neutral-200 rounded-full overflow-hidden border-2 border-white">
                <img
                  src="https://i.pravatar.cc/128?u=amit"
                  alt="Amit"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-12">
          {/* OVERVIEW */}
          {activeTab === 0 && (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-3">
                Good morning, Amit
              </h1>
              <p className="text-neutral-600 font-light mb-12">
                Here's what's happening with your account
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
                {[
                  { label: "Total Spent", value: "₹48,290", icon: ShoppingBag },
                  { label: "Orders", value: "17", icon: Package },
                  { label: "Wishlist", value: "8", icon: Heart },
                  { label: "Rewards Points", value: "2,340", icon: Star },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    // variants={fadeIn}
                    className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-light text-neutral-600">
                          {stat.label}
                        </div>
                        <div className="text-3xl font-medium mt-1">
                          {stat.value}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-50/40 rounded-full flex items-center justify-center">
                        <stat.icon
                          size={24}
                          className="text-emerald-800"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-medium">
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => setActiveTab(1)}
                    className="text-emerald-800 font-medium flex items-center gap-2 hover:underline"
                  >
                    View all <ArrowRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      // variants={fadeIn}
                      className="bg-white border border-neutral-200/70 rounded-xl p-6 hover:border-emerald-200/60 transition-colors"
                    >
                      <div className="flex gap-5">
                        <div className="flex-shrink-0">
                          <img
                            src={order.image}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-mono text-neutral-500">
                            {order.id}
                          </div>
                          <div className="font-medium mt-1">{order.date}</div>
                          <div className="text-sm text-neutral-600 mt-3">
                            {order.items} items • {order.total}
                          </div>
                          <div
                            className={`inline-block mt-3 px-4 py-1 text-xs font-medium rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MY ORDERS */}
          {activeTab === 1 && (
            <motion.div initial="hidden" animate="visible"
            //  variants={stagger}
            >
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-10">
                My Orders
              </h1>

              <div className="border border-neutral-200/70 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50/70">
                    <tr>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                        Order ID
                      </th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                        Date
                      </th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                        Items
                      </th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                        Total
                      </th>
                      <th className="py-5 px-6 text-left text-sm font-medium text-neutral-600">
                        Status
                      </th>
                      <th className="py-5 px-6 w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/60">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-neutral-50/40 transition-colors"
                      >
                        <td className="py-5 px-6 font-mono text-sm">
                          {order.id}
                        </td>
                        <td className="py-5 px-6 text-neutral-700">
                          {order.date}
                        </td>
                        <td className="py-5 px-6">{order.items} items</td>
                        <td className="py-5 px-6 font-medium">{order.total}</td>
                        <td className="py-5 px-6">
                          <span
                            className={`px-4 py-1 text-xs font-medium rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <button className="text-emerald-800 font-medium hover:underline">
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WISHLIST */}
          {activeTab === 2 && (
            <motion.div initial="hidden" animate="visible"
            //  variants={stagger}
            >
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
                  Wishlist ({wishlist.length})
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    // variants={fadeIn}
                    className="group bg-white border border-neutral-200/70 rounded-xl overflow-hidden hover:border-emerald-200/60 transition-colors"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={item.image}
                        alt={item.title}
                        // fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <Heart
                          size={18}
                          className="text-red-600"
                          fill="#dc2626"
                        />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-medium mb-2 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="text-2xl font-light text-emerald-800 mb-6">
                        {item.price}
                      </div>
                      <button className="w-full py-3.5 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ADDRESSES */}
          {activeTab === 3 && (
            <motion.div initial="hidden" animate="visible"
            //  variants={stagger}
            >
              <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium">
                  Addresses
                </h1>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-full text-sm font-medium hover:bg-emerald-900 transition-colors"
                >
                  <Plus size={18} />
                  Add New
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {addresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    // variants={fadeIn}
                    className="bg-white border border-neutral-200/70 rounded-xl p-8 hover:border-emerald-200/60 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="uppercase text-xs font-medium tracking-wider text-neutral-500 mb-2">
                          {addr.type}
                        </div>
                        <div className="text-lg font-medium mb-3">
                          {addr.name}
                        </div>
                        <div className="text-neutral-600 leading-relaxed mb-2">
                          {addr.address}
                        </div>
                        <div className="text-neutral-600">{addr.phone}</div>
                      </div>
                      {addr.isDefault && (
                        <span className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROFILE */}
          {activeTab === 4 && (
            <motion.div
              initial="hidden"
              animate="visible"
              // variants={stagger}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium mb-12">
                Profile
              </h1>

              <div className="bg-white border border-neutral-200/70 rounded-xl p-10 md:p-12">
                <div className="flex flex-col sm:flex-row gap-8 items-start mb-16">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src="https://i.pravatar.cc/128?u=amit"
                      alt="Amit"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-['Playfair_Display'] font-medium mb-2">
                      Amit Sharma
                    </div>
                    <div className="text-neutral-600 font-light">
                      amit.sharma@email.com • +91 98765 43210
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Amit Sharma"
                      className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="amit.sharma@email.com"
                      className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue="Patna"
                      className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <button className="mt-12 px-10 py-4 bg-neutral-900 text-white rounded-full text-lg font-medium hover:bg-neutral-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* ─── Add Address Modal ─── */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-8 md:p-10"
          >
            <h2 className="text-3xl font-['Playfair_Display'] font-medium mb-10">
              Add New Address
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Address Type
                </label>
                <select
                  value={newAddress.type}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, type: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Full Address
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="w-full h-32 px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                  placeholder="House no, Street, Area..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  className="w-full px-5 py-4 border border-neutral-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowAddAddress(false)}
                className="flex-1 py-4 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAddress}
                className="flex-1 py-4 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors"
              >
                Save Address
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
