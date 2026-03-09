import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (user) => {
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
        });

        // Merge guest cart
        const guestCart =
            typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("guestCart")) || []
                : [];

        if (guestCart.length > 0) {
            try {
                const res = await fetch("/api/cart/merge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items: guestCart }),
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Merge failed");

                await res.json(); // merge response

                // Only now clear guest cart
                localStorage.removeItem("guestCart");

                // Refresh cart store after merge
                const { initializeCart } = require("@/store/cartStore").useCartStore.getState();
                await initializeCart();
            } catch (err) {
                console.error("Cart merge failed", err);
            }
        } else {
            const { initializeCart } = require("@/store/cartStore").useCartStore.getState();
            await initializeCart();
        }
    },

    logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        set({
            user: null,
            isAuthenticated: false,
        });
    },
    clearAuth: () =>
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        }),


    checkAuth: async () => {
        const state = useAuthStore.getState();

        if (state.user === null && state.isAuthenticated === false && !state.isLoading) return;

        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (!res.ok) throw new Error("Unauthorized");

            const data = await res.json();

            set({
                user: data,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));