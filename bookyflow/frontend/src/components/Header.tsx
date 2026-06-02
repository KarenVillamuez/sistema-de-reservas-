// ===== Header.tsx — Barra de navegación de BookyFlow =====

import type { Vista } from "../types";

interface HeaderProps {
  vistaActual: Vista;
  onCambiarVista: (vista: Vista) => void;
}

function Header({ vistaActual, onCambiarVista }: HeaderProps) {
  return (
    <header className="bg-primary text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">
          <i className="bi bi-calendar3"></i> BookyFlow
        </h1>
        <nav>
          <button
            id="btnVistaCliente"
            className={`btn btn-sm me-2 ${
              vistaActual === "cliente" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => onCambiarVista("cliente")}
          >
            <i className="bi bi-person"></i> Cliente
          </button>
          <button
            id="btnVistaDueno"
            className={`btn btn-sm ${
              vistaActual === "dueno" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => onCambiarVista("dueno")}
          >
            <i className="bi bi-briefcase"></i> Panel de dueño
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
