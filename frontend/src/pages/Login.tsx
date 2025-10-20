//TODO CONECTAR A BACKEND
export default function Login({ onBack }) {
  return (
    <div>
      <h2 className="section-title">BarberConnect - Barber Login, /login</h2>

      <div className="login-wrap">
        <div className="login-card">
          <div style={{textAlign:"center", fontWeight:800, fontSize:22, color:"#1e3a8a"}}>BarberConnect</div>
          <div className="login-title">Iniciar Sesión</div>

          <label className="label">Gmail</label>
          <input className="input" placeholder="tu_gmail" />

          <label className="label" style={{marginTop:12}}>Contraseña</label>
          <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8}}>
            <input className="input" type="password" placeholder="tu_contraseña" />
            <button className="btn">👁</button>
          </div>

          <label style={{display:"flex", gap:8, alignItems:"center", margin:"10px 0 0"}}>
            <input type="checkbox" /> Recordarme
          </label>

          <button className="btn primary block" style={{marginTop:12}}>Iniciar Sesión</button>

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
