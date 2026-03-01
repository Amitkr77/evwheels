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
  Star 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showAddAddress, setShowAddAddress] = useState(false);

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
    alert("✅ Address added successfully!");
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const tabs = [
    { icon: Home, label: "Overview", id: 0 },
    { icon: Package, label: "My Orders", id: 1 },
    { icon: Heart, label: "Wishlist", id: 2 },
    { icon: MapPin, label: "Addresses", id: 3 },
    { icon: User, label: "Profile", id: 4 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
              S
            </div>
            <div>
              <span className="font-bold text-3xl tracking-tighter">
                Shopify
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t">
          <button
            onClick={() => {
              if (confirm("Logout?")) router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-3 py-3.5 text-red-600 hover:bg-red-50 rounded-2xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search your orders, products..."
                className="w-full bg-gray-100 border border-transparent focus:border-violet-400 rounded-2xl py-3 pl-12 text-sm"
              />
              <Search
                className="absolute left-5 top-4 text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold">Amit Sharma</div>
                <div className="text-xs text-emerald-600">Patna, Bihar</div>
              </div>
              <div className="w-9 h-9 bg-amber-200 rounded-2xl overflow-hidden border-2 border-white">
                <img
                  src="https://i.pravatar.cc/128?u=amit"
                  alt="Amit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* OVERVIEW */}
          {activeTab === 0 && (
            <div>
              <h1 className="text-4xl font-bold mb-2">Good morning, Amit 👋</h1>
              <p className="text-gray-500 mb-10">
                Here&apos;s what&apos;s happening with your account
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                  { label: "Total Spent", value: "₹48,290", icon: ShoppingBag },
                  { label: "Orders", value: "17", icon: Package },
                  { label: "Wishlist", value: "8", icon: Heart },
                  { label: "Rewards Points", value: "2,340", icon: Star },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                        <div className="text-3xl font-bold mt-2">
                          {stat.value}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
                        <stat.icon size={28} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab(1)}
                    className="text-violet-600 flex items-center gap-2 hover:underline"
                  >
                    View all <ArrowRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-gray-100 flex gap-5"
                    >
                      <img
                        src={order.image}
                        alt=""
                        width={80}
                        height={80}
                        className="rounded-2xl"
                      />
                      <div className="flex-1">
                        <div className="font-mono text-sm text-gray-500">
                          {order.id}
                        </div>
                        <div className="font-semibold mt-1">{order.date}</div>
                        <div className="text-sm text-gray-600 mt-4">
                          {order.items} items • {order.total}
                        </div>
                        <div
                          className={`inline-block mt-3 px-4 py-1 text-xs font-medium rounded-full
                          ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MY ORDERS */}
          {activeTab === 1 && (
            <div>
              <h1 className="text-4xl font-bold mb-8">My Orders</h1>
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-6 px-8 text-left">Order ID</th>
                      <th className="py-6 px-8 text-left">Date</th>
                      <th className="py-6 px-8 text-left">Items</th>
                      <th className="py-6 px-8 text-left">Total</th>
                      <th className="py-6 px-8 text-left">Status</th>
                      <th className="py-6 px-8 w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-6 px-8 font-mono">{order.id}</td>
                        <td className="py-6 px-8 text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-6 px-8">{order.items} items</td>
                        <td className="py-6 px-8 font-semibold">
                          {order.total}
                        </td>
                        <td className="py-6 px-8">
                          <span
                            className={`px-5 py-1.5 text-xs rounded-full font-medium
                            ${order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-6 px-8">
                          <button className="text-violet-600 font-medium">
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 2 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">
                  My Wishlist ({wishlist.length})
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50"
                      >
                        <Heart
                          className="text-red-500"
                          size={20}
                          fill="#ef4444"
                        />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="text-2xl font-bold mt-4">
                        {item.price}
                      </div>
                      <button className="mt-6 w-full bg-black text-white py-3 rounded-2xl font-medium hover:bg-gray-900">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 3 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Saved Addresses</h1>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-3 bg-violet-600 text-white px-6 h-12 rounded-2xl font-medium"
                >
                  <Plus size={20} /> Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white rounded-3xl p-8 border border-gray-100"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="uppercase text-xs font-semibold tracking-widest text-gray-500">
                          {addr.type}
                        </div>
                        <div className="font-semibold mt-2">{addr.name}</div>
                        <div className="text-gray-600 mt-4 leading-relaxed">
                          {addr.address}
                        </div>
                        <div className="mt-3 text-sm">{addr.phone}</div>
                      </div>
                      {addr.isDefault && (
                        <div className="text-xs bg-emerald-100 text-emerald-700 px-3 h-6 flex items-center rounded-full font-medium">
                          Default
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 4 && (
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-10">My Profile</h1>

              <div className="bg-white rounded-3xl p-10 border border-gray-100">
                <div className="flex gap-8 items-start mb-12">
                  <div className="w-28 h-28 bg-amber-200 rounded-3xl overflow-hidden border-4 border-white">
                    <img
                      src="https://i.pravatar.cc/128?u=amit"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">Amit Sharma</div>
                    <div className="text-gray-500 mt-1">
                      amit.sharma@email.com • +91 98765 43210
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Amit Sharma"
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="amit.sharma@email.com"
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue="Patna"
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                    />
                  </div>
                </div>

                <button className="mt-12 bg-black text-white px-12 py-4 rounded-2xl font-semibold hover:bg-gray-900">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-10">
            <h2 className="text-3xl font-bold mb-8">Add New Address</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address Type
                </label>
                <select
                  value={newAddress.type}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Address
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="w-full h-32 border border-gray-300 rounded-2xl px-6 py-4"
                  placeholder="House no, Street, Area..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-6 py-4"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowAddAddress(false)}
                className="flex-1 py-4 text-gray-600 hover:bg-gray-100 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addAddress}
                className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-semibold"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
