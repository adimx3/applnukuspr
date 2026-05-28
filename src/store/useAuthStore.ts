import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
  isAuthModalOpen: boolean;
  authView: 'login' | 'register';
  loginTimestamp?: number; // epoch ms of last successful login
  openAuthModal: (view: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
  validateSession: () => void; // checks expiration, updates state
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,
      // Modal starts closed; user must login or register manually
      isAuthModalOpen: false,
      authView: 'login',
      loginTimestamp: undefined,
      openAuthModal: (view) => set({ isAuthModalOpen: true, authView: view }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      login: (role) => {
        const now = Date.now();
        set({ isAuthenticated: true, role, isAuthModalOpen: false, loginTimestamp: now });
      },
      logout: () => set({ isAuthenticated: false, role: null, loginTimestamp: undefined }),
      // Session is valid for 30 days (2592000000 ms)
      validateSession: () => {
        const { loginTimestamp, isAuthenticated } = get();
        if (isAuthenticated && loginTimestamp) {
          const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - loginTimestamp > THIRTY_DAYS_MS) {
            // Expired – force logout and show login modal
            set({ isAuthenticated: false, role: null, loginTimestamp: undefined, isAuthModalOpen: true, authView: 'login' });
          }
        }
      },
    }),
    { name: 'auth-store' }
  )
);
