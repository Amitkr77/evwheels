"use client";

import { createContext, useContext, useCallback, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ShoppingBag, Heart, AlertTriangle } from "lucide-react";

// ── Store (outside React) ────────────────────────────────────────────────────
let toasts = [];
const listeners = new Set();
function emit() { listeners.forEach((l) => l()); }
function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
function getSnapshot() { return toasts; }

function addToast(message, type = "success", duration = 3000) {
  const id = Date.now() + Math.random();
  toasts = [...toasts.slice(-2), { id, message, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

// ── Context (stable ref — never triggers child re-renders) ───────────────────
const ToastContext = createContext(addToast);

const ICONS = {
  success: Check,
  cart: ShoppingBag,
  wishlist: Heart,
  error: AlertTriangle,
};

const COLORS = {
  success: "bg-neutral-900 text-white",
  cart: "bg-neutral-900 text-white",
  wishlist: "bg-neutral-900 text-white",
  error: "bg-red-600 text-white",
};

function ToastRenderer() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => []);

  if (current.length === 0) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {current.map((toast) => {
          const Icon = ICONS[toast.type] || Check;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 shadow-lg border border-neutral-800 min-w-[220px] max-w-[360px] ${COLORS[toast.type]}`}
            >
              <Icon size={15} strokeWidth={2} className="shrink-0" />
              <span className="text-[13px] font-medium flex-1">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastRenderer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
