import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username,
        name,
        email,
        password,
        phone,
        role: 'cliente' // Los usuarios del formulario siempre son clientes
      };

      const response = await axios.post(`/api/users`, userData);
      console.log("Registro exitoso:", response.data);
      setSuccess(true);
      
      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar usuario");
      console.error("Error en registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="section-title">BarberBook - Registro</h2>

      <div className="login-wrap">
        <div className="login-card">
          <div className="login-brand">BarberBook</div>
          <div className="login-title">Registrar Nueva Cuenta</div>

          {success && (
            <div className="success-message">
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <label className="label">Usuario</label>
            <input
              className="input"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading || success}
            />

            <label className="label">Nombre Completo</label>
            <input
              className="input"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading || success}
            />

            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
            />

            <label className="label">Teléfono</label>
            <input
              className="input"
              type="tel"
              placeholder="+56 9 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading || success}
            />

            <label className="label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-btn"
                disabled={loading || success}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <label className="label">Confirmar Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="show-password-btn"
                disabled={loading || success}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button 
              className="btn-login" 
              type="submit"
              disabled={loading || success}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="login-footer">
            ¿Ya tienes cuenta?{" "}
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
