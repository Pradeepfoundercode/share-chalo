import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      token: null,

      login: (adminData, token = 'admin-demo-token-123') => {
        set({
          isAuthenticated: true,
          admin: adminData,
          token: token,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
          token: null,
        });
      },
    }),
    {
      name: 'share-chalo-admin-auth',
    }
  )
);

