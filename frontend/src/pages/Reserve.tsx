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
      status: "confirmed" // Cambiar a "confirmed" para que aparezca en la vista del barbero
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
      <h2 className="text-lg font-extrabold my-[18px] mx-0">Reservas</h2>

      <div className="bg-white rounded-card shadow-card p-[18px] max-w-[980px]">
        {/* Información del cliente autenticado */}
        {user && (
          <div className="mb-6 p-3.5 bg-gray-50 rounded-[10px]">
            <div className="font-semibold mb-1.5">Reservando como:</div>
            <div className="text-muted text-sm">
              {user.name} • {user.email} {user.phone && `• ${user.phone}`}
            </div>
          </div>
        )}

        <h3 className="font-extrabold text-[22px] my-[18px] mx-0 mt-0">Seleccionar Servicio</h3>
        <select className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff]" value={serviceId} onChange={e=>setServiceId(e.target.value)}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <h3 className="font-extrabold text-[22px] my-[18px] mx-0">Fecha y Hora</h3>
        <div className="grid grid-cols-[380px_1fr] gap-6">
          {/* Calendar */}
          <div>
            <div className="inline-block border border-gray-200 rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-2">
                <button className="border border-gray-200 bg-white w-9 h-9 rounded-lg cursor-pointer text-lg hover:bg-gray-50 hover:border-indigo-300 transition-all" onClick={prev}>‹</button>
                <strong>{new Date(year,month).toLocaleString("es", { month:"long", year:"numeric" })}</strong>
                <button className="border border-gray-200 bg-white w-9 h-9 rounded-lg cursor-pointer text-lg hover:bg-gray-50 hover:border-indigo-300 transition-all" onClick={next}>›</button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-1.5 text-gray-400">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="w-full aspect-square grid place-items-center text-sm">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {days.map(d=>{
                  const isThisMonth = d.getMonth()===month;
                  const active = d.toDateString()===selectedDate.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      className={`w-full aspect-square grid place-items-center rounded-lg border border-transparent bg-white cursor-pointer text-sm transition-all ${
                        !isThisMonth ? "text-gray-400" : "text-gray-700"
                      } ${
                        active ? "bg-primary text-white font-bold" : "hover:border-indigo-300 hover:bg-blue-50"
                      }`}
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
          <div className="grid grid-cols-4 gap-3">
            {HOURS.map(h => (
              <button
                key={h}
                className={`border h-10 rounded-[10px] grid place-items-center cursor-pointer bg-white transition-all ${
                  slot===h ? "border-primary shadow-[0_0_0_3px_#e0e7ff]" : "border-gray-200 hover:border-indigo-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={()=>setSlot(h)}
                disabled={reservedSlots.includes(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-[18px]">
          <button className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600" onClick={() => navigate(-1)}>← Volver</button>
          <button className="w-full border-0 rounded-[10px] h-11 font-bold bg-primary text-white cursor-pointer hover:bg-primary-600 px-[18px] disabled:opacity-55" disabled={!canConfirm} onClick={handleConfirm}>✓ Confirmar Reserva</button>
        </div>
      </div>
    </div>
  );
}
