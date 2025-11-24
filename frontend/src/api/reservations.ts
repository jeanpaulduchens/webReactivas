import axios from "axios";
import axiosSecure from "@utils/axiosSecure";

const baseUrl = "/api/reservations";

export async function createReservation(reservation: {
  serviceId: string;
  barberId?: string;
  date: string;
  time: string;
  status?: string;
}) {
  const response = await axiosSecure.post(baseUrl, reservation);
  return response.data;
}

export async function getReservationsByDateAndService(
  date: string,
  serviceId: string,
) {
  const response = await axios.get(
    baseUrl + `?date=${date}&serviceId=${serviceId}`,
  );
  return response.data;
}
