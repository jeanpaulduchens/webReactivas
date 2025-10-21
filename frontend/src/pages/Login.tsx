import { useState } from "react";
import { login } from '@api/login'; //, restoreLogin, logout } from "@api/login";

interface LoginProps {
  onBack: () => void;
}

export default function Login({ onBack }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login({ username, password });
      setSuccess(true);
      console.log("Login exitoso:", userData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">BarberConnect - Barber Login</h2>

      <div className="login-wrap">
        <div className="login-card">
          <div className="login-brand">BarberConnect</div>
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
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="help login-help">
            ¿Olvidaste tu contraseña? <a href="#!">Restablecer aquí</a><br/>
            ¿No tienes una cuenta? <a href="#!">Regístrate</a>
          </p>

          <button className="btn login-back" onClick={onBack}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
