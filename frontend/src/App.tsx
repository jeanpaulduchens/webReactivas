import './App.css';
import { useEffect, useState } from 'react';
import api from '@api/endpoints';
import type { Service, AvailableHour, Reservation } from '@types/domain';
import { ServicesList } from '@components/ServicesList';
import { HourList } from '@components/HourList';
import { ReservationForm } from '@components/ReservationForm';

function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<AvailableHour[]>([]);

  useEffect(() => {
    api.getAllServices()
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));

    api.getAllAvailableHours()
      .then(data => setHours(data))
      .catch(err => console.error('Error fetching hours:', err));
  }, []);

  const handleSelectService = (id: number) => {
    setSelectedServiceId(id);
  };

  const handleBackToList = () => {
    setSelectedServiceId(null);
  };

  const handleSubmitReservation = async (p: {id: number; serviceId: number; customerName: string; date: Date }) => {
    try {
      const created: Reservation = await api.createReservation({ ...p, status: 'pending' });
      alert(`Reserva #${created.id} creada para ${created.customerName}`);
      setSelectedServiceId(null);
    } catch {
      alert('No se pudo crear la reserva. Intenta nuevamente.');
    }
  };

  if (selectedServiceId !== null) {
    const svcIndex = services.findIndex(s => s.id === selectedServiceId);

    return (
      <>
        <div style={{ padding: 16 }}>
          <button onClick={handleBackToList}>← Volver a la lista</button>
          <ReservationForm
            services={services}
            selectedServiceId={services[svcIndex]?.id}
            onSubmitReservation={handleSubmitReservation}
          />
        </div>
        <div className="hour-list">
          <HourList hours={hours} />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ padding: 16 }}>
        <h1>Barbería — Hito 1</h1>
        <ServicesList
          services={services}
          onSelectService={handleSelectService}
          selectedId={undefined}
        />
      </div>
    </>
  );
}

export default App;
