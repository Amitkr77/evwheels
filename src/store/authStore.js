import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: (user) =>
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
        }),

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

        // 🚫 If already logged out, don't check again
        if (state.user === null && state.isAuthenticated === false) {
            return;
        }

        try {
            const res = await fetch("/api/auth/me");

            if (!res.ok) throw new Error();

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