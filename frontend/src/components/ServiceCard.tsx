import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onReserve?: (service: Service) => void;
}

export default function ServiceCard({ service, onReserve }: ServiceCardProps) {
  const { name, type, description, durationMin, price } = service;
  return (
    <article className="bg-white rounded-card shadow-card overflow-hidden flex flex-col">
      <img className="h-36 w-full object-cover" src={`/static/${type}.jpg`} alt={type} />
      <div className="p-4 space-y-3">
        <div className="font-bold">{name}</div>
        <div className="text-sm text-muted min-h-12">{description}</div>
        <div className="flex justify-between text-xs text-muted">
          <span>{durationMin} min</span>
          <span>${price}</span>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full rounded-xl h-10 font-bold bg-primary text-white hover:bg-primary-600 transition" onClick={() => onReserve && onReserve(service)}>
          Reservar Ahora
        </button>
      </div>
    </article>
  );
}
