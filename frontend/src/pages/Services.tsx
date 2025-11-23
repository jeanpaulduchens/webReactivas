import { getAllServices } from "@api/services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ServiceGrid from "../components/ServiceGrid";
import type { Service } from "../types";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    getAllServices().then((data) => {
      setServices(data);
    });
  }, []);

  function handleReserve(service: Service) {
    // Navegar a la vista de reservas pasando el servicio seleccionado
    navigate('/reservas', { state: { selectedService: service } });
  }
  
  console.log(services);
  return (
    <>
      <Hero />
      <h2 className="text-lg font-black my-4">Nuestros Servicios</h2>
      <ServiceGrid services={services} onReserve={handleReserve} />
    </>
  );
}
