import axiosSecure from "@utils/axiosSecure";
import type { BarberReservation } from "../types";

export const getConfirmedReservationsByDay = async (
  date: string
): Promise<BarberReservation[]> => {
  const response = await axiosSecure.get(
    `/api/reservations/confirmed-by-day?date=${date}`
  );
  return response.data;
};