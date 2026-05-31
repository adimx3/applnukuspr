import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyOrdersState {
  orderIds: number[];
  addOrderId: (id: number) => void;
  clearOrderIds: () => void;
}

export const useMyOrdersStore = create<MyOrdersState>()(
  persist(
    (set) => ({
      orderIds: [],
      addOrderId: (id) => set((state) => ({ 
        // faqat yangilarini qo'shish va takrorlanmasligini ta'minlash
        orderIds: state.orderIds.includes(id) ? state.orderIds : [id, ...state.orderIds] 
      })),
      clearOrderIds: () => set({ orderIds: [] }),
    }),
    {
      name: 'my-orders-storage',
    }
  )
);
