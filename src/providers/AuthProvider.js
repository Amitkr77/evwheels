"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      const { initializeCart } = require("@/store/cartStore").useCartStore.getState();
      await initializeCart();
    };
    init();
  }, []);

  return children;
}