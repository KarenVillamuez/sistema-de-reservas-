"""
models.py — Modelos SQLAlchemy ORM para BookyFlow (Fase 2)
Define las tablas de la base de datos SQLite.
"""

from sqlalchemy import Column, Integer, String
from database import Base


class CitaDB(Base):
    """
    Modelo ORM para la tabla 'citas'.
    Almacena cada cita agendada por un cliente.
    """
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cliente = Column(String, nullable=False)
    servicio = Column(String, nullable=False)
    profesional = Column(String, nullable=False)
    fecha = Column(String, nullable=False)           # Formato ISO: YYYY-MM-DD
    hora = Column(String, nullable=False)             # Ej: "09:00 AM"
    precio = Column(Integer, nullable=False)
    timestamp_creacion = Column(String, nullable=False)  # ISO datetime string

    def __repr__(self):
        return f"<Cita {self.id}: {self.cliente} - {self.servicio} el {self.fecha}>"


class TurnoOcupadoDB(Base):
    """
    Modelo ORM para la tabla 'turnos_ocupados'.
    Registra qué horarios están bloqueados por profesional y fecha.
    profesional_index es el índice (0,1,2,3) del array de profesionales.
    """
    __tablename__ = "turnos_ocupados"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profesional_index = Column(Integer, nullable=False)  # Índice 0-3
    fecha = Column(String, nullable=False)                # Formato ISO: YYYY-MM-DD
    hora = Column(String, nullable=False)                 # Ej: "09:00 AM"

    def __repr__(self):
        return f"<Turno prof={self.profesional_index} {self.fecha} {self.hora}>"
