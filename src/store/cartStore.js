import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useCartStore = create((set, get) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,

  // 🟢 Helper to calculate totals
  calculateTotals: (items) => {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    return { totalQuantity, totalPrice };
  },

  // 🟢 Initialize cart on app load
  initializeCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Cart fetch failed");
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const totals = get().calculateTotals(guestCart);

      set({
        items: guestCart,
        ...totals,
      });
    }
  },

  // 🟢 Add to cart
  addToCart: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });

      const data = await res.json();
      const totals = get().calculateTotals(data.items);

      set({
        items: data.items,
        ...totals,
      });
    } else {
      const existing = get().items.find(
        (item) => item.productId === product._id
      );

      let updatedCart;

      if (existing) {
        updatedCart = get().items.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...get().items,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
          },
        ];
      }

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      const totals = get().calculateTotals(updatedCart);

      set({
        items: updatedCart,
        ...totals,
      });
    }
  },

  // 🟢 Merge guest cart after login
  mergeGuestCart: async () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));

    if (!guestCart || guestCart.length === 0) return;

    const res = await fetch("/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: guestCart }),
    });

    const data = await res.json();
    const totals = get().calculateTotals(data.items);

    set({
      items: data.items,
      ...totals,
    });

    localStorage.removeItem("guestCart");
  },

  // 🟢 Clear cart (used on logout)
  clearCart: () => {
    set({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  },
}));