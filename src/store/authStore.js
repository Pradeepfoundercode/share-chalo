import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      token: null,

      login: (user, token) => {
        set({
          isAuthenticated: true,
          admin: user,
          token,
        });
      },

      updateAdmin: (updatedAdmin) => {
        set((state) => ({
          admin: {
            ...state.admin,
            ...updatedAdmin,
          },
        }));
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
      name: "share-chalo-admin-auth",

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        token: state.token,
      }),
    }
  )
);