import axios from "axios";
import type { User } from "../types";

/**
 * Obtener todos los barberos disponibles
 */
export const getAllBarbers = async (): Promise<User[]> => {
  const response = await axios.get("/api/users/barbers");
  return response.data;
};

