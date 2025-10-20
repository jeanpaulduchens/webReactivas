//TODO CONECTAR A BACKEND
import { useState } from "react";

interface Booking {
  dateISO: string;
  time: string;
  clientName: string;
  serviceName: string;
  status: string;
}

const MOCK: Booking[] = [
  { dateISO:"2025-09-23", time:"10:00", clientName:"Juan Pérez", serviceName:"Corte de pelo y barba", status:"confirmada" },
  { dateISO:"2025-09-23", time:"14:00", clientName:"Pedro Sánchez", serviceName:"Afeitado clásico", status:"confirmada" },
];

interface MyBookingsProps {
  onBack: () => void;
}

export default function MyBookings({ onBack }: MyBookingsProps) {
  const [selected, setSelected] = useState("2025-09-23");
  const list = MOCK.filter(b => b.dateISO === selected);

  return (
    <div>
      <h2 className="section-title">Mis Reservas /mis-reservas</h2>

      <div style={{display:"grid", gridTemplateColumns:"220px 1fr", gap:24}}>
        <div className="sidebar-vertical">
          <a className="active" href="#!">Mis Reservas</a>
          <a href="#!">Servicios</a>
          <a href="#!">Clientes</a>
          <a href="#!">Configuración</a>
        </div>

        <div className="panel pad">
          <h3 style={{fontWeight:800, fontSize:26, marginTop:0}}>Mis Reservas Confirmadas</h3>

          <div className="two-col">
            <div className="panel pad">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <button className="cal-nav">‹</button>
                <strong>September 2025</strong>
                <button className="cal-nav">›</button>
              </div>

              <div className="cal-grid" style={{marginTop:12}}>
                {Array.from({length:35},(_,i)=>i+1).map(day=>{
                  const iso = `2025-09-${String(day).padStart(2,"0")}`;
                  const active = selected===iso;
                  return (
                    <button key={iso} className={`cal-cell ${active?"active":""}`} onClick={()=>setSelected(iso)}>{day}</button>
                  );
                })}
              </div>
            </div>

            <div className="panel pad">
              <h4 style={{fontWeight:800, fontSize:20, marginTop:0}}>
                Citas Confirmadas {new Date(selected).toLocaleDateString("es-ES",{day:"numeric",month:"long"})}
              </h4>
              <p className="help" style={{marginTop:0}}>Aquí tienes un resumen de tus citas confirmadas y programadas.</p>

              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{textAlign:"left", color:"#6b7280", fontSize:12}}>
                    <th>Hora</th><th>Cliente</th><th>Servicio</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((b,i)=>(
                    <tr key={i} style={{borderTop:"1px solid #eee"}}>
                      <td>{b.time}</td>
                      <td>{b.clientName}</td>
                      <td>{b.serviceName}</td>
                      <td style={{color:"#16a34a"}}>{b.status}</td>
                    </tr>
                  ))}
                  {!list.length && <tr><td colSpan={4} className="help">No hay citas este día.</td></tr>}
                </tbody>
              </table>

              <div style={{marginTop:16}}>
                <button className="btn" onClick={onBack}>← Volver</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
