import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, logout, restoreLogin } from "../api/login";
import type { User, LoginCredentials } from "../types";

interface AuthState {
  // Estado
  user: User | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      csrfToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await login(credentials);

          // Obtener el token CSRF del localStorage (se guarda en login())
          const csrfToken = localStorage.getItem("csrfToken");

          set({
            user: userData,
            csrfToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.error || "Error al iniciar sesión";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            csrfToken: null,
          });
          throw err;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await logout();

          // Limpiar el estado de autenticación
          set({
            user: null,
            csrfToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Limpiar el localStorage de Zustand persist
          localStorage.removeItem("auth-storage");
        } catch (err) {
          // Incluso si falla el logout en el servidor, limpiamos el estado local
          set({
            user: null,
            csrfToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Limpiar el localStorage de Zustand persist
          localStorage.removeItem("auth-storage");
        }
      },

      // Restaurar sesión desde localStorage
      restoreSession: async () => {
        const csrfToken = localStorage.getItem("csrfToken");
        const userDataStr = localStorage.getItem("userData");

        if (csrfToken && userDataStr) {
          try {
            // Verificar que la sesión sigue siendo válida
            const currentUser = await restoreLogin();

            if (currentUser) {
              set({
                user: currentUser,
                csrfToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              // Sesión inválida, limpiar
              set({
                user: null,
                csrfToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (err) {
            // Error al restaurar, limpiar estado
            set({
              user: null,
              csrfToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          set({
            user: null,
            csrfToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Limpiar error
      clearError: () => {
        set({ error: null });
      },

      // Establecer usuario manualmente
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage", // nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        csrfToken: state.csrfToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
