import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product) => {
        if (!product?._id) return;
        const snapshot = {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          images: product.images?.slice(0, 1) || [],
          stock: product.stock,
          category: product.category?.name || product.category,
        };
        set((state) => {
          const filtered = state.items.filter((p) => p._id !== product._id);
          return { items: [snapshot, ...filtered].slice(0, MAX_ITEMS) };
        });
      },

      getItems: (excludeId) => {
        return get().items.filter((p) => p._id !== excludeId);
      },

      clear: () => set({ items: [] }),
    }),
    { name: "evwheels-recently-viewed" }
  )
);
