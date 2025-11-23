import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import { getConfirmedReservationsByDay } from "../api/barberReservations";
import { getMyReservations } from "../api/clientReservations";
import type { BarberReservation, ClientReservation } from "../types";

export default function MyBookings() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [barberReservations, setBarberReservations] = useState<BarberReservation[]>([]);
  const [clientReservations, setClientReservations] = useState<ClientReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'barbero' | null>(null);

  // Detectar el rol del usuario desde localStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserRole(userData.role);
        console.log('Rol del usuario:', userData.role);
      } catch (err) {
        console.error('Error parseando userData:', err);
      }
    }
  }, []);

  // Cargar reservas según el rol del usuario
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        if (userRole === 'barbero') {
          // Barbero: cargar reservas por día
          console.log('Cargando reservas de barbero para fecha:', selectedDate);
          const data = await getConfirmedReservationsByDay(selectedDate);
          console.log('Reservas de barbero obtenidas:', data);
          setBarberReservations(data);
        } else if (userRole === 'cliente') {
          // Cliente: cargar sus propias reservas
          console.log('Cargando reservas de cliente');
          const data = await getMyReservations();
          console.log('Reservas de cliente obtenidas:', data);
          setClientReservations(data);
        }
      } catch (err: any) {
        console.error("Error al cargar reservas:", err);
        setError(err.response?.data?.error || "Error al cargar las reservas");
        setBarberReservations([]);
        setClientReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      console.log('Ejecutando fetchReservations para rol:', userRole);
      fetchReservations();
    } else {
      console.log('No hay userRole definido aún');
    }
  }, [userRole, selectedDate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { 
      day: "numeric", 
      month: "long",
      year: "numeric"
    });
  };

  // Renderizar vista para barberos
  if (userRole === 'barbero') {
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
                      {barberReservations.map((reservation) => (
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
                      {barberReservations.length === 0 && (
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
                  <button className="btn" onClick={() => navigate(-1)}>← Volver</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar vista para clientes
  return (
    <div>
      <h2 className="section-title">Mis Reservas</h2>

      <div className="panel pad">
        <h3 className="page-title">
          Mis Reservas
        </h3>
        <p className="description-text">
          Aquí puedes ver todas tus reservas realizadas.
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
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Duración</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{formatDate(reservation.date)}</td>
                  <td>{reservation.time}</td>
                  <td>
                    <div>{reservation.service.name}</div>
                    <div className="service-info">
                      {reservation.service.type}
                    </div>
                  </td>
                  <td>{reservation.service.durationMin} min</td>
                  <td>${reservation.service.price}</td>
                  <td>
                    <span className="status-badge">
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
              {clientReservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-message">
                    No tienes reservas aún. ¡Agenda tu primera cita!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="actions-row">
          <button className="btn" onClick={() => navigate(-1)}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
