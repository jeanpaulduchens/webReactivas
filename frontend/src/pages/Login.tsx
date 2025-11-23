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
      <h2 className="section-title">BarberBook - Barber Login</h2>

      <div className="login-wrap">
        <div className="login-card">
          <div className="login-brand">BarberBook</div>
          <div className="login-title">Iniciar Sesión</div>

          <form onSubmit={handleLogin}>
            <label className="label">Usuario</label>
            <input 
              className="input" 
              placeholder="tu_usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="label label-spacing">Contraseña</label>
            <div className="login-password-grid">
              <input 
                className="input" 
                type={showPassword ? "text" : "password"} 
                placeholder="tu_contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="btn" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <label className="login-remember">
              <input type="checkbox" /> Recordarme
            </label>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {success && (
              <div className="login-success">
                ¡Login exitoso!
              </div>
            )}

            <button 
              type="submit"
              className="btn primary block login-submit" 
              disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="help login-help">
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
