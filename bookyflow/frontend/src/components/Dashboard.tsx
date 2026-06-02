// ===== Dashboard.tsx — Panel del dueño con filtros, cancelación, login y gráfica (Fase 2) =====

import { useState, useEffect, useCallback } from "react";
import {
  getCitas,
  getIngresosSemana,
  limpiarDatos,
  cancelarCita,
} from "../api";
import type { Cita, FiltrosCitas } from "../types";

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

/** Convierte fecha ISO (YYYY-MM-DD) a formato dd/mm/yyyy para visualización */
function formatearFechaVisual(fechaISO: string): string {
  if (!fechaISO || !fechaISO.includes("-")) return fechaISO;
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Lista de profesionales y servicios para los filtros (debe coincidir con el backend)
const PROFESIONALES = [
  "Ana Garcia",
  "Carlos Lopez",
  "Laura Martinez",
  "Pedro Sanchez",
];

const SERVICIOS = [
  "Corte de cabello",
  "Manicura",
  "Pedicura",
  "Tinte de cabello",
  "Masaje relajante",
  "Corte de barba",
];

function Dashboard() {
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("bf_owner_auth") === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Datos principales
  const [citas, setCitas] = useState<Cita[]>([]);
  const [ingresos, setIngresos] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de los filtros
  const [filtroProfesional, setFiltroProfesional] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState(false);

  // Estado para cancelación en progreso
  const [cancelando, setCancelando] = useState<number | null>(null);

  // Estado del modal de confirmación personalizado
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [modalType, setModalType] = useState<"danger" | "warning">("danger");

  /** Carga las citas e ingresos, opcionalmente con filtros */
  const cargarDatos = useCallback(async (filtros?: FiltrosCitas) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const [citasData, ingresosData] = await Promise.all([
        getCitas(filtros),
        getIngresosSemana(),
      ]);
      setCitas(citasData);
      setIngresos(ingresosData.total);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Carga inicial sin filtros si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      cargarDatos();
    }
  }, [cargarDatos, isAuthenticated]);

  /** Maneja el proceso de Login */
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("bf_owner_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  }

  /** Cierra la sesión del dueño */
  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem("bf_owner_auth");
    setUsername("");
    setPassword("");
  }

  /** Aplica los filtros seleccionados */
  function handleAplicarFiltros() {
    const filtros: FiltrosCitas = {};
    if (filtroFecha) filtros.fecha = filtroFecha;
    if (filtroProfesional) filtros.profesional = filtroProfesional;
    if (filtroServicio) filtros.servicio = filtroServicio;
    setFiltrosActivos(
      !!(filtroFecha || filtroProfesional || filtroServicio)
    );
    cargarDatos(filtros);
  }

  /** Limpia todos los filtros y recarga sin filtros */
  function handleLimpiarFiltros() {
    setFiltroProfesional("");
    setFiltroFecha("");
    setFiltroServicio("");
    setFiltrosActivos(false);
    cargarDatos();
  }

  /** Abre el modal para confirmar la eliminación de todas las citas */
  function handleConfirmarLimpiarTodo() {
    setModalTitle("Eliminar todas las citas");
    setModalMessage("¿Estás seguro de que quieres eliminar TODAS las citas registradas? Esta acción es irreversible.");
    setModalType("danger");
    setModalAction(() => async () => {
      try {
        await limpiarDatos();
        handleLimpiarFiltros(); // Recargar sin filtros
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al limpiar datos"
        );
      }
    });
    setShowConfirmModal(true);
  }

  /** Abre el modal para confirmar la cancelación de una cita individual */
  function handleConfirmarCancelarCita(cita: Cita) {
    setModalTitle("Confirmar cancelación");
    setModalMessage(`¿Deseas cancelar la cita agendada para "${cita.cliente}" (${cita.servicio} el día ${formatearFechaVisual(cita.fecha)} a las ${cita.hora})?`);
    setModalType("warning");
    setModalAction(() => async () => {
      setCancelando(cita.id);
      try {
        await cancelarCita(cita.id);
        // Recargar datos con los filtros actuales
        const filtros: FiltrosCitas = {};
        if (filtrosActivos) {
          if (filtroFecha) filtros.fecha = filtroFecha;
          if (filtroProfesional) filtros.profesional = filtroProfesional;
          if (filtroServicio) filtros.servicio = filtroServicio;
        }
        await cargarDatos(filtrosActivos ? filtros : undefined);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cancelar la cita"
        );
      } finally {
        setCancelando(null);
      }
    });
    setShowConfirmModal(true);
  }

  // Cálculos para la gráfica de ventas semanales (Lunes a Domingo)
  const obtenerDiasSemanaActual = () => {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes...
    const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
    
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diasDesdeLunes);
    
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      const anio = dia.getFullYear();
      const mes = String(dia.getMonth() + 1).padStart(2, "0");
      const d = String(dia.getDate()).padStart(2, "0");
      dias.push(`${anio}-${mes}-${d}`);
    }
    return dias;
  };

  const diasSemanaISO = obtenerDiasSemanaActual();
  const nombresDiasCortos = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const nombresDiasCompletos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const ventasPorDia = diasSemanaISO.map((fechaStr) => {
    // Filtrar citas que coinciden con la fecha en la DB
    return citas
      .filter((c) => c.fecha === fechaStr)
      .reduce((sum, c) => sum + c.precio, 0);
  });

  const maxVenta = Math.max(...ventasPorDia, 10000); // Evitar división por cero

  // RENDER DE VISTA LOGIN
  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 paso-enter">
        <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%", borderRadius: "16px" }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                <i className="bi bi-shield-lock-fill fs-1" style={{ color: "var(--accent)" }}></i>
              </div>
              <h3 className="fw-bold text-dark">Acceso de Dueño</h3>
              <p className="text-muted small">Ingresa las credenciales del panel de control</p>
            </div>

            {loginError && (
              <div className="alert alert-danger py-2 text-center small" role="alert">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3 text-start">
                <label htmlFor="userInput" className="form-label small fw-semibold text-muted">Usuario</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    id="userInput"
                    placeholder="Ej. admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 text-start">
                <label htmlFor="passInput" className="form-label small fw-semibold text-muted">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-key text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0"
                    id="passInput"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" style={{ background: "var(--accent)", border: "none" }}>
                <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
              </button>
            </form>

            <div className="mt-4 text-center border-top pt-3">
              <span className="badge bg-light text-secondary border p-2 text-wrap">
                🔑 <strong>Credenciales demo:</strong> admin / admin123
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <section id="vistaDueno" className="paso-enter position-relative">
      
      {/* Cabecera del panel con botón de cerrar sesión */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2>
          <i className="bi bi-speedometer2 me-2 text-primary"></i>Panel de Control del Dueño
        </h2>
        <button className="btn btn-outline-danger btn-sm fw-semibold" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
        </button>
      </div>

      <div className="row g-4 mb-4">
        {/* Card de ingresos estimados de la semana */}
        <div className="col-lg-4">
          <div className="card card-ingresos h-100 shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 me-3">
                  <i className="bi bi-wallet2 fs-3"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Ventas de la Semana</h6>
                  <small className="text-muted">Lunes a Domingo (estimado)</small>
                </div>
              </div>
              <h2 className="display-6 text-success fw-bold my-2" id="ingresosSemana">
                {formatearPrecio(ingresos)}
              </h2>
              <div className="mt-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfica interactiva de ventas de la semana */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
              <h6 className="card-title text-muted mb-3">
                <i className="bi bi-bar-chart-line-fill me-2 text-primary"></i>Desempeño diario de ventas
              </h6>
              
              {/* Gráfica de barras */}
              <div 
                className="d-flex justify-content-between align-items-end pt-4 pb-2 px-2" 
                style={{ 
                  height: "170px", 
                  backgroundColor: "rgba(244, 243, 236, 0.4)", 
                  borderRadius: "12px", 
                  border: "1px solid var(--border)" 
                }}
              >
                {nombresDiasCortos.map((dia, idx) => {
                  const valor = ventasPorDia[idx];
                  const porcentaje = (valor / maxVenta) * 100;
                  return (
                    <div key={dia} className="d-flex flex-column align-items-center flex-grow-1" style={{ height: "100%" }}>
                      <div className="d-flex flex-column justify-content-end align-items-center w-100 flex-grow-1" style={{ height: "120px" }}>
                        <span 
                          className="text-success fw-bold mb-1" 
                          style={{ fontSize: "0.7rem", opacity: valor > 0 ? 1 : 0, transition: "opacity 0.2s" }}
                        >
                          {valor > 0 ? (valor >= 1000 ? `${(valor/1000).toFixed(0)}k` : valor) : ""}
                        </span>
                        <div 
                          style={{
                            height: `${Math.max(porcentaje, 4)}%`,
                            width: "35%",
                            minWidth: "16px",
                            background: valor > 0 ? "linear-gradient(180deg, var(--accent) 0%, #aa3bff 100%)" : "rgba(200, 200, 200, 0.3)",
                            borderRadius: "6px 6px 0 0",
                            transition: "height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            cursor: "pointer"
                          }}
                          className="bar-hover"
                          title={`${nombresDiasCompletos[idx]}: ${formatearPrecio(valor)}`}
                        />
                      </div>
                      <span className="text-muted small mt-2 fw-semibold" style={{ fontSize: "0.75rem" }}>{dia}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sección de filtros ── */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
        <div className="card-body p-4">
          <h6 className="card-title mb-3 fw-semibold">
            <i className="bi bi-funnel text-primary me-2"></i>Filtrar Citas Agendadas
          </h6>
          <div className="row g-3 align-items-end">
            {/* Filtro por profesional */}
            <div className="col-md-3 col-sm-6 text-start">
              <label htmlFor="filtroProfesional" className="form-label small fw-semibold text-muted">
                Profesional
              </label>
              <select
                id="filtroProfesional"
                className="form-select form-select-sm"
                value={filtroProfesional}
                onChange={(e) => setFiltroProfesional(e.target.value)}
              >
                <option value="">Todos</option>
                {PROFESIONALES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por fecha */}
            <div className="col-md-3 col-sm-6 text-start">
              <label htmlFor="filtroFecha" className="form-label small fw-semibold text-muted">
                Fecha
              </label>
              <input
                type="date"
                id="filtroFecha"
                className="form-control form-control-sm"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>

            {/* Filtro por servicio */}
            <div className="col-md-3 col-sm-6 text-start">
              <label htmlFor="filtroServicio" className="form-label small fw-semibold text-muted">
                Servicio
              </label>
              <select
                id="filtroServicio"
                className="form-select form-select-sm"
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
              >
                <option value="">Todos</option>
                {SERVICIOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones de filtros */}
            <div className="col-md-3 col-sm-6 text-start">
              <button
                className="btn btn-primary btn-sm me-2 px-3 fw-semibold"
                onClick={handleAplicarFiltros}
              >
                <i className="bi bi-search me-1"></i> Filtrar
              </button>
              <button
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={handleLimpiarFiltros}
              >
                <i className="bi bi-x-circle me-1"></i> Limpiar
              </button>
            </div>
          </div>

          {filtrosActivos && (
            <div className="mt-2 text-start">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill">
                <i className="bi bi-funnel-fill me-1"></i> Filtros activos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Errores ── */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* ── Tabla de citas ── */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3">Cliente</th>
                <th className="py-3">Servicio</th>
                <th className="py-3">Profesional</th>
                <th className="py-3">Fecha</th>
                <th className="py-3">Hora</th>
                <th className="py-3">Precio</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody id="tablaCitasBody">
              {citas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-5">
                    <i className="bi bi-calendar-x display-4 mb-3 d-block text-secondary"></i>
                    {filtrosActivos
                      ? "No hay citas que coincidan con los filtros"
                      : "No hay citas agendadas aún"}
                  </td>
                </tr>
              ) : (
                citas.map((c, i) => (
                  <tr key={c.id}>
                    <td className="px-4 fw-semibold text-muted">{i + 1}</td>
                    <td className="fw-semibold text-dark">{c.cliente}</td>
                    <td><span className="badge bg-light text-dark border">{c.servicio}</span></td>
                    <td>{c.profesional}</td>
                    <td>{formatearFechaVisual(c.fecha)}</td>
                    <td>{c.hora}</td>
                    <td className="fw-bold text-success">{formatearPrecio(c.precio)}</td>
                    <td className="px-4 text-center">
                      <button
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={() => handleConfirmarCancelarCita(c)}
                        disabled={cancelando === c.id}
                        title={`Cancelar cita de ${c.cliente}`}
                      >
                        {cancelando === c.id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                        ) : (
                          <>
                            <i className="bi bi-trash"></i> Cancelar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="table-light border-top">
                <td colSpan={8} id="tablaCitasFoot" className="text-end fw-bold py-3 px-4 text-secondary">
                  {citas.length === 0
                    ? "Sin citas registradas"
                    : `Total citas: ${citas.length}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Botón para limpiar todos los datos ── */}
      <div className="text-end mt-4">
        <button
          className="btn btn-danger btn-sm px-3 fw-semibold shadow-sm"
          onClick={handleConfirmarLimpiarTodo}
        >
          <i className="bi bi-trash3 me-2"></i>Limpiar Base de Datos
        </button>
      </div>

      {/* ── MODAL DE CONFIRMACIÓN PERSONALIZADO (CENTRO DE PANTALLA) ── */}
      {showConfirmModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "450px" }}>
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
                <div className={`modal-header bg-${modalType} text-white border-0 py-3`} style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
                  <h5 className="modal-title fw-bold">
                    <i className={`bi ${modalType === "danger" ? "bi-exclamation-octagon-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
                    {modalTitle}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowConfirmModal(false)} aria-label="Cerrar"></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div className={`text-${modalType} mb-3`}>
                    <i className={`bi ${modalType === "danger" ? "bi-x-circle" : "bi-question-circle"} display-3`}></i>
                  </div>
                  <p className="fs-6 text-dark mb-0">{modalMessage}</p>
                </div>
                <div className="modal-footer justify-content-center border-0 pb-4">
                  <button type="button" className="btn btn-light border px-4 me-2 fw-semibold" onClick={() => setShowConfirmModal(false)}>
                    No, mantener
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-${modalType} px-4 fw-semibold`} 
                    onClick={() => {
                      if (modalAction) modalAction();
                      setShowConfirmModal(false);
                    }}
                  >
                    Sí, continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estilo local para interactividad de la gráfica */}
      <style>{`
        .bar-hover:hover {
          filter: brightness(1.1);
          transform: scaleY(1.03) translateY(-1px);
        }
      `}</style>
    </section>
  );
}

export default Dashboard;
