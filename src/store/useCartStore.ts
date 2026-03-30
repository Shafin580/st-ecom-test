import { create } from 'zustand';
import type { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;

  // Actions
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Computed-style helpers
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,

  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        // Don't exceed available stock
        if (existing.quantity >= product.stock) return state;
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      // Don't add if out of stock
      if (product.stock <= 0) return state;
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),

  updateQuantity: (productId, delta) =>
    set((state) => {
      const item = state.items.find((i) => i.id === productId);
      if (!item) return state;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return { items: state.items.filter((i) => i.id !== productId) };
      }
      // Don't exceed available stock
      if (newQty > item.stock) return state;
      return {
        items: state.items.map((i) =>
          i.id === productId ? { ...i, quantity: newQty } : i,
        ),
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  setCartOpen: (open) => set({ isCartOpen: open }),

  getItemQuantity: (productId) => {
    const item = get().items.find((i) => i.id === productId);
    return item?.quantity ?? 0;
  },

  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
