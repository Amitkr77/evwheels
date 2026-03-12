import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useWishlistStore = create((set, get) => ({
  items: [],         // Array of product snapshots { productId, title, price, image }
  isLoading: false,

  // 🟢 Fetch wishlist from backend
  fetchWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    try {
      set({ isLoading: true });

      const res = await fetch("/api/user/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();

      set({
        items: data.products || [],
        isLoading: false,
      });
    } catch (err) {
      console.error("Fetch wishlist failed", err);
      set({ isLoading: false });
    }
  },

  // 🟢 Toggle wishlist using the toggle API
  toggleWishlist: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/user/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist");

      const data = await res.json();

      const { wished } = data;

      set((state) => {
        let updatedItems;
        if (wished) {
          // Add product placeholder (optional: fetch product data again if needed)
          updatedItems = [...state.items, data.product];
        } else {
          // Remove product
          updatedItems = state.items.filter(
            (item) => item.productId !== productId
          );
        }
        return { items: updatedItems };
      });
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  },

  // 🟢 Check if product is in wishlist
  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },

  // 🟢 Clear wishlist on logout
  clearWishlist: () => {
    set({ items: [] });
  },
}));