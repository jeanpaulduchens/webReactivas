import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verificar si el usuario está autenticado
  const csrfToken = localStorage.getItem('csrfToken');
  
  if (!csrfToken) {
    // Si no está autenticado, redirigir a login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente
  return <>{children}</>;
}
