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
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
