import axios from "axios";
const baseURL = "http://localhost:3001";
import type { Reservation } from '@types/domain';

const getAllServices = () => {
    const request = axios.get(`${baseURL}/services`);
    return request.then((response) => response.data);
};

const getService = (id: number) => {
    const request = axios.get(`${baseURL}/services?id=${id}`);
    return request.then((response) => response.data[0]);
}

const getAllAvailableHours = () => {
    const request = axios.get(`${baseURL}/availableHours`);
    return request.then((response) => response.data);
};

const getAvailableHourByID = (id: number) => {
    const request = axios.get(`${baseURL}/availableHours?id=${id}`);
    return request.then((response) => response.data[0]);
}

const getAvailableHoursByDay = (day: string) => {
    const request = axios.get(`${baseURL}/availableHours?day=${day}`);
    return request.then((response) => response.data);
}

const getAvailableHoursByService = async (serviceId: number, date: string) => {
    try {
        // Obtener el servicio para saber su duración
        const service = await getService(serviceId);
        
        // Obtener las horas disponibles para ese día
        const availableHoursResponse = await axios.get(
            `${baseURL}/availableHours`
        );
        const availableHours = availableHoursResponse.data.find(
            (hours: { startHour: string, endHour: string, lunchBreak?: { start: string, end: string } }) => 
                new Date(hours.startHour).toISOString().split('T')[0] === date
        );

        if (!availableHours) {
            return []; // No hay horarios disponibles para ese día
        }

        // Obtener las reservas existentes para esa fecha
        const reservationsResponse = await axios.get(
            `${baseURL}/reservations?date=${date}&status=pending`
        );
        const reservations: Reservation[] = reservationsResponse.data;

        // Generar slots de tiempo disponibles
        const slots = [];
        const dayStart = new Date(availableHours.startHour);
        const dayEnd = new Date(availableHours.endHour);
        const slotDuration = service.durationMin; // duración en minutos
        
        // Iterar en intervalos según la duración del servicio
        for (let slotTime = new Date(dayStart); slotTime < dayEnd; slotTime = new Date(slotTime.getTime() + slotDuration * 60000)) {
            const slotEndTime = new Date(slotTime.getTime() + slotDuration * 60000);
            
            // Verificar si el slot está en hora de almuerzo
            if (availableHours.lunchBreak) {
                const lunchStart = new Date(availableHours.lunchBreak.start);
                const lunchEnd = new Date(availableHours.lunchBreak.end);
                if (
                    (slotTime >= lunchStart && slotTime < lunchEnd) ||
                    (slotEndTime > lunchStart && slotEndTime <= lunchEnd)
                ) {
                    continue;
                }
            }

            // No mostrar slots pasados si es hoy
            if (slotTime < new Date()) continue;

            // Verificar si el slot termina después del fin del día
            if (slotEndTime > dayEnd) continue;

            // Verificar si el slot está disponible (no hay reservas que se solapen)
            const isSlotAvailable = !reservations.some(reservation => {
                const reservationTime = new Date(reservation.date);
                const reservationEndTime = new Date(reservationTime.getTime() + slotDuration * 60000);

                return (
                    (slotTime >= reservationTime && slotTime < reservationEndTime) ||
                    (slotEndTime > reservationTime && slotEndTime <= reservationEndTime) ||
                    (slotTime <= reservationTime && slotEndTime >= reservationEndTime)
                );
            });

            if (isSlotAvailable) {
                slots.push({
                    startTime: slotTime.toISOString(),
                    endTime: slotEndTime.toISOString()
                });
            }
        }

        return slots;
    } catch (error) {
        console.error('Error calculating available hours:', error);
        throw error;
    }
};

const getAllReservations = () => {
    const request = axios.get<Reservation[]>(`${baseURL}/reservations`);
    return request.then((response) => response.data);
};

const getReservation = (id: number) => {
    const request = axios.get(`${baseURL}/reservations?id=${id}`);
    return request.then((response) => response.data[0]);
};

const getAllUsers = () => {
    const request = axios.get(`${baseURL}/users`);
    return request.then((response) => response.data);
};

const getUser = (id: number) => {
    const request = axios.get(`${baseURL}/users?id=${id}`);
    return request.then((response) => response.data[0]);
};

const createReservation = (newObject: Reservation) => {
    const send = axios.post<Reservation>(`${baseURL}/reservations`, newObject);
    return send.then((response) => response.data);
};

export default {
    getAllServices,
    getService,
    getAllAvailableHours,
    getAvailableHourByID,
    getAvailableHoursByDay,
    getAvailableHoursByService,
    getAllReservations,
    getReservation,
    getAllUsers,
    getUser,
    createReservation,
}