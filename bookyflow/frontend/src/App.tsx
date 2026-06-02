// ===== App.tsx — Componente principal de BookyFlow (Fase 2) =====

import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Paso1Servicios from "./components/Paso1Servicios";
import Paso2Profesionales from "./components/Paso2Profesionales";
import Paso3Horarios from "./components/Paso3Horarios";
import Paso4Confirmacion from "./components/Paso4Confirmacion";
import Dashboard from "./components/Dashboard";
import type { Vista, PasoActual, Servicio, Profesional } from "./types";
import "./App.css";

function App() {
  // Estado de la vista: cliente o dueño
  const [vista, setVista] = useState<Vista>("cliente");

  // Estado del paso actual en el flujo de reserva
  const [pasoActual, setPasoActual] = useState<PasoActual>(1);

  // Datos de la selección actual
  const [servicioSeleccionado, setServicioSeleccionado] = useState<{
    indice: number;
    datos: Servicio;
  } | null>(null);

  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<{
    indice: number;
    datos: Profesional;
  } | null>(null);

  const [horarioSeleccionado, setHorarioSeleccionado] = useState<{
    indice: number;
    hora: string;
  } | null>(null);

  // Fecha seleccionada (formato ISO: YYYY-MM-DD)
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

  // Key para forzar re-render del Dashboard al cambiar a vista dueño
  const [dashboardKey, setDashboardKey] = useState(0);

  /** Cambia la vista actual */
  function handleCambiarVista(nuevaVista: Vista) {
    setVista(nuevaVista);
    if (nuevaVista === "dueno") {
      // Forzar re-render del Dashboard para recargar datos
      setDashboardKey((prev) => prev + 1);
    }
  }

  /** Reinicia el flujo de reserva */
  function nuevaReserva() {
    setServicioSeleccionado(null);
    setProfesionalSeleccionado(null);
    setHorarioSeleccionado(null);
    setFechaSeleccionada("");
    setPasoActual(1);
  }

  /** Renderiza el paso actual del flujo de cliente */
  function renderPasoActual() {
    switch (pasoActual) {
      case 1:
        return (
          <Paso1Servicios
            onSeleccionar={(indice, servicios) => {
              setServicioSeleccionado({
                indice,
                datos: servicios[indice],
              });
              setPasoActual(2);
            }}
          />
        );

      case 2:
        return (
          <Paso2Profesionales
            onSeleccionar={(indice, profesionales) => {
              setProfesionalSeleccionado({
                indice,
                datos: profesionales[indice],
              });
              setPasoActual(3);
            }}
            onVolver={() => setPasoActual(1)}
          />
        );

      case 3:
        return (
          <Paso3Horarios
            profesionalIndex={profesionalSeleccionado!.indice}
            onSeleccionar={(indice, horarios, fecha) => {
              setHorarioSeleccionado({
                indice,
                hora: horarios[indice],
              });
              setFechaSeleccionada(fecha);
              setPasoActual(4);
            }}
            onVolver={() => setPasoActual(2)}
          />
        );

      case 4:
        return (
          <Paso4Confirmacion
            servicio={servicioSeleccionado!.datos}
            profesional={profesionalSeleccionado!.datos}
            hora={horarioSeleccionado!.hora}
            fecha={fechaSeleccionada}
            onConfirmado={() => setPasoActual("exito")}
            onVolver={() => setPasoActual(3)}
          />
        );

      case "exito":
        return (
          <section id="pasoExito" className="text-center paso-enter">
            <div className="alert alert-success mt-4" role="alert">
              <h3>
                <i className="bi bi-check-circle-fill"></i> ¡Cita agendada con
                éxito!
              </h3>
              <p>Tu reserva ha sido registrada. ¡Te esperamos!</p>
            </div>
            <button className="btn btn-primary" onClick={nuevaReserva}>
              <i className="bi bi-plus-circle"></i> Agendar otra cita
            </button>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <>
      <Header vistaActual={vista} onCambiarVista={handleCambiarVista} />

      <main className="container my-4">
        {vista === "cliente" ? (
          <section id="vistaCliente">{renderPasoActual()}</section>
        ) : (
          <Dashboard key={dashboardKey} />
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
