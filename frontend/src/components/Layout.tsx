import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '@api/login';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('csrfToken');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="navbar">
        <button className="brand" onClick={() => navigate('/')}>
          BarberBook
        </button>
        <span style={{ color: "#9ca3af" }}>/</span>
        <nav style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              fontWeight: location.pathname === '/' ? 'bold' : 'normal' 
            }}
          >
            Servicios
          </button>
          <button 
            onClick={() => navigate('/reservas')}
            style={{ 
              fontWeight: location.pathname === '/reservas' ? 'bold' : 'normal' 
            }}
          >
            Reservas
          </button>
          <button 
            onClick={() => navigate('/mis-reservas')}
            style={{ 
              fontWeight: location.pathname === '/mis-reservas' ? 'bold' : 'normal' 
            }}
          >
            Mis reservas
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                fontWeight: location.pathname === '/login' ? 'bold' : 'normal' 
              }}
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
