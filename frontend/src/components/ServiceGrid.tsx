import ServiceCard from "./ServiceCard";
import type { Service } from '../types';

interface ServiceGridProps {
  services: Service[];
  onReserve?: (service: Service) => void;
}

export default function ServiceGrid({ services, onReserve }: ServiceGridProps) {
  return (
    <div className="grid">
      {services.map(s => (
        <ServiceCard key={s.id || s.name} service={s} onReserve={onReserve} />
      ))}
    </div>
  );
}
