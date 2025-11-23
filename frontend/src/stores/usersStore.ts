import { create } from "zustand";
import { createUserAsAdmin, getAllUsers } from "../api/users";
import type { User, CreateUserData } from "../types";

interface UsersState {
  // Estado
  users: User[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  // Acciones
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<User>;
  clearError: () => void;
  clearSuccess: () => void;
  clearAll: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  // Estado inicial
  users: [],
  loading: false,
  error: null,
  successMessage: null,

  // Obtener todos los usuarios
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await getAllUsers();
      set({
        users,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al cargar los usuarios";
      set({
        users: [],
        loading: false,
        error: errorMessage,
      });
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData: CreateUserData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const newUser = await createUserAsAdmin(userData);

      // Agregar el nuevo usuario a la lista
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
        error: null,
        successMessage: `Usuario ${newUser.username} creado exitosamente`,
      }));

      return newUser;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al crear el usuario";
      set({
        loading: false,
        error: errorMessage,
        successMessage: null,
      });
      throw err;
    }
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Limpiar mensaje de éxito
  clearSuccess: () => {
    set({ successMessage: null });
  },

  // Limpiar todo
  clearAll: () => {
    set({
      error: null,
      successMessage: null,
    });
  },
}));
