import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onReserve?: (service: Service) => void;
}

export default function ServiceCard({ service, onReserve }: ServiceCardProps) {
  const { name, type, description, durationMin, price } = service;
  return (
    <article className="card">
      <img className="card-img" src={`/static/${type}.jpg`} alt={type} />
      <div className="card-body">
        <div className="card-title">{name}</div>
        <div className="card-desc">{description}</div>
        <div className="card-meta">
          <span>{durationMin} min</span>
          <span>${price}</span>
        </div>
      </div>
      <div className="card-actions">
        <button className="btn" onClick={() => onReserve && onReserve(service)}>
          Reservar Ahora
        </button>
      </div>
    </article>
  );
}
