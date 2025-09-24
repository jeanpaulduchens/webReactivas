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

      const existingReservations = await api.getAllReservations();
      
      const maxId = existingReservations.length > 0 
        ? Math.max(...existingReservations.map(r => Number(r.id))) 
        : 0;
      const newId = maxId + 1;
      
      const created: Reservation = await api.createReservation({ 
        ...p, 
        id: newId, 
        date: p.date, 
        status: 'pending' 
      });
      
      alert(`Reserva #${created.id} creada para ${created.customerName}`);
      setSelectedServiceId(null);
    } catch (error) {
      console.error('Error creating reservation:', error);
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
        />
      </div>
    </>
  );
}

export default App;
