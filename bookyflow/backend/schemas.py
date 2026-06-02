"""
schemas.py — Schemas Pydantic para validación de datos (Fase 2)
Estos schemas se usan en los endpoints de FastAPI para validar
los datos de entrada y formatear las respuestas.
"""

from pydantic import BaseModel
from typing import Optional


# ─────────────────────────────────────────
# Schemas de entrada (request)
# ─────────────────────────────────────────

class CitaCreate(BaseModel):
    """Datos enviados por el frontend para crear una nueva cita."""
    cliente: str
    servicio: str
    profesional: str
    fecha: str        # Formato ISO: YYYY-MM-DD
    hora: str         # Ej: "09:00 AM"
    precio: int


# ─────────────────────────────────────────
# Schemas de salida (response)
# ─────────────────────────────────────────

class CitaResponse(BaseModel):
    """Cita almacenada devuelta por el backend (incluye id)."""
    id: int
    cliente: str
    servicio: str
    profesional: str
    fecha: str
    hora: str
    precio: int
    timestamp_creacion: str

    model_config = {"from_attributes": True}


class TurnoOcupadoResponse(BaseModel):
    """Turno ocupado devuelto por el backend."""
    id: int
    profesional_index: int
    fecha: str
    hora: str

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────
# Schema genérico de respuesta
# ─────────────────────────────────────────

class RespuestaAPI(BaseModel):
    """Respuesta genérica con ok y mensaje."""
    ok: bool
    mensaje: str


# ─────────────────────────────────────────
# Schema para filtros de citas (query params)
# ─────────────────────────────────────────

class FiltrosCitas(BaseModel):
    """Filtros opcionales para consultar citas."""
    fecha: Optional[str] = None
    profesional: Optional[str] = None
    servicio: Optional[str] = None
