import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
