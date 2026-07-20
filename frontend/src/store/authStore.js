import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Login failed',
            isLoading: false 
          });
          return false;
        }
      },

      googleLogin: async (credential) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.googleLogin(credential);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Google Login failed',
            isLoading: false 
          });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(name, email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Registration failed',
            isLoading: false 
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout API failed, but clearing local state anyway');
        } finally {
          set({ user: null, token: null, isAuthenticated: false, error: null });
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount();
          set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
          return true;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to delete account',
            isLoading: false 
          });
          return false;
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'devalive-auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
