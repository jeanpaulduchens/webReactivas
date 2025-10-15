import ServiceCard from "./ServiceCard";

export default function ServiceGrid({ services , onReserve}) {
  return (
    <div className="grid">
      {services.map(s => (
        <ServiceCard key={s.name} service={s} onReserve={onReserve} />
      ))}
    </div>
  );
}
