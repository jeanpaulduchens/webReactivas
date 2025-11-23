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

  const formatDate = (dateInput: string | Date) => {
    // Manejar tanto strings como objetos Date
    let date: Date;
    
    if (typeof dateInput === 'string') {
      // Si es string, puede venir en formato "YYYY-MM-DD" o ISO
      if (dateInput.includes('T')) {
        // Es un string ISO completo (ej: "2025-11-26T00:00:00.000Z")
        date = new Date(dateInput);
      } else {
        // Es formato "YYYY-MM-DD"
        const [year, month, day] = dateInput.split('-').map(Number);
        date = new Date(year, month - 1, day);
      }
    } else {
      // Ya es un objeto Date
      date = new Date(dateInput);
    }
    
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
        <h2 className="text-lg font-extrabold my-[18px] mx-0">Mis Reservas Confirmadas</h2>

        <div className="grid grid-cols-[220px_1fr] gap-6">
          <div className="w-52 py-4 text-muted">
            <a className="block py-1.5 font-bold" href="#!">Mis Reservas</a>
            <a className="block py-1.5" href="#!">Servicios</a>
            <a className="block py-1.5" href="#!">Clientes</a>
            <a className="block py-1.5" href="#!">Configuración</a>
          </div>

          <div className="bg-white rounded-card shadow-card p-[18px]">
            <h3 className="font-extrabold text-[26px] mt-0">
              Mis Reservas Confirmadas
            </h3>

            <div className="grid grid-cols-[380px_1fr] gap-6">
              {/* Calendario */}
              <Calendar 
                selectedDate={selectedDate} 
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  fetchBarberReservations(date);
                }} 
              />

              {/* Lista de reservas */}
              <div className="bg-white rounded-card shadow-card p-[18px]">
                <h4 className="font-extrabold text-xl mt-0">
                  Citas del {formatDate(selectedDate)}
                </h4>
                <p className="mt-0 mb-4 text-muted text-sm">
                  Aquí tienes un resumen de tus citas confirmadas y programadas.
                </p>

                {barberLoading && (
                  <div className="text-center py-6 text-muted">
                    Cargando reservas...
                  </div>
                )}

                {barberError && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 mb-4">
                    {barberError}
                  </div>
                )}

                {!barberLoading && !barberError && (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-muted text-xs font-bold">
                        <th className="pb-3">Hora</th>
                        <th className="pb-3">Cliente</th>
                        <th className="pb-3">Servicio</th>
                        <th className="pb-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barberReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-t border-gray-200">
                          <td className="py-3 text-sm">
                            {reservation.time}
                          </td>
                          <td className="py-3 text-sm">
                            <div className="font-semibold">{reservation.client.name}</div>
                            <div className="text-xs text-muted">
                              {reservation.client.phone || reservation.client.email}
                            </div>
                          </td>
                          <td className="py-3 text-sm">
                            <div>{reservation.service.name}</div>
                            <div className="text-xs text-muted">
                              {reservation.service.durationMin} min · ${reservation.service.price}
                            </div>
                          </td>
                          <td className="py-3 text-sm">
                            <span className="text-green-600 text-[13px] font-semibold capitalize">
                              {reservation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {barberReservations.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-muted text-sm">
                            No hay citas confirmadas para este día.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                <div className="mt-6">
                  <button className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600" onClick={() => navigate(-1)}>← Volver</button>
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
      <h2 className="text-lg font-extrabold my-[18px] mx-0">Mis Reservas</h2>

      <div className="bg-white rounded-card shadow-card p-[18px]">
        <h3 className="font-extrabold text-[26px] mt-0">
          Mis Reservas
        </h3>
        <p className="mt-0 mb-4 text-muted text-sm">
          Aquí puedes ver todas tus reservas realizadas.
        </p>

        {clientLoading && (
          <div className="text-center py-6 text-muted">
            Cargando reservas...
          </div>
        )}

        {clientError && (
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 mb-4">
            {clientError}
          </div>
        )}

        {!clientLoading && !clientError && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-muted text-xs font-bold">
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Hora</th>
                <th className="pb-3">Servicio</th>
                <th className="pb-3">Duración</th>
                <th className="pb-3">Precio</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientReservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-gray-200">
                  <td className="py-3 text-sm">{formatDate(reservation.date)}</td>
                  <td className="py-3 text-sm">{reservation.time}</td>
                  <td className="py-3 text-sm">
                    <div>{reservation.service.name}</div>
                    <div className="text-xs text-muted">
                      {reservation.service.type}
                    </div>
                  </td>
                  <td className="py-3 text-sm">{reservation.service.durationMin} min</td>
                  <td className="py-3 text-sm">${reservation.service.price}</td>
                  <td className="py-3 text-sm">
                    <span className="text-green-600 text-[13px] font-semibold capitalize">
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
              {clientReservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted text-sm">
                    No tienes reservas aún. ¡Agenda tu primera cita!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="mt-6">
          <button className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600" onClick={() => navigate(-1)}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
