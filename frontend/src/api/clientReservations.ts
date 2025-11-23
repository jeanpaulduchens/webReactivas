import axiosSecure from "@utils/axiosSecure";
import type { ClientReservation } from "../types";

export const getMyReservations = async (): Promise<ClientReservation[]> => {
  const response = await axiosSecure.get("/api/reservations/my-reservations");
  return response.data;
};
