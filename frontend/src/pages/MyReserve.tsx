import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import { useAuthStore, useReservationsStore } from "../stores";

export default function MyBookings() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  
  // Store de autenticación
  const { user } = useAuthStore();
  const userRole = user?.role || null;

  // Store de reservas
  const {
    clientReservations,
    clientLoading,
    clientError,
    barberReservations,
    barberLoading,
    barberError,
    selectedDate,
    fetchClientReservations,
    fetchBarberReservations,
    setSelectedDate,
  } = useReservationsStore();

  // Inicializar fecha seleccionada
  useEffect(() => {
    if (selectedDate !== today) {
      setSelectedDate(today);
    }
  }, []);

  // Cargar reservas según el rol del usuario
  useEffect(() => {
    if (userRole === 'barbero') {
      fetchBarberReservations(selectedDate);
    } else if (userRole === 'cliente') {
      fetchClientReservations();
    }
  }, [userRole, selectedDate, fetchClientReservations, fetchBarberReservations]);

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
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  fetchBarberReservations(date);
                }} 
              />

              {/* Lista de reservas */}
              <div className="panel pad">
                <h4 className="section-subtitle">
                  Citas del {formatDate(selectedDate)}
                </h4>
                <p className="description-text">
                  Aquí tienes un resumen de tus citas confirmadas y programadas.
                </p>

                {barberLoading && (
                  <div className="loading-message">
                    Cargando reservas...
                  </div>
                )}

                {barberError && (
                  <div className="error-box">
                    {barberError}
                  </div>
                )}

                {!barberLoading && !barberError && (
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

        {clientLoading && (
          <div className="loading-message">
            Cargando reservas...
          </div>
        )}

        {clientError && (
          <div className="error-box">
            {clientError}
          </div>
        )}

        {!clientLoading && !clientError && (
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
