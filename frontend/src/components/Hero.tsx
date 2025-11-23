export default function Hero() {
  return (
    <section className="relative rounded-card shadow-card overflow-hidden h-[220px] mb-[18px] grid place-items-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1800&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-slate-900/55 z-0"></div>
      <div className="relative text-white text-center p-[18px] z-10">
        <h1 className="text-[28px] font-extrabold m-0 mb-2">Bienvenido a BarberBook: Tu Estilo, Nuestra Pasión</h1>
        <p className="text-sm opacity-95 max-w-[760px] mx-auto m-0">
          Encuentra tu servicio ideal y reserva tu cita con los mejores barberos de la ciudad.
          Calidad y tradición a tu alcance.
        </p>
      </div>
    </section>
  );
}
