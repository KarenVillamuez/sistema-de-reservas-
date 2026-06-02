// ===== Paso3Horarios.tsx — Selección de fecha y horario (Fase 2) =====

import { useState, useEffect, useCallback } from "react";
import { getHorarios, getTurnosOcupados } from "../api";
import type { TurnoOcupado } from "../types";

/** Devuelve la fecha de hoy en formato ISO YYYY-MM-DD */
function obtenerFechaHoyISO(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

interface Paso3Props {
  profesionalIndex: number;
  onSeleccionar: (indice: number, horarios: string[], fecha: string) => void;
  onVolver: () => void;
}

function Paso3Horarios({
  profesionalIndex,
  onSeleccionar,
  onVolver,
}: Paso3Props) {
  const [horarios, setHorarios] = useState<string[]>([]);
  const [turnosOcupados, setTurnosOcupados] = useState<TurnoOcupado[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaHoyISO());
  const [loading, setLoading] = useState(true);
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Carga los turnos ocupados para el profesional y fecha actual */
  const cargarTurnos = useCallback(
    async (fecha: string) => {
      setCargandoTurnos(true);
      setError(null);
      try {
        const turnosData = await getTurnosOcupados(profesionalIndex, fecha);
        setTurnosOcupados(turnosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar turnos");
      } finally {
        setCargandoTurnos(false);
      }
    },
    [profesionalIndex]
  );

  // Carga inicial: horarios fijos + turnos de la fecha seleccionada
  useEffect(() => {
    setLoading(true);
    getHorarios()
      .then((horariosData) => {
        setHorarios(horariosData);
        return cargarTurnos(fechaSeleccionada);
      })
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Maneja el cambio de fecha en el selector */
  function handleCambiarFecha(e: React.ChangeEvent<HTMLInputElement>) {
    const nuevaFecha = e.target.value;
    setFechaSeleccionada(nuevaFecha);
    cargarTurnos(nuevaFecha);
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando horarios...</p>
      </div>
    );
  }

  if (error && horarios.length === 0) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle"></i> {error}
      </div>
    );
  }

  /** Verifica si un horario está ocupado para el profesional y fecha seleccionada */
  function estaOcupado(hora: string): boolean {
    return turnosOcupados.some(
      (t) =>
        t.profesional === profesionalIndex &&
        t.fecha === fechaSeleccionada &&
        t.hora === hora
    );
  }

  /** Formatea una fecha ISO a texto legible */
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

  const hayDisponibles = horarios.some((h) => !estaOcupado(h));

  return (
    <section id="paso3" className="paso-enter">
      <h2 className="mb-3">
        <i className="bi bi-clock"></i> Paso 3 &ndash; Elige fecha y horario
      </h2>

      {/* Selector de fecha */}
      <div className="mb-4">
        <label htmlFor="selectorFecha" className="form-label fw-semibold">
          <i className="bi bi-calendar-event"></i> Selecciona una fecha:
        </label>
        <input
          type="date"
          id="selectorFecha"
          className="form-control"
          value={fechaSeleccionada}
          min={obtenerFechaHoyISO()}
          onChange={handleCambiarFecha}
          style={{ maxWidth: "280px" }}
        />
        <small className="text-muted mt-1 d-block">
          <i className="bi bi-info-circle"></i>{" "}
          {formatearFechaLarga(fechaSeleccionada)}
        </small>
      </div>

      {/* Indicador de carga al cambiar fecha */}
      {cargandoTurnos && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Cargando turnos...</span>
          </div>
          <span className="ms-2 text-muted">Actualizando horarios disponibles...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-warning mb-3">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
      )}

      {/* Grid de horarios */}
      {!cargandoTurnos && (
        <div className="row g-3">
          {horarios.map((hora, i) => {
            const ocupado = estaOcupado(hora);
            return (
              <div key={i} className="col-auto">
                {ocupado ? (
                  <button
                    className="btn btn-outline-secondary btn-horario"
                    disabled
                  >
                    <i className="bi bi-x-circle"></i> {hora}
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success btn-horario"
                    onClick={() =>
                      onSeleccionar(i, horarios, fechaSeleccionada)
                    }
                  >
                    <i className="bi bi-clock"></i> {hora}
                  </button>
                )}
              </div>
            );
          })}

          {!hayDisponibles && (
            <div className="col-12">
              <div className="alert alert-warning mt-2">
                <i className="bi bi-exclamation-triangle"></i> No hay horarios
                disponibles para este profesional en la fecha seleccionada.
                Prueba otra fecha u otro profesional.
              </div>
            </div>
          )}
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={onVolver}>
        <i className="bi bi-arrow-left"></i> Volver
      </button>
    </section>
  );
}

export default Paso3Horarios;
export { obtenerFechaHoyISO };
