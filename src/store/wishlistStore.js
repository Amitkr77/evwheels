import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useWishlistStore = create((set, get) => ({
    items: [],
    isLoading: false,

    // 🟢 Fetch wishlist
    fetchWishlist: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
            set({ isLoading: true });

            const res = await fetch("/api/wishlist");
            if (!res.ok) throw new Error();

            const data = await res.json();

            set({
                items: data.items.map((item) => item.product),
                isLoading: false,
            });
        } catch (err) {
            set({ isLoading: false });
        }
    },

    // 🟢 Toggle wishlist
    toggleWishlist: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch("/api/wishlist/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            const data = await res.json();

            set({
                items: data.items.map((item) => item.product),
            });
        } catch (err) {
            console.error("Wishlist toggle failed");
        }
    },

    // 🟢 Check if product is wished
    isInWishlist: (productId) => {
        return get().items.includes(productId);
    },

    // 🟢 Clear on logout
    clearWishlist: () => {
        set({ items: [] });
    },
}));