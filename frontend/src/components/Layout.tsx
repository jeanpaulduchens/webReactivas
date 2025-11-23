import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useReservationsStore } from '../stores';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
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
          {isAuthenticated && user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin/usuarios')}
              className={location.pathname === '/admin/usuarios' ? 'font-bold text-red-600' : 'font-normal text-red-600'}
            >
              Administración
            </button>
          )}
          {isAuthenticated ? (
            <>
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
