"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, HelpCircle } from "lucide-react";

// Shared admin confirmation dialog — replaces the mix of native
// window.confirm() calls and half a dozen near-identical hand-rolled
// "Delete X?" modals (products/categories/segments/subcategories/coupons),
// each with slightly different header markup, button copy, and — in
// products.jsx's case — no confirmation at all for some actions.
//
// Usage:
//   const confirm = useConfirm();
//   const ok = await confirm({
//     title: "Delete Product",
//     description: "This action cannot be undone.",
//     message: <>Delete <strong>{name}</strong>? All product data will be permanently removed.</>,
//     confirmLabel: "Delete",
//     tone: "danger",
//     blocked: productCount > 0
//       ? { reason: `This category has ${productCount} products assigned to it. Remove or reassign them first, or deactivate the category instead.` }
//       : null,
//   });

const ConfirmContext = createContext(null);

export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { options, resolve }
  const cancelBtnRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({ options, resolve });
    });
  }, []);

  const resolveDialog = (result) => {
    setDialog((current) => {
      current?.resolve(result);
      return null;
    });
  };

  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") resolveDialog(false);
    };
    document.addEventListener("keydown", onKeyDown);
    // Default focus lands on Cancel — the safer choice when the action is
    // destructive and the dialog opened via a single accidental click.
    const focusTimer = setTimeout(() => cancelBtnRef.current?.focus(), 10);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  const options = dialog?.options || {};
  const {
    title = "Are you sure?",
    description,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    blocked = null,
  } = options;

  const isDanger = tone === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {dialog && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] px-5"
            onClick={() => resolveDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDanger ? "bg-red-50" : "bg-[#DDF8FD]"
                  }`}
                >
                  {isDanger ? (
                    <AlertTriangle size={24} className="text-red-600" />
                  ) : (
                    <HelpCircle size={24} className="text-[#19B5D8]" />
                  )}
                </div>
                <div>
                  <h3 id="confirm-dialog-title" className="text-xl font-medium text-neutral-900">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-sm text-neutral-500 mt-1">{description}</p>
                  )}
                </div>
              </div>

              {message && <div className="text-neutral-700 mb-6">{message}</div>}

              {blocked && (
                <div className="mb-6 bg-red-50 border border-red-200/60 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Cannot {confirmLabel.toLowerCase()}</p>
                    <p className="text-sm text-red-700 mt-1">{blocked.reason}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  ref={cancelBtnRef}
                  onClick={() => resolveDialog(false)}
                  className="flex-1 py-3.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => resolveDialog(true)}
                  disabled={Boolean(blocked)}
                  className={`flex-1 py-3.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDanger
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

/**
 * useConfirm() -> confirm(options) => Promise<boolean>
 */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider (mounted in admin/dashboard/layout.js)");
  }
  return ctx;
}
