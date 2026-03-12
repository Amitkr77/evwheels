import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function Address() {
  const [showAddAddress, setShowAddAddress] = useState(false);

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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
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
                <div className="text-lg font-medium mb-3">{addr.name}</div>
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
    </motion.div>
  );
}
