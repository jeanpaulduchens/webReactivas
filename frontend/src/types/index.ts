import { ReservationStatus } from "./enums";

export interface Service {
  id?: string;
  name: string;
  type: string;
  description: string;
  durationMin: number;
  price: number;
}

export interface Reservation {
  id?: string;
  serviceId: string;
  userId: string;
  date: string;
  time: string;
  status: ReservationStatus;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'cliente' | 'barbero' | 'admin';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Interfaces para la vista de reservas del barbero
export interface BarberReservationClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface BarberReservationService {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  durationMin: number;
}

export interface BarberReservation {
  id: string;
  date: string;
  time: string;
  status: ReservationStatus;
  client: BarberReservationClient;
  service: BarberReservationService;
}

// Interface para las reservas de los clientes (mis reservas)
export interface ClientReservation {
  id: string;
  date: string;
  time: string;
  status: ReservationStatus;
  service: BarberReservationService;
}
