import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      cardNumber: '',
      setCardNumber: (cardNumber) => set({ cardNumber }),
    }),
    { name: 'settings-store' },
  ),
);
