import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, restoreSession, isLoading } = useAuthStore();

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

  // Si está autenticado, mostrar el componente
  return <>{children}</>;
}
