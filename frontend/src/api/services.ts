import axios from "axios";
import axiosSecure from "@utils/axiosSecure";

const baseUrl = "/api/services";

// Obtener todos los servicios (público)
export async function getAllServices() {
  const response = await axios.get(baseUrl);
  return response.data;
}

// Obtener un servicio por ID (público)
export async function getServiceById(id: string) {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
}

// Crear un nuevo servicio (solo admin - requiere autenticación)
export async function createService(service: {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  price: number;
}) {
  const response = await axiosSecure.post(baseUrl, service);
  return response.data;
}

// Actualizar un servicio (solo admin - requiere autenticación)
export async function updateService(
  id: string,
  service: {
    name?: string;
  type?: string;
    description?: string;
    durationMin?: number;
    price?: number;
  },
) {
  const response = await axiosSecure.put(`${baseUrl}/${id}`, service);
  return response.data;
}

// Eliminar un servicio (solo admin - requiere autenticación)
export async function deleteService(id: string) {
  const response = await axiosSecure.delete(`${baseUrl}/${id}`);
  return response.data;
}
