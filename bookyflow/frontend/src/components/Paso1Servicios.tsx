// ===== Paso1Servicios.tsx — Selección de servicio =====

import { useState, useEffect } from "react";
import { getServicios } from "../api";
import type { Servicio } from "../types";

/** Formatea un número a pesos colombianos con separador de miles */
function formatearPrecio(valor: number): string {
  const str = valor.toString();
  let resultado = "";
  let contador = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    resultado = str[i] + resultado;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      resultado = "." + resultado;
    }
  }

  return "$" + resultado;
}

interface Paso1Props {
  onSeleccionar: (indice: number, servicios: Servicio[]) => void;
}

function Paso1Servicios({ onSeleccionar }: Paso1Props) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServicios()
      .then((data) => {
        setServicios(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando servicios...</p>
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
    <section id="paso1" className="paso-enter">
      <h2 className="mb-3">
        <i className="bi bi-list-check"></i> Paso 1 &ndash; Elige un servicio
      </h2>
      <div className="row g-3">
        {servicios.map((s, i) => (
          <div key={i} className="col-md-4 col-sm-6">
            <div
              className="card card-seleccionable h-100"
              onClick={() => onSeleccionar(i, servicios)}
            >
              <div className="card-body text-center">
                <h5 className="card-title">{s.nombre}</h5>
                <p className="card-text">
                  <i className="bi bi-clock"></i> {s.duracion}
                  <br />
                  <i className="bi bi-cash"></i> {formatearPrecio(s.precio)}
                </p>
                <span className="btn btn-outline-primary btn-sm">
                  Seleccionar
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Paso1Servicios;
export { formatearPrecio };
