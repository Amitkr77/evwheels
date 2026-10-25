"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await initializeCart();
      fetchWishlist();
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}
