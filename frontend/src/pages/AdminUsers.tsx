import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useUsersStore } from "../stores";
import type { CreateUserData } from "../api/users";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    users, 
    loading, 
    error, 
    successMessage,
    fetchUsers, 
    createUser, 
    clearError, 
    clearSuccess 
  } = useUsersStore();

  const [formData, setFormData] = useState<CreateUserData>({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "cliente",
  });

  const [showForm, setShowForm] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();

    try {
      await createUser(formData);
      // Limpiar el formulario después de crear exitosamente
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "cliente",
      });
      setShowForm(false);
    } catch (err) {
      // El error ya está manejado en el store
      console.error("Error al crear usuario:", err);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return { bg: "#dc2626", text: "#fff" };
      case "barbero":
        return { bg: "#2563eb", text: "#fff" };
      case "cliente":
        return { bg: "#059669", text: "#fff" };
      default:
        return { bg: "#6b7280", text: "#fff" };
    }
  };

  return (
    <div>
      <h2 className="section-title">Administración de Usuarios</h2>

      <div className="panel pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 className="page-title">Gestión de Usuarios</h3>
            <p className="description-text">
              Como administrador, puedes crear y gestionar usuarios del sistema.
            </p>
          </div>
          <button 
            className="btn primary" 
            onClick={() => {
              setShowForm(!showForm);
              clearError();
              clearSuccess();
            }}
          >
            {showForm ? "← Cancelar" : "+ Crear Usuario"}
          </button>
        </div>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <div style={{ 
            padding: "12px", 
            background: "#d1fae5", 
            color: "#065f46", 
            borderRadius: "8px", 
            marginBottom: "16px" 
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{ 
            padding: "12px", 
            background: "#fee2e2", 
            color: "#991b1b", 
            borderRadius: "8px", 
            marginBottom: "16px" 
          }}>
            {error}
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div style={{ 
            padding: "24px", 
            background: "#f9fafb", 
            borderRadius: "12px", 
            marginBottom: "24px" 
          }}>
            <h4 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: 600 }}>
              Crear Nuevo Usuario
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label className="label">Usuario</label>
                  <input
                    className="input"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="nombre_usuario"
                    required
                  />
                </div>
                <div>
                  <label className="label">Nombre Completo</label>
                  <input
                    className="input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre Completo"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="label">Teléfono (Opcional)</label>
                  <input
                    className="input"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <label className="label">Contraseña</label>
                  <input
                    className="input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 3 caracteres"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <label className="label">Rol</label>
                  <select
                    className="select"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cliente">Cliente</option>
                    <option value="barbero">Barbero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Creando..." : "Crear Usuario"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowForm(false);
                    clearError();
                    clearSuccess();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de usuarios */}
        <div>
          <h4 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: 600 }}>
            Usuarios del Sistema ({users.length})
          </h4>

          {loading && !users.length && (
            <div className="loading-message">Cargando usuarios...</div>
          )}

          {!loading && users.length === 0 && (
            <div style={{ 
              padding: "24px", 
              textAlign: "center", 
              color: "#6b7280" 
            }}>
              No hay usuarios registrados aún.
            </div>
          )}

          {users.length > 0 && (
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const badgeStyle = getRoleBadgeColor(u.role || "cliente");
                  return (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.username}</strong>
                        {u.id === user?.id && (
                          <span style={{ 
                            marginLeft: "8px", 
                            fontSize: "12px", 
                            color: "#6b7280" 
                          }}>
                            (Tú)
                          </span>
                        )}
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || "-"}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: badgeStyle.bg,
                            color: badgeStyle.text,
                          }}
                        >
                          {u.role?.toUpperCase() || "CLIENTE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="actions-row" style={{ marginTop: "24px" }}>
          <button className="btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}

