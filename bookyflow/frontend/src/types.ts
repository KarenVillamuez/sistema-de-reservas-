// ===== types.ts — Interfaces TypeScript para BookyFlow (Fase 2) =====

/** Representa un servicio ofrecido */
export interface Servicio {
  nombre: string;
  duracion: string;
  precio: number;
}

/** Representa un profesional del negocio */
export interface Profesional {
  nombre: string;
  especialidad: string;
  imagen: string;
}

/** Datos para crear una cita (enviados al backend) */
export interface CitaCreate {
  cliente: string;
  servicio: string;
  profesional: string;
  fecha: string;    // Formato ISO: YYYY-MM-DD
  hora: string;
  precio: number;
}

/** Cita almacenada (respuesta del backend, incluye id) */
export interface Cita {
  id: number;
  cliente: string;
  servicio: string;
  profesional: string;
  fecha: string;    // Formato ISO: YYYY-MM-DD
  hora: string;
  precio: number;
  timestamp_creacion: string;
}

/** Turno ocupado (profesional + fecha + hora) */
export interface TurnoOcupado {
  profesional: number;
  fecha: string;    // Formato ISO: YYYY-MM-DD
  hora: string;
}

/** Respuesta genérica del backend */
export interface RespuestaAPI {
  ok: boolean;
  mensaje: string;
}

/** Respuesta del endpoint de ingresos semanales */
export interface IngresosSemana {
  total: number;
}

/** Estado de selección del flujo de reserva */
export interface Seleccion {
  servicio: number | null;
  profesional: number | null;
  horario: number | null;
}

/** Filtros opcionales para consultar citas en el dashboard */
export interface FiltrosCitas {
  fecha?: string;
  profesional?: string;
  servicio?: string;
}

/** Tipo para la vista actual */
export type Vista = "cliente" | "dueno";

/** Tipo para el paso actual del flujo de cliente */
export type PasoActual = 1 | 2 | 3 | 4 | "exito";
