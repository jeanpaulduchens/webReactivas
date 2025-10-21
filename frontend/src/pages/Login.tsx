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
          <div style={{textAlign:"center", fontWeight:800, fontSize:22, color:"#1e3a8a"}}>BarberConnect</div>
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

            <label className="label" style={{marginTop:12}}>Contraseña</label>
            <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8}}>
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

            <label style={{display:"flex", gap:8, alignItems:"center", margin:"10px 0 0"}}>
              <input type="checkbox" /> Recordarme
            </label>

            {error && (
              <div style={{
                color: "#dc2626",
                backgroundColor: "#fee2e2",
                padding: "8px 12px",
                borderRadius: "6px",
                marginTop: "12px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                color: "#16a34a",
                backgroundColor: "#dcfce7",
                padding: "8px 12px",
                borderRadius: "6px",
                marginTop: "12px",
                fontSize: "14px"
              }}>
                ¡Login exitoso!
              </div>
            )}

            <button 
              type="submit"
              className="btn primary block" 
              style={{marginTop:12}}
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="help" style={{textAlign:"center", marginTop:12}}>
            ¿Olvidaste tu contraseña? <a href="#!">Restablecer aquí</a><br/>
            ¿No tienes una cuenta? <a href="#!">Regístrate</a>
          </p>

          <button className="btn" onClick={onBack} style={{marginTop:8}}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
