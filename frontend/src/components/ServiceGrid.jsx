import ServiceCard from "./ServiceCard";

export default function ServiceGrid({ services }) {
  return (
    <div className="grid">
      {services.map(s => (
        <ServiceCard key={s.name} service={s} />
      ))}
    </div>
  );
}
