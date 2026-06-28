import { create } from "zustand";

// Lazy import to avoid circular deps — cartStore imports authStore
function getCartStore() {
  return require("@/store/cartStore").useCartStore;
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (user) => {
    set({ user, isAuthenticated: true, isLoading: false });

    // Merge guest cart into server cart after login
    const guestCart =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("guestCart") || "[]")
        : [];

    if (guestCart.length > 0) {
      try {
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: guestCart }),
          credentials: "include",
        });

        if (res.ok) {
          localStorage.removeItem("guestCart");
        }
      } catch (err) {
        console.error("Cart merge failed:", err);
      }
    }

    // Refresh cart from server
    await getCartStore().getState().initializeCart();
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors during logout
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
    getCartStore().getState().clearCart();
  },

  clearAuth: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),

  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
