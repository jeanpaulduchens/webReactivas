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
    date: Date;
    status: ReservationStatus;
}

interface lunchBreak {
    start: Date;
    end: Date;
}

export interface AvailableHour {
    id: number;
    startHour: Date;
    endHour: Date;
    lunchBreak?: lunchBreak;
}

//export interface Barber {
//  id: number;
//  name: string;
//  serviceIds: number[]; 
//}
