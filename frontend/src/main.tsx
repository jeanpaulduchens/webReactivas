import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { useAuthStore } from "./stores";
import "./style.css";

// Componente wrapper para inicializar la sesión
function AppWithAuth() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    // Restaurar sesión al cargar la aplicación
    restoreSession();
  }, [restoreSession]);

  return <App />;
}

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  </StrictMode>,
);
