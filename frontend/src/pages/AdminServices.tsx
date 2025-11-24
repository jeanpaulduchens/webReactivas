import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServicesStore } from "../stores";
import type { Service } from "../types";

// Tipos de servicios disponibles
const SERVICE_TYPES = [
  { value: "hair", label: "Corte de Cabello" },
  { value: "beardeyebrow", label: "Corte de Barba y Cejas" },
  { value: "hairbeard", label: "Corte de Cabello y Barba" },
  { value: "full_service", label: "Servicio Completo" },
] as const;

interface ServiceFormData {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  price: number;
}

export default function AdminServices() {
  const navigate = useNavigate();
  const {
    services,
    loading,
    error,
    successMessage,
    fetchServices,
    createService,
    updateService,
    deleteService,
    clearError,
    clearSuccess,
  } = useServicesStore();

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    type: "hair",
    description: "",
    durationMin: 30,
    price: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "durationMin" || name === "price"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      description: service.description || "",
      durationMin: service.durationMin,
      price: service.price,
    });
    setShowForm(true);
    clearError();
    clearSuccess();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: "",
      type: "hair",
      description: "",
      durationMin: 30,
      price: 0,
    });
    clearError();
    clearSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();

    try {
      if (editingService) {
        // Actualizar servicio existente
        await updateService(editingService.id!, {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          durationMin: formData.durationMin,
          price: formData.price,
        });
      } else {
        // Crear nuevo servicio
        await createService(formData);
      }

      // Limpiar el formulario después de crear/actualizar exitosamente
      handleCancel();
    } catch (err) {
      // El error ya está manejado en el store
      console.error("Error al guardar servicio:", err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${name}"?`)) {
      return;
    }

    try {
      await deleteService(id);
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
    }
  };

  const getTypeLabel = (type: string) => {
    return SERVICE_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "hair":
        return { bg: "#3b82f6", text: "#fff" };
      case "beardeyebrow":
        return { bg: "#8b5cf6", text: "#fff" };
      case "hairbeard":
        return { bg: "#ec4899", text: "#fff" };
      case "full_service":
        return { bg: "#f59e0b", text: "#fff" };
      default:
        return { bg: "#6b7280", text: "#fff" };
    }
  };

  return (
    <div>
      <h2 className="text-lg font-black my-4">Administración de Servicios</h2>

      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Gestión de Servicios</h3>
            <p className="text-sm text-muted">
              Como administrador, puedes crear, editar y eliminar servicios de
              barbería con sus respectivos precios.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-600 transition"
            onClick={() => {
              handleCancel();
              setShowForm(!showForm);
            }}
          >
            {showForm ? "← Cancelar" : "+ Crear Servicio"}
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

        {/* Formulario de creación/edición */}
        {showForm && (
          <div className="p-6 bg-gray-50 rounded-xl mb-6">
            <h4 className="mb-4 text-lg font-semibold">
              {editingService ? "Editar Servicio" : "Crear Nuevo Servicio"}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre del Servicio
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Corte de cabello"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Servicio
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción del servicio (opcional)"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="number"
                    name="durationMin"
                    value={formData.durationMin}
                    onChange={handleInputChange}
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio ($)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-primary text-white hover:bg-primary-600 transition"
                  disabled={loading}
                >
                  {loading
                    ? editingService
                      ? "Actualizando..."
                      : "Creando..."
                    : editingService
                      ? "Actualizar Servicio"
                      : "Crear Servicio"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de servicios */}
        <div>
          <h4 className="mb-4 text-lg font-semibold">
            Servicios Disponibles ({services.length})
          </h4>

          {loading && !services.length && (
            <div className="p-6 text-center text-muted">
              Cargando servicios...
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="p-6 text-center text-muted">
              No hay servicios registrados aún.
            </div>
          )}

          {services.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold">Nombre</th>
                    <th className="text-left p-3 font-semibold">Tipo</th>
                    <th className="text-left p-3 font-semibold">Descripción</th>
                    <th className="text-left p-3 font-semibold">Duración</th>
                    <th className="text-left p-3 font-semibold">Precio</th>
                    <th className="text-left p-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const badgeStyle = getTypeBadgeColor(service.type);
                    return (
                      <tr
                        key={service.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <strong>{service.name}</strong>
                        </td>
                        <td className="p-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                            style={{
                              background: badgeStyle.bg,
                              color: badgeStyle.text,
                            }}
                          >
                            {getTypeLabel(service.type)}
                          </span>
                        </td>
                        <td className="p-3">
                          {service.description || (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="p-3">{service.durationMin} min</td>
                        <td className="p-3">
                          <strong>${service.price.toFixed(2)}</strong>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 text-sm rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                              onClick={() => handleEdit(service)}
                            >
                              Editar
                            </button>
                            <button
                              className="px-3 py-1 text-sm rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                              onClick={() =>
                                handleDelete(service.id!, service.name)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
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

