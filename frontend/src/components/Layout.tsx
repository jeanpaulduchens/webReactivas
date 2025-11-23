import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useReservationsStore } from '../stores';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const { clearClientReservations, clearBarberReservations } = useReservationsStore();

  const handleLogout = async () => {
    // Limpiar las reservas del store
    clearClientReservations();
    clearBarberReservations();
    
    // Hacer logout
    await logout();
    
    // Navegar al home y forzar recarga completa para limpiar todo el estado
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="max-w-[1150px] mx-auto p-6">
      <div className="h-15 flex items-center gap-3">
        <button className="font-black text-primary" onClick={() => navigate('/')}>
          BarberBook
        </button>
        <span className="text-gray-400">/</span>
        <nav className="flex gap-3">
          <button 
            onClick={() => navigate('/')}
            className={location.pathname === '/' ? 'font-bold' : 'font-normal'}
          >
            Servicios
          </button>

          <button 
            onClick={() => navigate('/reservas')}
            className={location.pathname === '/reservas' ? 'font-bold' : 'font-normal'}
          >
            Reservas
          </button>
          <button 
            onClick={() => navigate('/mis-reservas')}
            className={location.pathname === '/mis-reservas' ? 'font-bold' : 'font-normal'}
          >
            Mis reservas
          </button>
          {isAuthenticated ? (
            <>
              <span className="text-muted ml-4">
                Hola, {user?.name}
              </span>
              <button onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className={location.pathname === '/login' ? 'font-bold' : 'font-normal'}
            >
              Iniciar Sesión
            </button>
          )}
        </nav>
      </div>
      
      <Outlet />
    </div>
  );
}
