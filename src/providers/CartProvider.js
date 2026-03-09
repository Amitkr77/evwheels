"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartProvider({ children }) {
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    initializeCart();
  }, []);

  return children;
}