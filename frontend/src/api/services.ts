import axios from "axios";

const baseUrl = "/api/services";

export async function getAllServices() {
  const response = await axios.get(baseUrl);
  return response.data;
}

export async function getServiceById(id: string) {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
}

export async function createService(service: {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  price: number;
}) {
  const response = await axios.post(baseUrl, service);
  return response.data;
}

export async function updateService(
  id: string,
  service: {
    name: string;
    description: string;
    durationMin: number;
    price: number;
  },
) {
  const response = await axios.put(`${baseUrl}/${id}`, service);
  return response.data;
}

export async function deleteService(id: string) {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
}
