import { useMemo, useState } from "react";

const BARBERS = [
  { _id: "b1", name: "Electrónico" },
  { _id: "b2", name: "Clásico" },
  { _id: "b3", name: "Moderno" },
];
const HOURS = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];

function makeMonth(y, m){
  const first = new Date(y,m,1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay()+6)%7)); 
  return Array.from({length:42},(_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d;});
}

export default function Reservations({ onBack }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = useMemo(()=>makeMonth(year,month),[year,month]);

  const [selectedDate, setSelectedDate] = useState(today);
  const [slot, setSlot] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [barber, setBarber] = useState(BARBERS[0]._id);

  const canConfirm = fullName && email && selectedDate && slot;

  function prev(){ const d=new Date(year,month-1,1); setYear(d.getFullYear()); setMonth(d.getMonth()); }
  function next(){ const d=new Date(year,month+1,1); setYear(d.getFullYear()); setMonth(d.getMonth()); }

  return (
    <div>
      <h2 className="section-title">Reservas /reservas</h2>

      <div className="panel pad" style={{maxWidth:980}}>
        {/* Datos del cliente */}
        <div className="form-grid">
          <div>
            <label className="label">Nombre Completo</label>
            <input className="input" placeholder="Tu Nombre Completo" value={fullName} onChange={e=>setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Número de Teléfono</label>
            <input className="input" placeholder="+34 123 456 789" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Correo Electrónico</label>
            <input className="input" placeholder="tu.email@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </div>

        <h3 style={{fontWeight:800, fontSize:22, margin:"18px 0 8px"}}>Seleccionar Barbero</h3>
        <select className="select" value={barber} onChange={e=>setBarber(e.target.value)}>
          {BARBERS.map(b=> <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>

        <h3 style={{fontWeight:800, fontSize:22, margin:"18px 0 8px"}}>Fecha y Hora</h3>
        <div className="two-col">
          {/* Calendar */}
          <div>
            <div className="calendar">
              <div className="cal-head">
                <button className="cal-nav" onClick={prev}>‹</button>
                <strong>{new Date(year,month).toLocaleString("es", { month:"long", year:"numeric" })}</strong>
                <button className="cal-nav" onClick={next}>›</button>
              </div>
              <div className="cal-grid" style={{marginBottom:6, color:"#9ca3af"}}>
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
            {HOURS.map(h=>(
              <button key={h} className={`slot ${slot===h?"active":""}`} onClick={()=>setSlot(h)}>{h}</button>
            ))}
          </div>
        </div>

        <div style={{display:"flex",gap:12,marginTop:18}}>
          <button className="btn" onClick={onBack}>← Volver</button>
          <button className="btn primary" disabled={!canConfirm}>✓ Confirmar Reserva</button>
        </div>
      </div>
    </div>
  );
}
