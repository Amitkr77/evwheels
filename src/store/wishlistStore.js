import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

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
      } else {
        set((state) => ({
          items: state.items.filter(
            (item) => item._id?.toString() !== productId
          ),
        }));
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
