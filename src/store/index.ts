import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  quantity: number;
  size: string | null;
  color: string | null;
  variantId: string | null;
  maxQuantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId &&
            i.size === item.size &&
            i.color === item.color
        );

        if (existingIndex >= 0) {
          const updatedItems = [...items];
          const newQty = updatedItems[existingIndex].quantity + item.quantity;
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: Math.min(newQty, item.maxQuantity),
          };
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...item, quantity: Math.min(item.quantity, item.maxQuantity) }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: "nextfitt-cart" }
  )
);

interface WishlistStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set({ items: [...get().items, id] }),
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i !== id) }),
      toggleItem: (id) => {
        const items = get().items;
        if (items.includes(id)) {
          set({ items: items.filter((i) => i !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
      hasItem: (id) => get().items.includes(id),
    }),
    { name: "nextfitt-wishlist" }
  )
);

interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setQuickViewOpen: (open: boolean, productId?: string) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setQuickViewOpen: (open, productId) =>
    set({ isQuickViewOpen: open, quickViewProductId: productId || null }),
}));