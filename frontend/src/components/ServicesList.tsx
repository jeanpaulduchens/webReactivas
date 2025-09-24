import type { Service } from "@types/domain"

interface ServicesListProps {
  title?: string;
  services: Service[];
  onSelectService?: (id: number) => void;
}

export const ServicesList = ({ title = 'Servicios', services, onSelectService }: ServicesListProps) => {
  
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> — {s.durationMin} min — ${s.price}
            (
              <button type="button" onClick={() => onSelectService?.(s.id)} style={{ marginLeft: 8 }}>
                Elegir
              </button>
            )
          </li>
        ))}
      </ul>
    </div>
  );
};