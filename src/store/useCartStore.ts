import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/store/useProductStore';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  decreaseQuantity: (productId: string | number) => void;
  clearCart: () => void;
  totalItems: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        let newItems;
        if (existing) {
          newItems = items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        set({ 
          items: newItems, 
          totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0) 
        });
      },
      removeFromCart: (productId) => {
        const newItems = get().items.filter((i) => String(i.id) !== String(productId));
        set({ 
          items: newItems, 
          totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0) 
        });
      },
      decreaseQuantity: (productId) => {
        const items = get().items;
        const existing = items.find((i) => String(i.id) === String(productId));
        if (existing && existing.quantity > 1) {
          const newItems = items.map((i) =>
            String(i.id) === String(productId) ? { ...i, quantity: i.quantity - 1 } : i,
          );
          set({
            items: newItems,
            totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0)
          });
        } else if (existing && existing.quantity === 1) {
          get().removeFromCart(String(productId));
        }
      },
      clearCart: () => set({ items: [], totalItems: 0 }),
      totalItems: 0,
    }),
    { name: 'cart-store' },
  ),
);
