import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { analytics } from "@/lib/analytics";

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    set({ isLoading: true });
    try {
      const res = await fetch("/api/user/wishlist", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      set({ items: data.products || [], isLoading: false });
    } catch (err) {
      console.error("Fetch wishlist failed:", err);
      set({ isLoading: false });
    }
  },

  // Toggle via the POST endpoint (add if absent, remove if present)
  toggleWishlist: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      window.location.href = "/account/login";
      return;
    }

    // Capture the product name before mutating state, for the remove-path
    // tracking call (the item is about to disappear from `items`).
    const existingItem = get().items.find(
      (item) => item._id?.toString() === productId
    );

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist");

      const { wished } = await res.json();

      if (wished) {
        // Refetch to get full product snapshot
        await get().fetchWishlist();
        const addedItem = get().items.find(
          (item) => item._id?.toString() === productId
        );
        analytics.track("Added to Wishlist", {
          product_id: productId,
          product_name: addedItem?.title,
        });
      } else {
        set((state) => ({
          items: state.items.filter(
            (item) => item._id?.toString() !== productId
          ),
        }));
        analytics.track("Removed from Wishlist", {
          product_id: productId,
          product_name: existingItem?.title,
        });
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some(
      (item) => item._id?.toString() === productId?.toString()
    );
  },

  clearWishlist: () => set({ items: [] }),
}));
