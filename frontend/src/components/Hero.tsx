export default function Hero() {
  return (
    <section
      className="relative rounded-card shadow-card overflow-hidden h-56 mb-4 grid place-items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1800&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/55"></div>
      <div className="relative text-white text-center p-4 z-10">
        <h1 className="text-3xl font-black mb-2">
          Bienvenido a BarberBook: Tu Estilo, Nuestra Pasión
        </h1>
        <p className="text-sm opacity-95 max-w-3xl mx-auto">
          Encuentra tu servicio ideal y reserva tu cita con los mejores barberos
          de la ciudad. Calidad y tradición a tu alcance.
        </p>
      </div>
    </section>
  );
}
