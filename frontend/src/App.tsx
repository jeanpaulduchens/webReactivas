import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Services from './pages/Services';
import Reservations from './pages/Reserve';
import MyBookings from './pages/MyReserve';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './style.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas públicas */}
        <Route index element={<Services />} />
        <Route path="login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="reservas" 
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="mis-reservas" 
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta por defecto - redirige a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;