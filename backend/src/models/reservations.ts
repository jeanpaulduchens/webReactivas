import { ReservationStatus } from "@custom-types/types";

export interface Reservation {
    id: number;
    serviceId: number;
    customerName: string;
    date: Date;
    status: ReservationStatus;
}