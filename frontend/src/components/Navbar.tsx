import { useNavigate } from "react-router-dom";
import { useAuthStore, useReservationsStore } from "../stores";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { clearClientReservations, clearBarberReservations } =
    useReservationsStore();

  const handleLogout = async () => {
    // Limpiar las reservas del store
    clearClientReservations();
    clearBarberReservations();

    // Hacer logout
    await logout();

    // Navegar al home y forzar recarga completa para limpiar todo el estado
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <img
        src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg"
        width="22"
        height="22"
        alt="logo"
      />
      <div className="brand">BarberBook</div>
      <span style={{ color: "#9ca3af" }}>/</span>
      <div>Servicios</div>

      {isAuthenticated && user && (
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {user.role === "admin" && (
            <button
              className="btn"
              onClick={() => navigate("/admin/usuarios")}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                background: "#dc2626",
                color: "#fff",
              }}
            >
              Administración
            </button>
          )}
          <span style={{ color: "#9ca3af" }}>Hola, {user.name}</span>
          <button
            className="btn"
            onClick={handleLogout}
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
