import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Services from './pages/Services';
import Reservations from './pages/Reserve';
import MyBookings from './pages/MyReserve';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './style.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas públicas */}
        <Route index element={<Services />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
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
        
        {/* Rutas de administración */}
        <Route 
          path="admin/usuarios" 
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } 
        />
        
        {/* Ruta por defecto - redirige a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;