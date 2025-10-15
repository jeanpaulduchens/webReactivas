export default function ServiceCard({ service }) {
  const { name, description, durationMin, priceEUR, imageUrl } = service;

  return (
    <article className="card">
      <img className="card-img" src={imageUrl} alt={name}/>
      <div className="card-body">
        <div className="card-title">{name}</div>
        <div className="card-desc">{description}</div>
        <div className="card-meta">
          <span>{durationMin} min</span>
          <span>€{priceEUR}</span>
        </div>
      </div>
      <div className="card-actions">
        <button className="btn">Reservar Ahora</button>
      </div>
    </article>
  );
}
