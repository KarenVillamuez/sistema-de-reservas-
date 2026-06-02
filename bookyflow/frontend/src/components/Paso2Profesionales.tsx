// ===== Paso2Profesionales.tsx — Selección de profesional =====

import { useState, useEffect } from "react";
import { getProfesionales } from "../api";
import type { Profesional } from "../types";

interface Paso2Props {
  onSeleccionar: (indice: number, profesionales: Profesional[]) => void;
  onVolver: () => void;
}

function Paso2Profesionales({ onSeleccionar, onVolver }: Paso2Props) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfesionales()
      .then((data) => {
        setProfesionales(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /** Genera el SVG placeholder con la inicial del nombre */
  function generarPlaceholder(nombre: string): string {
    const inicial = nombre.charAt(0);
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%236c757d" width="100" height="100"/><text fill="white" font-size="40" x="50" y="60" text-anchor="middle">${inicial}</text></svg>`;
  }

  /** Maneja error de carga de imagen: muestra SVG placeholder */
  function handleImageError(
    e: React.SyntheticEvent<HTMLImageElement>,
    nombre: string
  ) {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = generarPlaceholder(nombre);
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando profesionales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle"></i> {error}
      </div>
    );
  }

  return (
    <section id="paso2" className="paso-enter">
      <h2 className="mb-3">
        <i className="bi bi-people"></i> Paso 2 &ndash; Elige un profesional
      </h2>
      <div className="row g-3">
        {profesionales.map((p, i) => (
          <div key={i} className="col-md-3 col-sm-6">
            <div
              className="card card-seleccionable h-100"
              onClick={() => onSeleccionar(i, profesionales)}
            >
              <div className="card-body text-center">
                <img
                  src={p.imagen}
                  alt={`Foto de ${p.nombre}`}
                  className="img-profesional mb-2"
                  onError={(e) => handleImageError(e, p.nombre)}
                />
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text text-muted">{p.especialidad}</p>
                <span className="btn btn-outline-primary btn-sm">Elegir</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>
    </section>
  );
}

export default Paso2Profesionales;
