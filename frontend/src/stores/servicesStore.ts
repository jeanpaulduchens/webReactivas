import { create } from "zustand";
import {
  getAllServices,
  createService as createServiceAPI,
  updateService as updateServiceAPI,
  deleteService as deleteServiceAPI,
} from "../api/services";
import type { Service } from "../types";

interface CreateServiceData {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  price: number;
}

interface UpdateServiceData {
  name?: string;
  type?: string;
  description?: string;
  durationMin?: number;
  price?: number;
}

interface ServicesState {
  // Estado
  services: Service[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  // Acciones
  fetchServices: () => Promise<void>;
  createService: (serviceData: CreateServiceData) => Promise<Service>;
  updateService: (id: string, serviceData: UpdateServiceData) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearAll: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  // Estado inicial
  services: [],
  loading: false,
  error: null,
  successMessage: null,

  // Obtener todos los servicios
  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const services = await getAllServices();
      set({
        services,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al cargar los servicios";
      set({
        services: [],
        loading: false,
        error: errorMessage,
      });
    }
  },

  // Crear un nuevo servicio
  createService: async (serviceData: CreateServiceData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const newService = await createServiceAPI(serviceData);

      // Agregar el nuevo servicio a la lista
      set((state) => ({
        services: [...state.services, newService],
        loading: false,
        error: null,
        successMessage: `Servicio "${newService.name}" creado exitosamente`,
      }));

      return newService;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al crear el servicio";
      set({
        loading: false,
        error: errorMessage,
        successMessage: null,
      });
      throw err;
    }
  },

  // Actualizar un servicio
  updateService: async (id: string, serviceData: UpdateServiceData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const updatedService = await updateServiceAPI(id, serviceData);

      // Actualizar el servicio en la lista
      set((state) => ({
        services: state.services.map((s) =>
          s.id === id ? updatedService : s,
        ),
        loading: false,
        error: null,
        successMessage: `Servicio "${updatedService.name}" actualizado exitosamente`,
      }));

      return updatedService;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al actualizar el servicio";
      set({
        loading: false,
        error: errorMessage,
        successMessage: null,
      });
      throw err;
    }
  },

  // Eliminar un servicio
  deleteService: async (id: string) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      // Obtener el servicio antes de eliminarlo para el mensaje
      const deletedService = useServicesStore
        .getState()
        .services.find((s) => s.id === id);

      await deleteServiceAPI(id);
      
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
        loading: false,
        error: null,
        successMessage: deletedService
          ? `Servicio "${deletedService.name}" eliminado exitosamente`
          : "Servicio eliminado exitosamente",
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al eliminar el servicio";
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

