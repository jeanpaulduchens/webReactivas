import {useEffect, useState} from 'react';

export const ServicesList = ({ title = 'Servicios', services, onSelectService }: ServicesListProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {services.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> — {s.durationMin} min — ${s.price}
            {onSelectService && (
              <button type="button" onClick={() => onSelectService(s)} style={{ marginLeft: 8 }}>
                Elegir
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};