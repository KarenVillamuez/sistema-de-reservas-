"""
database.py — Configuración de SQLAlchemy para BookyFlow (Fase 2)
Base de datos SQLite con archivo bookyflow.db
"""

import os
# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import sessionmaker, declarative_base

# Ruta absoluta al archivo de la base de datos (junto a main.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'bookyflow.db')}"

# Motor de SQLAlchemy — check_same_thread=False necesario para SQLite con FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

# Fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para los modelos ORM
Base = declarative_base()


def get_db():
    """
    Dependencia FastAPI que provee una sesión de base de datos.
    Se cierra automáticamente al terminar cada request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
