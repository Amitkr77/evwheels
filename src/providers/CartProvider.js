"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartProvider({ children }) {
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    initializeCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}