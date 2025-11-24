import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createReservation,
  getReservationsByDateAndService,
} from "../api/reservations";
import { getAllServices } from "../api/services";
import { useAuthStore } from "../stores";
import Calendar from "../components/Calendar";
import type { Service } from "../types";

const HOURS: string[] = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

export default function Reservations() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [slot, setSlot] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);

  useEffect(() => {
    // Obtener servicios
    getAllServices().then((data) => {
      setServices(data);

      // Verificar si hay un servicio seleccionado desde la navegación
      const selectedService = location.state?.selectedService as
        | Service
        | undefined;

      if (selectedService && selectedService.id) {
        // Si hay un servicio seleccionado, usarlo
        setServiceId(selectedService.id);
      } else if (data.length > 0) {
        // Si no, usar el primero por defecto
        setServiceId(data[0].id || "");
      }
    });
  }, [location.state]);

  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    getReservationsByDateAndService(selectedDate, serviceId).then(
      (reservas) => {
        setReservedSlots(reservas.map((r: any) => r.time));
      },
    );
  }, [serviceId, selectedDate]);

  const canConfirm = user && selectedDate && slot && serviceId;

  async function handleConfirm() {
    if (!canConfirm) return;
    const reservation = {
      serviceId,
      date: selectedDate,
      time: slot || "",
      status: "confirmed",
    };
    try {
      await createReservation(reservation);
      alert("Reserva creada exitosamente");
      navigate("/mis-reservas");
    } catch (e) {
      alert("Error al crear la reserva");
    }
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold my-[18px] mx-0">Reservas</h2>

      <div className="bg-white rounded-card shadow-card p-[18px] max-w-[980px]">
        {/* Información del cliente autenticado */}
        {user && (
          <div className="mb-6 p-3.5 bg-gray-50 rounded-[10px]">
            <div className="font-semibold mb-1.5">Reservando como:</div>
            <div className="text-muted text-sm">
              {user.name} • {user.email} {user.phone && `• ${user.phone}`}
            </div>
          </div>
        )}

        <h3 className="font-extrabold text-[22px] my-[18px] mx-0 mt-0">
          Seleccionar Servicio
        </h3>
        <select
          className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff]"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <h3 className="font-extrabold text-[22px] my-[18px] mx-0">
          Fecha y Hora
        </h3>
        <div className="grid grid-cols-[380px_1fr] gap-6">
          {/* Calendar */}
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Slots */}
          <div className="grid grid-cols-4 gap-3">
            {HOURS.map((h) => (
              <button
                key={h}
                className={`border h-10 rounded-[10px] grid place-items-center cursor-pointer bg-white transition-all ${
                  slot === h
                    ? "border-primary shadow-[0_0_0_3px_#e0e7ff]"
                    : "border-gray-200 hover:border-indigo-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => setSlot(h)}
                disabled={reservedSlots.includes(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-[18px]">
          <button
            className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <button
            className="w-full border-0 rounded-[10px] h-11 font-bold bg-primary text-white cursor-pointer hover:bg-primary-600 px-[18px] disabled:opacity-55"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            ✓ Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
