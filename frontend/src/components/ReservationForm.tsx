import { useState, useEffect } from 'react';
import type { Service } from '@types/domain';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '@api/endpoints';

type ReservationFormProps = {
  services: Service[];
  selectedServiceId?: number;
  onSubmitReservation?: (payload: { id:number; serviceId: number; customerName: string; date: Date}) => void;
};

export const ReservationForm = ({ services, selectedServiceId, onSubmitReservation }: ReservationFormProps) => {
  const s = services.find(x => x.id === selectedServiceId);
  const [customerName, setCustomerName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{startTime: string, endTime: string}[]>([]);

  const canSubmit = Boolean(s) && customerName && selectedDate;

  useEffect(() => {
    if (s && selectedDate) {
      // Formatear la fecha para la API
      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log('Fecha enviada al backend:', dateStr);
      
      api.getAvailableHoursByService(s.id, dateStr)
        .then(slots => {
          console.log('Slots recibidos del backend:', slots);
          console.log('Primera slot parseada:', slots[0] ? new Date(slots[0].startTime) : 'No hay slots');
          setAvailableSlots(slots);
        })
        .catch(err => {
          console.error('Error fetching available slots:', err);
          setAvailableSlots([]);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [s, selectedDate]);

  // No necesitamos variables adicionales ya que manejamos todo directamente con selectedDate

  return (
    <form
      className="reservation-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!s) return;
        if (!selectedDate) return;
        onSubmitReservation?.({ id: 0, serviceId: s.id, customerName, date: selectedDate });
        setCustomerName(''); setSelectedDate(null);
      }}
    >
      <h2>Reservar</h2>
      {!s ? (
        <p style={{ color: '#dc3545' }}>Primero elige un servicio.</p>
      ) : (
        <p>
          Servicio: <strong>{s.name}</strong>{' '}
          <span className="service-details">({s.durationMin} min — ${s.price})</span>
        </p>
      )}

      <label>
        Nombre:
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ingresa tu nombre"
        />
      </label>


      <div className="calendar-section">
        <h3>Fecha y Hora</h3>
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              const newDate = new Date(value);
              if (selectedDate) {
                // Mantener la hora seleccionada al cambiar la fecha
                newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
              }
              setSelectedDate(newDate);
            }
          }}
          value={selectedDate}
          minDate={new Date()}
          locale="es-ES"
          formatShortWeekday={(_locale, date) => {
            const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
            return days[date.getDay()];
          }}
        />

        <div className="time-slots">
          <h4>Horarios Disponibles</h4>
          {selectedDate ? (
            availableSlots.length > 0 ? (
              <div className="time-slots-grid">
                {availableSlots.map((slot, index) => {
                  const startDate = new Date(slot.startTime);
                  
                  // Usar directamente toLocaleTimeString que maneja la zona horaria automáticamente
                  const time = startDate.toLocaleTimeString('es-CL', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false,
                    timeZone: 'America/Santiago' // Especificar explícitamente
                  });
                  
                  const isSelected = selectedDate && 
                    selectedDate.getTime() === startDate.getTime(); // Comparar timestamps directamente

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedDate(startDate)} // Usar startDate directamente
                      className={`time-slot-button ${isSelected ? 'selected' : ''}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="no-slots-message">No hay horarios disponibles para esta fecha.</p>
            )
          ) : (
            <p className="select-date-message">Selecciona una fecha para ver los horarios disponibles.</p>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-button" 
        disabled={!canSubmit}
      >
        Agendar
      </button>
    </form>
  );
};
