import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export const useCartStore = create((set, get) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,

  // Calculate totals
  calculateTotals: (items) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce(
      (sum, item) =>
        sum + (item.price || item.product?.price || 0) * item.quantity,
      0
    );

    return { totalQuantity, totalPrice };
  },

  // Initialize cart
  initializeCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        const data = await res.json();
        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Cart fetch failed", err);
      }
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
  },

  // Add to cart
  addToCart: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    // Enforce MOQ — never add less than the minimum order quantity
    const moq = product.moq || 1;
    const effectiveQty = Math.max(quantity, moq);

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id, quantity: effectiveQty }),
          credentials: "include",
        });

        const data = await res.json();
        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Add to cart failed", err);
      }
    } else {
      const existing = items.find(
        (item) => item.productId === product._id || item.product?._id === product._id
      );

      let updatedCart;

      if (existing) {
        updatedCart = items.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + effectiveQty }
            : item
        );
      } else {
        updatedCart = [
          ...items,
          {
            productId: product._id,
            product,
            quantity: effectiveQty,
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

  // Update quantity
  updateQuantity: async (productId, quantity) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    const cartItem = items.find(
      (i) => i.product?._id?.toString() === productId || i.productId === productId
    );
    const moq = cartItem?.product?.moq || 1;

    if (quantity <= 0) return get().removeFromCart(productId);
    if (quantity < moq) return; // block going below MOQ

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Update quantity failed:", err.error);
          return;
        }

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
      // Guest cart — update localStorage
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

  // Remove item
  removeFromCart: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    if (isAuthenticated) {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Remove from cart failed:", err.error);
          return;
        }

        const data = await res.json();
        const totals = get().calculateTotals(data.items);

        set({
          items: data.items,
          ...totals,
        });
      } catch (err) {
        console.error("Remove from cart failed", err);
      }
    } else {
      // Guest cart — update localStorage
      const updatedCart = items.filter((item) => item.productId !== productId);

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      const totals = get().calculateTotals(updatedCart);

      set({
        items: updatedCart,
        ...totals,
      });
    }
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem("guestCart");

    set({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  },
}));