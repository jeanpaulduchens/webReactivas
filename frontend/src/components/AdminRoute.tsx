import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user, restoreSession, isLoading } = useAuthStore();

  // Intentar restaurar la sesión al montar el componente
  useEffect(() => {
    if (!isAuthenticated) {
      restoreSession();
    }
  }, [isAuthenticated, restoreSession]);

  // Mostrar loading mientras se restaura la sesión
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no es admin, redirigir a home
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Si es admin, mostrar el componente
  return <>{children}</>;
}
