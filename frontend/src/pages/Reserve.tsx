import { useMemo, useState, useEffect } from "react";
import { createReservation, getReservationsByDateAndService } from "../api/reservations";
import { getAllServices } from "../api/services";
import type { Service } from "../types";

const HOURS: string[] = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];

function makeMonth(y: number, m: number): Date[] {
  const first = new Date(y,m,1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay()+6)%7)); 
  return Array.from({length:42},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d;});
}

interface ReservationsProps {
  onBack: () => void;
}


export default function Reservations({ onBack }: ReservationsProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = useMemo(() => makeMonth(year, month), [year, month]);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slot, setSlot] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);

  useEffect(() => {
    getAllServices().then(data => {
      setServices(data);
      if (data.length > 0) setServiceId(data[0].id || "");
    });
  }, []);

  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    getReservationsByDateAndService(dateStr, serviceId).then(reservas => {
      setReservedSlots(reservas.map((r: any) => r.time));
    });
  }, [serviceId, selectedDate]);

  const canConfirm = fullName && email && selectedDate && slot && serviceId;

  async function handleConfirm() {
    if (!canConfirm) return;
    const reservation = {
      fullName,
      email,
      phone,
      serviceId,
      date: selectedDate.toISOString().slice(0,10),
      time: slot || "",
      status: "pending"
    };
    try {
      await createReservation(reservation);
      alert("Reserva creada exitosamente");
    } catch (e) {
      alert("Error al crear la reserva");
    }
  }

  function prev(){ const d=new Date(year,month-1,1); setYear(d.getFullYear()); setMonth(d.getMonth()); }
  function next(){ const d=new Date(year,month+1,1); setYear(d.getFullYear()); setMonth(d.getMonth()); }

  return (
    <div>
      <h2 className="section-title">Reservas</h2>

      <div className="panel pad reserve-container">
        {/* Datos del cliente */}
        <div className="form-grid">
          <div>
            <label className="label">Nombre Completo</label>
            <input className="input" placeholder="Tu Nombre Completo" value={fullName} onChange={e=>setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Número de Teléfono</label>
            <input className="input" placeholder="+56 9 1234 5678" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Correo Electrónico</label>
            <input className="input" placeholder="tu.email@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </div>

        <h3 className="form-heading">Seleccionar Servicio</h3>
        <select className="select" value={serviceId} onChange={e=>setServiceId(e.target.value)}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <h3 className="form-heading">Fecha y Hora</h3>
        <div className="two-col">
          {/* Calendar */}
          <div>
            <div className="calendar">
              <div className="cal-head">
                <button className="cal-nav" onClick={prev}>‹</button>
                <strong>{new Date(year,month).toLocaleString("es", { month:"long", year:"numeric" })}</strong>
                <button className="cal-nav" onClick={next}>›</button>
              </div>
              <div className="cal-grid cal-grid-days">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-cell">{d}</div>)}
              </div>
              <div className="cal-grid">
                {days.map(d=>{
                  const isThisMonth = d.getMonth()===month;
                  const active = d.toDateString()===selectedDate.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      className={`cal-cell ${!isThisMonth?"muted":""} ${active?"active":""}`}
                      onClick={()=>setSelectedDate(new Date(d))}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Slots */}
          <div className="slots">
            {HOURS.map(h => (
              <button
                key={h}
                className={`slot ${slot===h?"active":""} ${reservedSlots.includes(h)?"slot:disabled":""}`}
                onClick={()=>setSlot(h)}
                disabled={reservedSlots.includes(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="actions-group">
          <button className="btn" onClick={onBack}>← Volver</button>
          <button className="btn primary" disabled={!canConfirm} onClick={handleConfirm}>✓ Confirmar Reserva</button>
        </div>
      </div>
    </div>
  );
}
