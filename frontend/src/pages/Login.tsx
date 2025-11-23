import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../stores';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Usar el store de autenticación
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Limpiar error cuando el componente se monta
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    try {
      await login({ username, password });
      setSuccess(true);
      // Redirigir a la página principal después del login exitoso
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      // El error ya está manejado en el store
      console.error("Error en login:", err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-extrabold my-[18px] mx-0">BarberBook - Barber Login</h2>

      <div className="min-h-[70vh] grid place-items-center relative rounded-card overflow-hidden" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1800&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-slate-900/55 z-[1]"></div>
        <div className="relative w-[420px] bg-white rounded-2xl shadow-lg p-6 z-[2]">
          <div className="text-center font-extrabold text-[22px] text-primary">BarberBook</div>
          <div className="font-extrabold text-2xl my-2 text-center">Iniciar Sesión</div>

          <form onSubmit={handleLogin}>
            <label className="text-xs font-bold text-muted mb-1.5 block">Usuario</label>
            <input 
              className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff]" 
              placeholder="tu_usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="text-xs font-bold text-muted mb-1.5 block mt-3">Contraseña</label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input 
                className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff]" 
                type={showPassword ? "text" : "password"} 
                placeholder="tu_contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="w-full border-0 rounded-[10px] h-[42px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <label className="flex gap-2 items-center mt-2.5">
              <input type="checkbox" /> Recordarme
            </label>

            {error && (
              <div className="text-red-600 bg-red-50 px-3 py-2 rounded-md mt-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 bg-green-50 px-3 py-2 rounded-md mt-3 text-sm">
                ¡Login exitoso!
              </div>
            )}

            <button 
              type="submit"
              className="w-full border-0 rounded-[10px] h-[44px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600 disabled:opacity-55 mt-3" 
              disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-muted text-xs text-center mt-3">
            ¿Olvidaste tu contraseña? <a href="#!">Restablecer aquí</a><br/>
            ¿No tienes una cuenta?{" "}
            <a 
              href="/register" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Regístrate
            </a>
          </p>

          <button className="btn login-back" onClick={() => navigate(-1)}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
