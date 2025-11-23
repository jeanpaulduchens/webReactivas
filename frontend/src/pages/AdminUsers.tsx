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
    clearSuccess,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      <h2 className="text-lg font-black my-4">Administración de Usuarios</h2>

      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Gestión de Usuarios</h3>
            <p className="text-sm text-muted">
              Como administrador, puedes crear y gestionar usuarios del sistema.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-600 transition"
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
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div className="p-6 bg-gray-50 rounded-xl mb-6">
            <h4 className="mb-4 text-lg font-semibold">Crear Nuevo Usuario</h4>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Usuario
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="nombre_usuario"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre Completo
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre Completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Teléfono (Opcional)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <label className="block text-sm font-medium mb-2">Rol</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
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
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-600 transition"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Usuario"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
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
          <h4 className="mb-4 text-lg font-semibold">
            Usuarios del Sistema ({users.length})
          </h4>

          {loading && !users.length && (
            <div className="p-6 text-center text-muted">
              Cargando usuarios...
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="p-6 text-center text-muted">
              No hay usuarios registrados aún.
            </div>
          )}

          {users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold">Usuario</th>
                    <th className="text-left p-3 font-semibold">Nombre</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Teléfono</th>
                    <th className="text-left p-3 font-semibold">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const badgeStyle = getRoleBadgeColor(u.role || "cliente");
                    return (
                      <tr
                        key={u.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <strong>{u.username}</strong>
                          {u.id === user?.id && (
                            <span className="ml-2 text-xs text-muted">
                              (Tú)
                            </span>
                          )}
                        </td>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.phone || "-"}</td>
                        <td className="p-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                            style={{
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
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            className="px-4 py-2 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
