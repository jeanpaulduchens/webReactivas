import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import ReservationRow from "../components/ReservationRow";
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
    updateBarberReservation,
    cancelBarberReservation,
    deleteClientReservation,
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
    if (userRole === "barbero") {
      fetchBarberReservations(selectedDate);
    } else if (userRole === "cliente") {
      fetchClientReservations();
    }
  }, [
    userRole,
    selectedDate,
    fetchClientReservations,
    fetchBarberReservations,
  ]);

  // Recargar reservas periódicamente para ver cambios
  useEffect(() => {
    if (userRole === "cliente") {
      const interval = setInterval(() => {
        fetchClientReservations();
      }, 30000); // Recargar cada 30 segundos

      return () => clearInterval(interval);
    } else if (userRole === "barbero") {
      const interval = setInterval(() => {
        fetchBarberReservations(selectedDate);
      }, 30000); // Recargar cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [userRole, selectedDate, fetchClientReservations, fetchBarberReservations]);

  const formatDate = (dateInput: string | Date) => {
    // Manejar tanto strings como objetos Date
    let date: Date;

    if (typeof dateInput === "string") {
      // Si es string, puede venir en formato "YYYY-MM-DD" o ISO
      if (dateInput.includes("T")) {
        // Es un string ISO completo (ej: "2025-11-26T00:00:00.000Z")
        date = new Date(dateInput);
      } else {
        // Es formato "YYYY-MM-DD"
        const [year, month, day] = dateInput.split("-").map(Number);
        date = new Date(year, month - 1, day);
      }
    } else {
      // Ya es un objeto Date
      date = new Date(dateInput);
    }

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Renderizar vista para barberos
  if (userRole === "barbero") {
    return (
      <div>
        <h2 className="text-lg font-extrabold my-[18px] mx-0">
          Mis Reservas
        </h2>

        <div className="w-52 py-4 grid grid-cols-[220px_1fr] gap-6">

          <div className="bg-white rounded-card shadow-card p-[18px]">
            <h3 className="font-extrabold text-[26px] mt-0">
              Reservas del Día
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
                  Aquí tienes un resumen de tus citas confirmadas y canceladas del día seleccionado.
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
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left p-3 font-semibold text-sm">
                            Hora
                          </th>
                          <th className="text-left p-3 font-semibold text-sm">
                            Cliente
                          </th>
                          <th className="text-left p-3 font-semibold text-sm">
                            Servicio
                          </th>
                          <th className="text-left p-3 font-semibold text-sm">
                            Fecha
                          </th>
                          <th className="text-left p-3 font-semibold text-sm">
                            Estado
                          </th>
                          <th className="text-left p-3 font-semibold text-sm">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {barberReservations.map((reservation) => (
                          <ReservationRow
                            key={reservation.id}
                            reservation={reservation}
                            selectedDate={selectedDate}
                            onUpdate={updateBarberReservation}
                            onCancel={cancelBarberReservation}
                            onRefresh={() => fetchBarberReservations(selectedDate)}
                          />
                        ))}
                        {barberReservations.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-muted text-sm"
                            >
                              No hay citas confirmadas para este día.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600"
                    onClick={() => navigate(-1)}
                  >
                    ← Volver
                  </button>
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
        <h3 className="font-extrabold text-[26px] mt-0">Mis Reservas</h3>
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
                <th className="pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientReservations.map((reservation) => {
                const handleCancel = async () => {
                  if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
                    return;
                  }
                  try {
                    await deleteClientReservation(reservation.id);
                    alert("Reserva cancelada exitosamente");
                  } catch (err: any) {
                    const errorMessage = err.response?.data?.error || "Error al cancelar la reserva";
                    alert(errorMessage);
                  }
                };

                return (
                  <tr key={reservation.id} className="border-t border-gray-200">
                    <td className="py-3 text-sm">
                      {formatDate(reservation.date)}
                    </td>
                    <td className="py-3 text-sm">{reservation.time}</td>
                    <td className="py-3 text-sm">
                      <div>{reservation.service.name}</div>
                      <div className="text-xs text-muted">
                        {reservation.service.type}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      {reservation.service.durationMin} min
                    </td>
                    <td className="py-3 text-sm">${reservation.service.price}</td>
                    <td className="py-3 text-sm">
                      <span className={`text-[13px] font-semibold capitalize px-2 py-1 rounded ${
                        reservation.status === 'confirmed' 
                          ? 'text-green-600 bg-green-50' 
                          : reservation.status === 'cancelled' 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-yellow-600 bg-yellow-50'
                      }`}>
                        {reservation.status === 'confirmed' 
                          ? 'Confirmada' 
                          : reservation.status === 'cancelled' 
                          ? 'Cancelada' 
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      {reservation.status !== "cancelled" && (
                        <button
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          onClick={handleCancel}
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {clientReservations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-muted text-sm"
                  >
                    No tienes reservas aún. ¡Agenda tu primera cita!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="mt-6">
          <button
            className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
