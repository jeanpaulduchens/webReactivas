import { useState } from 'react';
import type { Service } from '@types/domain';

type ReservationFormProps = {
  services: Service[];
  selectedServiceId?: number;
  onSubmitReservation?: (payload: { id:number; serviceId: number; customerName: string; date: Date}) => void;
};

export const ReservationForm = ({ services, selectedServiceId, onSubmitReservation }: ReservationFormProps) => {
  const s = services.find(x => x.id === selectedServiceId);
  const [customerName, setCustomerName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const canSubmit = Boolean(s) && customerName && selectedDate;

  //Funcion para convertir input date+time a Date
  const handleDateChange = (dateStr: string, timeStr: string) => {
    if (!dateStr) {
      setSelectedDate(null);
      return;
    }

    const date = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      date.setHours(hours, minutes);
    }
    setSelectedDate(date);
  }

  const handleTimeChange = (timeStr: string) => {
    if (!selectedDate || !timeStr) return;

    const newDate = new Date(selectedDate);
    const [hours, minutes] = timeStr.split(':').map(Number);
    newDate.setHours(hours, minutes);
    setSelectedDate(newDate);
  }

  const dateInputValue = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const timeInputValue = selectedDate ?
    selectedDate.toLocaleTimeString('es-CL', {
      hour: '2-digit', minute: '2-digit', hour12: false
    }) : '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!s) return;
        onSubmitReservation?.({ serviceId: s.id, customerName, date: selectedDate });
        setCustomerName(''); setSelectedDate(null);
      }}
    >
      <h2>Reservar</h2>
      {!s ? <p style={{ color: '#a00' }}>Primero elige un servicio.</p>
          : <p>Servicio: <strong>{s.name}</strong> ({s.durationMin} min — ${s.price})</p>}

      <label>
        Nombre:
        <input
          value={customerName}
          onChange={(e)=>setCustomerName(e.target.value)}
        />
      </label><br/>

      <label>
        Fecha:
        <input
          type="date"
          value={dateInputValue}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e)=> handleDateChange(e.target.value, timeInputValue)}
        />
      </label><br/>

      <label>
        Hora:
        <input
          type="time"
          value={timeInputValue}
          onChange={(e)=>handleTimeChange(e.target.value)}
          disabled={!selectedDate}
        />
      </label><br/>

      <button type="submit" disabled={!canSubmit}>Agendar</button>
    </form>
  );
};
