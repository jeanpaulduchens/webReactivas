import { useEffect, useState } from 'react';
import api from '@api/endpoints';
import type { Service, Reservation } from '@types/domain';
import { ServicesList } from '@components/ServicesList';
import { ReservationForm } from '@components/ReservationForm';

function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.getAllServices()
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  const handleSelectService = (id: number) => {
    setSelectedServiceId(id);
  };

  const handleBackToList = () => {
    setSelectedServiceId(null);
  };

  const handleSubmitReservation = async (p: {id: number; serviceId: number; customerName: string; date: Date }) => {
    try {
      // Convertir la fecha local a UTC antes de enviar al servidor
      const utcDate = new Date(p.date.getTime() + p.date.getTimezoneOffset() * 60000);
      const created: Reservation = await api.createReservation({ ...p, date: utcDate, status: 'pending' });
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
