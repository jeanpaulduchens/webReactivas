type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Service {
    id: number;
    name: string;
    durationMin: number;
    price: number;
}

export interface Reservation {
    id: number;
    serviceId: number;
    customerName: string;
    date: string;
    time: string;
    status: ReservationStatus;
}