import { create } from "zustand";
import {
  getMyReservations,
  updateReservation,
  deleteReservation,
} from "../api/clientReservations";
import { 
  getConfirmedReservationsByDay,
  updateBarberReservation,
  cancelBarberReservation
} from "../api/barberReservations";
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
  updateBarberReservation: (id: string, data: { date?: string; time?: string; status?: string }) => Promise<void>;
  cancelBarberReservation: (id: string) => Promise<void>;
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

  // Cancelar reserva de cliente (cambia status a cancelled)
  deleteClientReservation: async (id: string) => {
    set({ clientLoading: true, clientError: null });
    try {
      await deleteReservation(id);
      // Recargar las reservas para reflejar el cambio de estado
      await get().fetchClientReservations();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Error al cancelar la reserva";
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

  // Actualizar reserva de barbero
  updateBarberReservation: async (id: string, data: { date?: string; time?: string; status?: string }) => {
    set({ barberLoading: true, barberError: null });
    try {
      await updateBarberReservation(id, data);
      // Recargar las reservas después de actualizar
      const currentDate = get().selectedDate;
      await get().fetchBarberReservations(currentDate);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al actualizar la reserva';
      set({
        barberLoading: false,
        barberError: errorMessage,
      });
      throw err;
    }
  },

  // Cancelar reserva de barbero
  cancelBarberReservation: async (id: string) => {
    set({ barberLoading: true, barberError: null });
    try {
      await cancelBarberReservation(id);
      // Recargar las reservas después de cancelar
      const currentDate = get().selectedDate;
      await get().fetchBarberReservations(currentDate);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al cancelar la reserva';
      set({
        barberLoading: false,
        barberError: errorMessage,
      });
      throw err;
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
