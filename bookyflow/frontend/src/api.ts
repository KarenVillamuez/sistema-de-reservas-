// ===== api.ts — Funciones fetch reutilizables para BookyFlow (Fase 2) =====

import type {
  Servicio,
  Profesional,
  Cita,
  TurnoOcupado,
  CitaCreate,
  RespuestaAPI,
  IngresosSemana,
  FiltrosCitas,
} from "./types";

const API_URL = "http://localhost:8000";

/** Obtiene la lista de servicios */
export async function getServicios(): Promise<Servicio[]> {
  const res = await fetch(`${API_URL}/servicios`);
  if (!res.ok) throw new Error("Error al cargar servicios");
  return res.json();
}

/** Obtiene la lista de profesionales */
export async function getProfesionales(): Promise<Profesional[]> {
  const res = await fetch(`${API_URL}/profesionales`);
  if (!res.ok) throw new Error("Error al cargar profesionales");
  return res.json();
}

/** Obtiene la lista de horarios disponibles */
export async function getHorarios(): Promise<string[]> {
  const res = await fetch(`${API_URL}/horarios`);
  if (!res.ok) throw new Error("Error al cargar horarios");
  return res.json();
}

/**
 * Obtiene la lista de turnos ocupados.
 * Acepta filtros opcionales por profesional (índice) y fecha (ISO).
 */
export async function getTurnosOcupados(
  profesional?: number,
  fecha?: string
): Promise<TurnoOcupado[]> {
  const params = new URLSearchParams();
  if (profesional !== undefined) params.set("profesional", profesional.toString());
  if (fecha !== undefined) params.set("fecha", fecha);

  const queryString = params.toString();
  const url = queryString
    ? `${API_URL}/turnos-ocupados?${queryString}`
    : `${API_URL}/turnos-ocupados`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar turnos ocupados");
  return res.json();
}

/**
 * Crea una nueva cita en el backend.
 * Lee el body de la respuesta para errores 4xx con mensajes descriptivos.
 */
export async function crearCita(data: CitaCreate): Promise<RespuestaAPI> {
  const res = await fetch(`${API_URL}/crear-cita`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Si el backend rechaza la cita (400), leer el mensaje de error
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const mensaje = body?.detail || "Error al crear la cita";
    throw new Error(mensaje);
  }

  return res.json();
}

/**
 * Obtiene las citas agendadas con filtros opcionales.
 */
export async function getCitas(filtros?: FiltrosCitas): Promise<Cita[]> {
  const params = new URLSearchParams();
  if (filtros?.fecha) params.set("fecha", filtros.fecha);
  if (filtros?.profesional) params.set("profesional", filtros.profesional);
  if (filtros?.servicio) params.set("servicio", filtros.servicio);

  const queryString = params.toString();
  const url = queryString
    ? `${API_URL}/citas?${queryString}`
    : `${API_URL}/citas`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar citas");
  return res.json();
}

/** Obtiene los ingresos de la semana actual */
export async function getIngresosSemana(): Promise<IngresosSemana> {
  const res = await fetch(`${API_URL}/ingresos-semana`);
  if (!res.ok) throw new Error("Error al cargar ingresos");
  return res.json();
}

/** Cancela una cita individual por su ID */
export async function cancelarCita(id: number): Promise<RespuestaAPI> {
  const res = await fetch(`${API_URL}/cancelar-cita/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const mensaje = body?.detail || "Error al cancelar la cita";
    throw new Error(mensaje);
  }

  return res.json();
}

/** Limpia todas las citas y turnos ocupados */
export async function limpiarDatos(): Promise<RespuestaAPI> {
  const res = await fetch(`${API_URL}/limpiar-datos`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al limpiar datos");
  return res.json();
}
