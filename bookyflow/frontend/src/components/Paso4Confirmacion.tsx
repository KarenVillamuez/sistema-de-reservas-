// ===== Paso4Confirmacion.tsx — Resumen y confirmación de cita (Fase 2) =====

import { useState } from "react";
import { crearCita } from "../api";
import { formatearPrecio } from "./Paso1Servicios";
import type { Servicio, Profesional } from "../types";

interface Paso4Props {
  servicio: Servicio;
  profesional: Profesional;
  hora: string;
  fecha: string; // Formato ISO: YYYY-MM-DD
  onConfirmado: () => void;
  onVolver: () => void;
}

/** Formatea una fecha ISO a texto largo legible en español */
function formatearFechaLarga(fechaISO: string): string {
  const partes = fechaISO.split("-");
  const fecha = new Date(
    parseInt(partes[0]),
    parseInt(partes[1]) - 1,
    parseInt(partes[2])
  );
  return fecha.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Paso4Confirmacion({
  servicio,
  profesional,
  hora,
  fecha,
  onConfirmado,
  onVolver,
}: Paso4Props) {
  const [nombreCliente, setNombreCliente] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmar() {
    const nombre = nombreCliente.trim();
    if (nombre === "") {
      alert("Por favor escribe tu nombre para confirmar la cita.");
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      await crearCita({
        cliente: nombre,
        servicio: servicio.nombre,
        profesional: profesional.nombre,
        fecha: fecha, // Enviar fecha ISO al backend
        hora: hora,
        precio: servicio.precio,
      });

      setNombreCliente("");
      onConfirmado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="paso4" className="paso-enter">
      <h2 className="mb-3">
        <i className="bi bi-card-checklist"></i> Paso 4 &ndash; Confirma tu
        reserva
      </h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Resumen de tu cita</h5>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">
              <strong>
                <i className="bi bi-scissors"></i> Servicio:
              </strong>{" "}
              <span id="resServicio">{servicio.nombre}</span>
            </li>
            <li className="list-group-item">
              <strong>
                <i className="bi bi-person-badge"></i> Profesional:
              </strong>{" "}
              <span id="resProfesional">{profesional.nombre}</span>
            </li>
            <li className="list-group-item">
              <strong>
                <i className="bi bi-calendar-event"></i> Fecha:
              </strong>{" "}
              <span id="resFecha">{formatearFechaLarga(fecha)}</span>
            </li>
            <li className="list-group-item">
              <strong>
                <i className="bi bi-clock-history"></i> Hora:
              </strong>{" "}
              <span id="resHora">{hora}</span>
            </li>
            <li className="list-group-item">
              <strong>
                <i className="bi bi-cash"></i> Precio:
              </strong>{" "}
              <span id="resPrecio">{formatearPrecio(servicio.precio)}</span>
            </li>
          </ul>

          {/* Formulario sencillo para el nombre del cliente */}
          <div className="mb-3">
            <label htmlFor="inputCliente" className="form-label">
              Tu nombre:
            </label>
            <input
              type="text"
              id="inputCliente"
              className="form-control"
              placeholder="Ej. María López"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger mb-3">
              <i className="bi bi-exclamation-triangle"></i> {error}
            </div>
          )}

          <button
            className="btn btn-success"
            onClick={handleConfirmar}
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                ></span>
                Enviando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i> Confirmar cita
              </>
            )}
          </button>
          <button className="btn btn-secondary ms-2" onClick={onVolver}>
            <i className="bi bi-arrow-left"></i> Volver
          </button>
        </div>
      </div>
    </section>
  );
}

export default Paso4Confirmacion;
