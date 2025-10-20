import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onReserve?: (service: Service) => void;
}

export default function ServiceCard({ service, onReserve }: ServiceCardProps) {
  const { name, description, durationMin, priceEUR, imageUrl } = service;
  return (
    <article className="card">
      <img className="card-img" src={imageUrl} alt={name} />
      <div className="card-body">
        <div className="card-title">{name}</div>
        <div className="card-desc">{description}</div>
        <div className="card-meta">
          <span>{durationMin} min</span>
          <span>€{priceEUR}</span>
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
