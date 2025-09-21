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
    getAllReservations,
    getReservation,
    getAllUsers,
    getUser,
    createReservation,
}