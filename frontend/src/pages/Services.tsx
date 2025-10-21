import { getAllServices } from "@api/services";
import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ServiceGrid from "../components/ServiceGrid";
import type { Service } from "../types";

interface ServicesProps {
  onGoReservas?: () => void;
}

export default function Services({ onGoReservas }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    getAllServices().then((data) => {
      setServices(data);
    });
  }, []);

  function handleReserve(_svc: Service) {
    // por ahora solo navegamos a la vista de reservas
    if (onGoReservas) onGoReservas();
  }
  console.log(services);
  return (
    <>
      <Hero />
      <h2 className="section-title">Nuestros Servicios</h2>
      <ServiceGrid services={services} onReserve={handleReserve} />
    </>
  );
}
