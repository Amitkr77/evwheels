"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await initializeCart();
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}
