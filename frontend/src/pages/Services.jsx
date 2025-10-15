import Hero from "../components/Hero";
import ServiceGrid from "../components/ServiceGrid";

const MOCK_SERVICES = [
  {
    name: "Corte de Cabello Clásico",
    description: "Un corte de estilo tradicional y elegante, adaptado a tu estilo personal.",
    durationMin: 45,
    priceEUR: 25,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Afeitado a Navaja",
    description: "Afeitado clásico con toallas calientes y productos de lujo.",
    durationMin: 30,
    priceEUR: 20,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-9ee4a0a6e6c5?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Diseño de Barba",
    description: "Moldeado y perfilado profesional de barba.",
    durationMin: 30,
    priceEUR: 18,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-e0b7b1d1a1db?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Tratamiento Facial",
    description: "Limpieza profunda, exfoliación y mascarilla hidratante.",
    durationMin: 60,
    priceEUR: 35,
    imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Corte + Barba",
    description: "Combo completo de corte y barba.",
    durationMin: 75,
    priceEUR: 40,
    imageUrl: "https://images.unsplash.com/photo-1549278490-2f6157bd45f2?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Coloración de Cabello",
    description: "Coloración parcial o total. Consulta previa.",
    durationMin: 90,
    priceEUR: 50,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
  }
];

export default function Services({ onGoReservas }) {
  function handleReserve(_svc) {
    // por ahora solo navegamos a la vista de reservas
    if (onGoReservas) onGoReservas();
  }

  return (
    <>
      <Hero />
      <h2 className="section-title">Nuestros Servicios</h2>
      <ServiceGrid services={MOCK_SERVICES} onReserve={handleReserve} />
    </>
  );
}
