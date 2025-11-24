import axiosSecure from "@utils/axiosSecure";
import type { BarberReservation } from "../types";

export const getConfirmedReservationsByDay = async (
  date: string,
): Promise<BarberReservation[]> => {
  const response = await axiosSecure.get(
    `/api/reservations/confirmed-by-day?date=${date}`,
  );
  return response.data;
};

/**
 * Actualizar una reserva como barbero
 */
export const updateBarberReservation = async (
  reservationId: string,
  data: { date?: string; time?: string; status?: string }
): Promise<BarberReservation> => {
  const response = await axiosSecure.put(
    `/api/reservations/${reservationId}`,
    data
  );
  return response.data;
};

/**
 * Cancelar una reserva como barbero (cambia status a cancelled)
 */
export const cancelBarberReservation = async (
  reservationId: string
): Promise<void> => {
  await axiosSecure.delete(`/api/reservations/${reservationId}`);
};
