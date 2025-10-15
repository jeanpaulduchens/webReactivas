export default function Navbar() {
  return (
    <div className="navbar">
      <img
        src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg"
        width="22" height="22" alt="logo"
      />
      <div className="brand">BarberBook</div>
      <span style={{color:"#9ca3af"}}>/</span>
      <div>Servicios</div>
    </div>
  );
}
