import { useState } from "react";
import Services from "./pages/Services";
import Reservations from "./pages/Reserve";
import MyBookings from "./pages/MyReserve";
import Login from "./pages/Login";
import './style.css'

function App() {
  const [view, setView] = useState("services"); // "services" | "reservas" | "mis-reservas" | "login"

  return (
    <div className="container">
      <div className="navbar">
        <button className="brand" onClick={() => setView("services")}>BarberBook</button>
        <span style={{color:"#9ca3af"}}>/</span>
        <nav style={{display:"flex", gap:12}}>
          <button onClick={() => setView("services")}>Servicios</button>
          <button onClick={() => setView("reservas")}>Reservas</button>
          <button onClick={() => setView("mis-reservas")}>Mis reservas</button>
          <button onClick={() => setView("login")}>Login</button>
        </nav>
      </div>

      {view === "services" && <Services onGoReservas={() => setView("reservas")} />}
      {view === "reservas" && <Reservations onBack={() => setView("services")} />}
      {view === "mis-reservas" && <MyBookings onBack={() => setView("services")} />}
      {view === "login" && <Login onBack={() => setView("services")} />}
    </div>
  );
}

export default App;