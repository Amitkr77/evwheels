import { create } from "zustand";
import { analytics } from "@/lib/analytics";

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

    // Identify the user in PostHog — single choke point for every explicit
    // login path (user login, admin login both call this action). Session
    // restore on mount goes through checkAuth() below, which identifies
    // separately since it doesn't call login().
    analytics.identify(user.id, {
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    });

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
    analytics.track("User Logged Out", {});
    analytics.reset();
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
      // Identify on session restore too — not just explicit login() calls —
      // so PostHog has an identified profile for the whole authenticated
      // session, not just the moment of signing in.
      analytics.identify(data.id, {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        created_at: data.created_at,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
