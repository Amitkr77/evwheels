import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useCartStore = create((set, get) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: false,

  // 🧮 Calculate totals
  calculateTotals: (items) => {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = items.reduce(
      (acc, item) =>
        acc + item.quantity * (item.price || item.product?.price || 0),
      0
    );

    return { totalQuantity, totalPrice };
  },

  // 🟢 Initialize Cart
  initializeCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    set({ isLoading: true });

    try {
      if (isAuthenticated) {
        const res = await fetch("/api/cart");

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();

        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } else {
        const guestCart =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("guestCart")) || []
            : [];

        const totals = get().calculateTotals(guestCart);

        set({
          items: guestCart,
          ...totals,
        });
      }
    } catch (err) {
      console.error("Cart initialization failed", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟢 Add to cart (Optimistic UI)
  addToCart: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            quantity,
          }),
        });

        if (!res.ok) throw new Error("Add to cart failed");

        const data = await res.json();

        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Add to cart error", err);
      }
    } else {
      const existing = items.find((i) => i.productId === product._id);

      let updatedCart;

      if (existing) {
        updatedCart = items.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...items,
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
          },
        ];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }

      const totals = get().calculateTotals(updatedCart);

      set({
        items: updatedCart,
        ...totals,
      });
    }
  },

  // 🟢 Update Quantity
  updateQuantity: async (productId, quantity) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    if (quantity <= 0) {
      return get().removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });

        const data = await res.json();

        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Update quantity failed", err);
      }
    } else {
      const updatedCart = items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      const totals = get().calculateTotals(updatedCart);

      set({
        items: updatedCart,
        ...totals,
      });
    }
  },

  // 🟢 Remove Item
  removeFromCart: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Remove item failed", err);
      }
    } else {
      const updatedCart = items.filter((item) => item.productId !== productId);

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      const totals = get().calculateTotals(updatedCart);

      set({
        items: updatedCart,
        ...totals,
      });
    }
  },

  // 🟢 Merge Guest Cart After Login
  mergeGuestCart: async () => {
    const guestCart =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("guestCart"))
        : null;

    if (!guestCart || guestCart.length === 0) return;

    try {
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
    } catch (err) {
      console.error("Merge cart failed", err);
    }
  },

  // 🟢 Clear Cart (logout / order placed)
  clearCart: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("guestCart");
    }

    set({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  },
}));