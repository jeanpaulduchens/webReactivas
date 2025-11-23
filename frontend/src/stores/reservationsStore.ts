import { create } from "zustand";
import {
  getMyReservations,
  updateReservation,
  deleteReservation,
} from "../api/clientReservations";
import { getConfirmedReservationsByDay } from "../api/barberReservations";
import type { ClientReservation, BarberReservation } from "../types";

interface ReservationsState {
  // Estado para clientes
  clientReservations: ClientReservation[];
  clientLoading: boolean;
  clientError: string | null;

  // Estado para barberos
  barberReservations: BarberReservation[];
  barberLoading: boolean;
  barberError: string | null;
  selectedDate: string; // Fecha seleccionada para ver reservas de barbero

  // Acciones para clientes
  fetchClientReservations: () => Promise<void>;
  updateClientReservation: (
    id: string,
    data: { serviceId?: string; date?: string; time?: string; status?: string },
  ) => Promise<void>;
  deleteClientReservation: (id: string) => Promise<void>;
  clearClientReservations: () => void;

  // Acciones para barberos
  fetchBarberReservations: (date: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  clearBarberReservations: () => void;

  // Utilidades
  clearErrors: () => void;
}

export const useReservationsStore = create<ReservationsState>((set, get) => ({
  // Estado inicial - Clientes
  clientReservations: [],
  clientLoading: false,
  clientError: null,

  // Estado inicial - Barberos
  barberReservations: [],
  barberLoading: false,
  barberError: null,
  selectedDate: new Date().toISOString().split("T")[0],

  // Fetch reservas de cliente
  fetchClientReservations: async () => {
    set({ clientLoading: true, clientError: null });
    try {
      const reservations = await getMyReservations();
      set({
        clientReservations: reservations,
        clientLoading: false,
        clientError: null,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al cargar las reservas";
      set({
        clientReservations: [],
        clientLoading: false,
        clientError: errorMessage,
      });
    }
  },

  // Actualizar reserva de cliente
  updateClientReservation: async (
    id: string,
    data: { serviceId?: string; date?: string; time?: string; status?: string },
  ) => {
    set({ clientLoading: true, clientError: null });
    try {
      await updateReservation(id, data);
      // Recargar las reservas después de actualizar
      await get().fetchClientReservations();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al actualizar la reserva";
      set({
        clientLoading: false,
        clientError: errorMessage,
      });
      throw err;
    }
  },

  // Eliminar reserva de cliente
  deleteClientReservation: async (id: string) => {
    set({ clientLoading: true, clientError: null });
    try {
      await deleteReservation(id);
      // Remover la reserva del estado local
      set((state) => ({
        clientReservations: state.clientReservations.filter((r) => r.id !== id),
        clientLoading: false,
        clientError: null,
      }));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al eliminar la reserva";
      set({
        clientLoading: false,
        clientError: errorMessage,
      });
      throw err;
    }
  },

  // Limpiar reservas de cliente
  clearClientReservations: () => {
    set({
      clientReservations: [],
      clientLoading: false,
      clientError: null,
    });
  },

  // Fetch reservas de barbero por fecha
  fetchBarberReservations: async (date: string) => {
    set({ barberLoading: true, barberError: null, selectedDate: date });
    try {
      const reservations = await getConfirmedReservationsByDay(date);
      set({
        barberReservations: reservations,
        barberLoading: false,
        barberError: null,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al cargar las reservas";
      set({
        barberReservations: [],
        barberLoading: false,
        barberError: errorMessage,
      });
    }
  },

  // Establecer fecha seleccionada para barbero
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  // Limpiar reservas de barbero
  clearBarberReservations: () => {
    set({
      barberReservations: [],
      barberLoading: false,
      barberError: null,
    });
  },

  // Limpiar todos los errores
  clearErrors: () => {
    set({
      clientError: null,
      barberError: null,
    });
  },
}));
