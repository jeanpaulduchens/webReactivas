import axiosSecure from "@utils/axiosSecure";
import type { ClientReservation } from "../types";

export const getMyReservations = async (): Promise<ClientReservation[]> => {
  const response = await axiosSecure.get("/api/reservations/my-reservations");
  return response.data;
};

export const updateReservation = async (
  reservationId: string,
  data: { serviceId?: string; date?: string; time?: string; status?: string }
): Promise<ClientReservation> => {
  const response = await axiosSecure.put(`/api/reservations/${reservationId}`, data);
  return response.data;
};

export const deleteReservation = async (reservationId: string): Promise<void> => {
  await axiosSecure.delete(`/api/reservations/${reservationId}`);
};
