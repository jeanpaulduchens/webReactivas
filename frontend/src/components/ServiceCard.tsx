import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onReserve?: (service: Service) => void;
}

export default function ServiceCard({ service, onReserve }: ServiceCardProps) {
  const { name, type, description, durationMin, price } = service;
  return (
    <article className="bg-white rounded-card shadow-card overflow-hidden flex flex-col">
      <img className="h-[140px] w-full object-cover" src={`/static/${type}.jpg`} alt={type} />
      <div className="p-[14px] grid gap-2">
        <div className="font-bold">{name}</div>
        <div className="text-[13px] text-muted min-h-[48px]">{description}</div>
        <div className="flex justify-between text-xs text-muted">
          <span>{durationMin} min</span>
          <span>${price}</span>
        </div>
      </div>
      <div className="px-[14px] pt-3 pb-4">
        <button className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600" onClick={() => onReserve && onReserve(service)}>
          Reservar Ahora
        </button>
      </div>
    </article>
  );
}
