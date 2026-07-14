import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/authStore";
import { analytics } from "@/lib/analytics";

export const useCartStore = create(
  persist(
    (set, get) => ({
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
  addToCart: async (product, quantity = 1, meta = {}) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    // Enforce MOQ — never add less than the minimum order quantity
    const moq = product.moq || 1;
    const effectiveQty = Math.max(quantity, moq);

    const trackAdded = (totals) => {
      analytics.track("Added to Cart", {
        product_id: product._id,
        slug: product.slug,
        product_name: product.title,
        category: product.category?.name || product.category,
        brand: product.brand,
        price: product.price,
        currency: "INR",
        stock: product.stock,
        quantity: effectiveQty,
        source: meta.source || "unknown",
        cart_value: totals.totalPrice,
        item_count: totals.totalQuantity,
      });
    };

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
        trackAdded(totals);
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
      trackAdded(totals);
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
    const previousQuantity = cartItem?.quantity ?? 0;
    const direction = quantity > previousQuantity ? "increase" : "decrease";

    if (quantity <= 0) return get().removeFromCart(productId);
    if (quantity < moq) return; // block going below MOQ

    const trackUpdated = (totals) => {
      analytics.track("Cart Updated", {
        product_id: productId,
        product_name: cartItem?.product?.title,
        quantity,
        direction,
        cart_value: totals.totalPrice,
        item_count: totals.totalQuantity,
      });
    };

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
        trackUpdated(totals);
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
      trackUpdated(totals);
    }
  },

  // Remove item
  removeFromCart: async (productId) => {
    const { isAuthenticated } = useAuthStore.getState();
    const { items } = get();

    // Capture the item's details before it's removed — needed for tracking.
    const removedItem = items.find(
      (i) => i.product?._id?.toString() === productId || i.productId === productId
    );

    const trackRemoved = (totals) => {
      analytics.track("Removed from Cart", {
        product_id: productId,
        product_name: removedItem?.product?.title,
        price: removedItem?.product?.price ?? removedItem?.price,
        quantity: removedItem?.quantity ?? 0,
        cart_value: totals.totalPrice,
        item_count: totals.totalQuantity,
      });
    };

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
        trackRemoved(totals);
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
      trackRemoved(totals);
    }
  },

  // Clear cart
  clearCart: () => {
    const { items, totalPrice, totalQuantity } = get();
    if (items.length > 0) {
      analytics.track("Cart Cleared", {
        cart_value: totalPrice,
        item_count: totalQuantity,
      });
    }
    localStorage.removeItem("guestCart");
    set({ items: [], totalQuantity: 0, totalPrice: 0 });
  },
}),
{
  name: "evwheels-cart-meta",
  // Only persist the counts — not the full items array.
  // This gives the navbar instant accurate badge count on page load
  // while the real items are re-hydrated from the server / localStorage.
  partialize: (state) => ({
    totalQuantity: state.totalQuantity,
    totalPrice:    state.totalPrice,
  }),
}
));