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
        role: "cliente", // Los usuarios del formulario siempre son clientes
      };

      const response = await axios.post(`/api/users`, userData);
      console.log("Registro exitoso:", response.data);
      setSuccess(true);

      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        navigate("/login");
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
      <h2 className="text-lg font-extrabold my-[18px] mx-0">
        BarberBook - Registro
      </h2>

      <div
        className="min-h-[70vh] grid place-items-center relative rounded-card overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1800&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/55 z-[1]"></div>
        <div className="relative w-[420px] bg-white rounded-2xl shadow-lg p-6 z-[2]">
          <div className="text-center font-extrabold text-[22px] text-primary">
            BarberBook
          </div>
          <div className="font-extrabold text-2xl my-2 text-center">
            Registrar Nueva Cuenta
          </div>

          {success && (
            <div className="text-green-600 bg-green-50 px-3 py-2.5 rounded-lg mb-3.5 text-sm border border-green-300">
              ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}

          {error && (
            <div className="text-red-600 bg-red-50 px-3 py-2.5 rounded-lg mb-3.5 text-sm border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Usuario
              </label>
              <input
                className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
                placeholder="tu_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Nombre Completo
              </label>
              <input
                className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Email
              </label>
              <input
                className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Teléfono
              </label>
              <input
                className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
                type="tel"
                placeholder="+56 9 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-lg p-0 w-[30px] h-[30px] grid place-items-center disabled:opacity-60"
                  disabled={loading || success}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted mb-1.5 block">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 border border-gray-200 rounded-[10px] px-3 bg-white outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_#e0e7ff] disabled:opacity-60"
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-lg p-0 w-[30px] h-[30px] grid place-items-center disabled:opacity-60"
                  disabled={loading || success}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              className="w-full border-0 rounded-[10px] h-[44px] font-bold bg-primary text-white cursor-pointer hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed mt-3.5"
              type="submit"
              disabled={loading || success}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="text-center mt-[18px] text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="text-primary font-semibold no-underline hover:underline"
            >
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
