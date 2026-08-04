"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

// Shared admin toast system — replaces the toast that used to live only in
// products/page.jsx, plus every alert()/native-dialog feedback pattern
// scattered across categories/segments/subcategories/etc. One place to fix
// styling, timing, or accessibility for all of them at once.

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => dismiss(id), 4000);
    timers.current.set(id, timer);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed top-6 right-6 z-[100] flex flex-col gap-3 items-end"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3 max-w-sm ${
                toast.type === "error" ? "bg-red-600 text-white" : "bg-[#19B5D8] text-white"
              }`}
            >
              {toast.type === "error" ? (
                <AlertTriangle size={18} className="shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="shrink-0" />
              )}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast() -> showToast(message, type?) where type is "success" | "error"
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider (mounted in admin/dashboard/layout.js)");
  }
  return ctx;
}
