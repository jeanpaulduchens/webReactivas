import axiosSecure from "@utils/axiosSecure";
import type { User } from "../types";

export interface CreateUserData {
  username: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "cliente" | "barbero" | "admin";
}

/**
 * Crear un nuevo usuario como administrador
 * Requiere autenticación como admin
 */
export const createUserAsAdmin = async (
  userData: CreateUserData,
): Promise<User> => {
  const response = await axiosSecure.post("/api/users/admin", userData);
  return response.data;
};

/**
 * Obtener todos los usuarios (solo admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosSecure.get("/api/users");
  return response.data;
};
