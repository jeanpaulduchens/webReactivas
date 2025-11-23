import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createReservation, getReservationsByDateAndService } from "../api/reservations";
import { getAllServices } from "../api/services";
import { restoreLogin } from "../api/login";
import type { Service, User } from "../types";

const HOURS: string[] = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];

function makeMonth(y: number, m: number): Date[] {
  const first = new Date(y,m,1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay()+6)%7)); 
  return Array.from({length:42},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d;});
}

export default function Reservations() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = useMemo(() => makeMonth(year, month), [year, month]);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slot, setSlot] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);

  useEffect(() => {
    // Obtener usuario autenticado
    restoreLogin().then(userData => {
      setUser(userData);
    });
    
    // Obtener servicios
    getAllServices().then(data => {
      setServices(data);
      
      // Verificar si hay un servicio seleccionado desde la navegación
      const selectedService = location.state?.selectedService as Service | undefined;
      
      if (selectedService && selectedService.id) {
        // Si hay un servicio seleccionado, usarlo
        setServiceId(selectedService.id);
      } else if (data.length > 0) {
        // Si no, usar el primero por defecto
        setServiceId(data[0].id || "");
      }
    });
  }, [location.state]);

  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    getReservationsByDateAndService(dateStr, serviceId).then(reservas => {
      setReservedSlots(reservas.map((r: any) => r.time));
    });
  }, [serviceId, selectedDate]);

  const canConfirm = user && selectedDate && slot && serviceId;

  async function handleConfirm() {
    if (!canConfirm) return;
    const reservation = {
      serviceId,
      date: selectedDate.toISOString().slice(0,10),
      time: slot || "",
      status: "pending"
    };
    try {
      await createReservation(reservation);
      alert("Reserva creada exitosamente");
      navigate('/mis-reservas');
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
        {/* Información del cliente autenticado */}
        {user && (
          <div style={{ marginBottom: '24px', padding: '14px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>Reservando como:</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              {user.name} • {user.email} {user.phone && `• ${user.phone}`}
            </div>
          </div>
        )}

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
          <button className="btn" onClick={() => navigate(-1)}>← Volver</button>
          <button className="btn primary" disabled={!canConfirm} onClick={handleConfirm}>✓ Confirmar Reserva</button>
        </div>
      </div>
    </div>
  );
}
