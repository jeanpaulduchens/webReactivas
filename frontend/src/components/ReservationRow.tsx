import { useState } from "react";
import type { BarberReservation } from "../types";

interface ReservationRowProps {
  reservation: BarberReservation;
  selectedDate: string;
  onUpdate: (id: string, data: { date?: string; time?: string; status?: string }) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function ReservationRow({
  reservation,
  selectedDate,
  onUpdate,
  onCancel,
  onRefresh,
}: ReservationRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [editTime, setEditTime] = useState(reservation.time);
  const [editDate, setEditDate] = useState(reservation.date);

  const HOURS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
  ];

  const handleSave = async () => {
    try {
      const updateData: { date?: string; time?: string } = {};
      if (editTime !== reservation.time) {
        updateData.time = editTime;
      }
      if (editDate !== reservation.date) {
        updateData.date = editDate;
      }

      if (Object.keys(updateData).length > 0) {
        await onUpdate(reservation.id, updateData);
        setIsEditing(false);
        onRefresh();
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar la reserva");
    }
  };

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }
    setIsCancelling(true);
    try {
      await onCancel(reservation.id);
      onRefresh();
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert("Error al cancelar la reserva");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isEditing) {
    // Convertir la fecha al formato YYYY-MM-DD para el input
    const dateForInput = editDate.includes('T') 
      ? editDate.split('T')[0] 
      : editDate;

    return (
      <tr className="border-b border-gray-100 bg-blue-50">
        <td className="p-3 text-sm">
          <select
            className="w-full h-8 border border-gray-200 rounded px-2 text-sm"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </td>
        <td className="p-3 text-sm">
          <div className="font-semibold">{reservation.client.name}</div>
          <div className="text-xs text-muted">
            {reservation.client.phone || reservation.client.email}
          </div>
        </td>
        <td className="p-3 text-sm">
          <div className="font-medium">{reservation.service.name}</div>
          <div className="text-xs text-muted">
            {reservation.service.durationMin} min · ${reservation.service.price}
          </div>
        </td>
        <td className="p-3 text-sm">
          <input
            type="date"
            className="w-full h-8 border border-gray-200 rounded px-2 text-sm"
            value={dateForInput}
            onChange={(e) => setEditDate(e.target.value)}
          />
        </td>
        <td className="p-3 text-sm">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-600"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              onClick={() => {
                setIsEditing(false);
                setEditTime(reservation.time);
                setEditDate(reservation.date);
              }}
            >
              Cancelar
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Formatear fecha para mostrar
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const displayDate = reservation.date.includes('T') 
    ? reservation.date.split('T')[0] 
    : reservation.date;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="p-3 text-sm font-medium">{reservation.time}</td>
      <td className="p-3 text-sm">
        <div className="font-semibold">{reservation.client.name}</div>
        <div className="text-xs text-muted">
          {reservation.client.phone || reservation.client.email}
        </div>
      </td>
      <td className="p-3 text-sm">
        <div className="font-medium">{reservation.service.name}</div>
        <div className="text-xs text-muted">
          {reservation.service.durationMin} min · ${reservation.service.price}
        </div>
      </td>
      <td className="p-3 text-sm">
        {formatDate(displayDate)}
      </td>
      <td className="p-3 text-sm">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block ${getStatusBadgeColor(reservation.status)}`}>
          {reservation.status === 'confirmed' 
            ? 'Confirmada' 
            : reservation.status === 'cancelled' 
            ? 'Cancelada' 
            : 'Pendiente'}
        </span>
      </td>
      <td className="p-3 text-sm">
        {reservation.status !== "cancelled" && (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
              disabled={isCancelling}
            >
              Editar
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelando..." : "Cancelar"}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

