export async function getReservationsByDateAndService(date: string, serviceId: string) {
  const response = await axios.get(baseUrl + `?date=${date}&serviceId=${serviceId}`);
  return response.data;
}
import axios from "axios";

const baseUrl = "/api/reservations";

export async function createReservation(reservation: {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  status?: string;
}) {
  const response = await axios.post(baseUrl, reservation);
  return response.data;
}
