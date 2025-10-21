import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import { getConfirmedReservationsByDay } from "../api/barberReservations";
import type { BarberReservation } from "../types";

interface MyBookingsProps {
  onBack: () => void;
}

export default function MyBookings({ onBack }: MyBookingsProps) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [reservations, setReservations] = useState<BarberReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar reservas cada vez que cambia la fecha seleccionada
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getConfirmedReservationsByDay(selectedDate);
        setReservations(data);
      } catch (err: any) {
        console.error("Error al cargar reservas:", err);
        setError(err.response?.data?.error || "Error al cargar las reservas");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { 
      day: "numeric", 
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div>
      <h2 className="section-title">Mis Reservas Confirmadas</h2>

      <div className="layout-with-sidebar">
        <div className="sidebar">
          <a className="active" href="#!">Mis Reservas</a>
          <a href="#!">Servicios</a>
          <a href="#!">Clientes</a>
          <a href="#!">Configuración</a>
        </div>

        <div className="panel pad">
          <h3 className="page-title">
            Mis Reservas Confirmadas
          </h3>

          <div className="two-col">
            {/* Calendario */}
            <Calendar 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />

            {/* Lista de reservas */}
            <div className="panel pad">
              <h4 className="section-subtitle">
                Citas del {formatDate(selectedDate)}
              </h4>
              <p className="description-text">
                Aquí tienes un resumen de tus citas confirmadas y programadas.
              </p>

              {loading && (
                <div className="loading-message">
                  Cargando reservas...
                </div>
              )}

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <table className="reservations-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>
                          {reservation.time}
                        </td>
                        <td>
                          <div className="client-name">{reservation.client.name}</div>
                          <div className="client-info">
                            {reservation.client.phone || reservation.client.email}
                          </div>
                        </td>
                        <td>
                          <div>{reservation.service.name}</div>
                          <div className="service-info">
                            {reservation.service.durationMin} min · ${reservation.service.price}
                          </div>
                        </td>
                        <td>
                          <span className="status-badge">
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr>
                        <td colSpan={4} className="empty-message">
                          No hay citas confirmadas para este día.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              <div className="actions-row">
                <button className="btn" onClick={onBack}>← Volver</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
