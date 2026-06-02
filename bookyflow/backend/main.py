"""
main.py — API FastAPI para BookyFlow (Fase 2 – persistencia SQLite)
Incluye: validaciones, filtros, cancelación individual y datos de ejemplo.
"""

from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import CitaDB, TurnoOcupadoDB
from schemas import CitaCreate, CitaResponse, TurnoOcupadoResponse, RespuestaAPI

# ───────────────────────────────────────────
# App FastAPI
# ───────────────────────────────────────────

app = FastAPI(title="BookyFlow API", version="2.0.0")

# Habilitar CORS para el frontend de Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────────────────────────────────────
# Datos fijos (no están en DB, solo en memoria)
# ───────────────────────────────────────────

servicios = [
    {"nombre": "Corte de cabello",   "duracion": "30 min", "precio": 25000},
    {"nombre": "Manicura",           "duracion": "45 min", "precio": 35000},
    {"nombre": "Pedicura",           "duracion": "50 min", "precio": 40000},
    {"nombre": "Tinte de cabello",   "duracion": "60 min", "precio": 80000},
    {"nombre": "Masaje relajante",   "duracion": "60 min", "precio": 60000},
    {"nombre": "Corte de barba",     "duracion": "20 min", "precio": 15000},
]

profesionales = [
    {"nombre": "Ana Garcia",     "especialidad": "Estilista",   "imagen": "/img/Ana.jpg"},
    {"nombre": "Carlos Lopez",   "especialidad": "Barbero",     "imagen": "/img/Carlos.jpg"},
    {"nombre": "Laura Martinez", "especialidad": "Manicurista", "imagen": "/img/Laura.jpg"},
    {"nombre": "Pedro Sanchez",  "especialidad": "Masajista",   "imagen": "/img/Pedro.jpg"},
]

horarios = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
]


# ───────────────────────────────────────────
# Funciones auxiliares
# ───────────────────────────────────────────

def insertar_datos_ejemplo(db: Session):
    """
    Inserta 3 citas de demostración si la base de datos está vacía.
    Se ejecuta una sola vez al iniciar el servidor por primera vez.
    """
    cantidad = db.query(CitaDB).count()
    if cantidad > 0:
        return  # Ya hay datos, no insertar

    hoy = date.today()
    manana = hoy + timedelta(days=1)
    ahora = datetime.now().isoformat()

    # Citas de ejemplo
    citas_demo = [
        {
            "cliente": "María López",
            "servicio": "Corte de cabello",
            "profesional": "Ana Garcia",
            "fecha": hoy.isoformat(),
            "hora": "09:00 AM",
            "precio": 25000,
            "profesional_index": 0,
        },
        {
            "cliente": "Juan Pérez",
            "servicio": "Corte de barba",
            "profesional": "Carlos Lopez",
            "fecha": hoy.isoformat(),
            "hora": "10:00 AM",
            "precio": 15000,
            "profesional_index": 1,
        },
        {
            "cliente": "Laura Gómez",
            "servicio": "Manicura",
            "profesional": "Laura Martinez",
            "fecha": manana.isoformat(),
            "hora": "11:00 AM",
            "precio": 35000,
            "profesional_index": 2,
        },
    ]

    for c in citas_demo:
        # Insertar la cita
        cita = CitaDB(
            cliente=c["cliente"],
            servicio=c["servicio"],
            profesional=c["profesional"],
            fecha=c["fecha"],
            hora=c["hora"],
            precio=c["precio"],
            timestamp_creacion=ahora,
        )
        db.add(cita)

        # Insertar el turno ocupado correspondiente
        turno = TurnoOcupadoDB(
            profesional_index=c["profesional_index"],
            fecha=c["fecha"],
            hora=c["hora"],
        )
        db.add(turno)

    db.commit()
    print(f"✅ Se insertaron {len(citas_demo)} citas de ejemplo en la base de datos.")


# ───────────────────────────────────────────
# Evento de startup: crear tablas y datos demo
# ───────────────────────────────────────────

@app.on_event("startup")
def on_startup():
    """Crea las tablas si no existen e inserta datos de ejemplo."""
    Base.metadata.create_all(bind=engine)
    # Insertar datos de ejemplo usando una sesión temporal
    from database import SessionLocal
    db = SessionLocal()
    try:
        insertar_datos_ejemplo(db)
    finally:
        db.close()


# ───────────────────────────────────────────
# Endpoints de datos fijos
# ───────────────────────────────────────────

@app.get("/servicios")
def get_servicios():
    """Devuelve el array de servicios."""
    return servicios


@app.get("/profesionales")
def get_profesionales():
    """Devuelve el array de profesionales (incluyendo propiedad imagen)."""
    return profesionales


@app.get("/horarios")
def get_horarios():
    """Devuelve la lista de horarios disponibles."""
    return horarios


# ───────────────────────────────────────────
# Endpoints con persistencia
# ───────────────────────────────────────────

@app.get("/turnos-ocupados")
def get_turnos_ocupados(
    profesional: Optional[int] = Query(None, description="Índice del profesional (0-3)"),
    fecha: Optional[str] = Query(None, description="Fecha en formato ISO YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    """
    Devuelve la lista de turnos ocupados.
    Acepta filtros opcionales por profesional y fecha.
    """
    query = db.query(TurnoOcupadoDB)

    if profesional is not None:
        query = query.filter(TurnoOcupadoDB.profesional_index == profesional)
    if fecha is not None:
        query = query.filter(TurnoOcupadoDB.fecha == fecha)

    turnos = query.all()

    # Devolver en formato compatible con el frontend
    return [
        {
            "profesional": t.profesional_index,
            "fecha": t.fecha,
            "hora": t.hora,
        }
        for t in turnos
    ]


@app.post("/crear-cita")
def crear_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva cita con validaciones:
    - La fecha no puede ser anterior a hoy.
    - La hora debe estar en la lista de horarios válidos.
    - El turno no puede estar ya ocupado (misma fecha + profesional + hora).
    Inserta en las tablas citas y turnos_ocupados de forma transaccional.
    """

    # Validar que el nombre del cliente no esté vacío
    if not cita.cliente.strip():
        raise HTTPException(status_code=400, detail="El nombre del cliente es obligatorio.")

    # Validar formato de fecha
    try:
        fecha_cita = date.fromisoformat(cita.fecha)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Formato de fecha inválido. Usa YYYY-MM-DD."
        )

    # Validar que la fecha no sea pasada
    if fecha_cita < date.today():
        raise HTTPException(
            status_code=400,
            detail="No se pueden agendar citas en fechas pasadas."
        )

    # Validar que la hora esté en los horarios válidos
    if cita.hora not in horarios:
        raise HTTPException(
            status_code=400,
            detail=f"Horario inválido: '{cita.hora}'. Los horarios válidos son: {', '.join(horarios)}"
        )

    # Buscar el índice del profesional por nombre
    idx_profesional = -1
    for i, p in enumerate(profesionales):
        if p["nombre"] == cita.profesional:
            idx_profesional = i
            break

    if idx_profesional == -1:
        raise HTTPException(
            status_code=400,
            detail=f"Profesional '{cita.profesional}' no encontrado."
        )

    # Validar que el turno no esté ya ocupado
    turno_existente = db.query(TurnoOcupadoDB).filter(
        TurnoOcupadoDB.profesional_index == idx_profesional,
        TurnoOcupadoDB.fecha == cita.fecha,
        TurnoOcupadoDB.hora == cita.hora,
    ).first()

    if turno_existente:
        raise HTTPException(
            status_code=400,
            detail=f"Este horario ya está ocupado. {cita.profesional} no está disponible el {cita.fecha} a las {cita.hora}."
        )

    # ── Inserción transaccional ──
    try:
        # Crear la cita en la base de datos
        nueva_cita = CitaDB(
            cliente=cita.cliente.strip(),
            servicio=cita.servicio,
            profesional=cita.profesional,
            fecha=cita.fecha,
            hora=cita.hora,
            precio=cita.precio,
            timestamp_creacion=datetime.now().isoformat(),
        )
        db.add(nueva_cita)

        # Marcar el turno como ocupado
        nuevo_turno = TurnoOcupadoDB(
            profesional_index=idx_profesional,
            fecha=cita.fecha,
            hora=cita.hora,
        )
        db.add(nuevo_turno)

        # Confirmar ambas inserciones
        db.commit()
        db.refresh(nueva_cita)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar la cita: {str(e)}")

    return {"ok": True, "mensaje": "Cita agendada con éxito", "id": nueva_cita.id}


@app.get("/citas")
def get_citas(
    fecha: Optional[str] = Query(None, description="Filtrar por fecha ISO YYYY-MM-DD"),
    profesional: Optional[str] = Query(None, description="Filtrar por nombre del profesional"),
    servicio: Optional[str] = Query(None, description="Filtrar por nombre del servicio"),
    db: Session = Depends(get_db),
):
    """
    Devuelve las citas agendadas con filtros opcionales.
    Los filtros se aplican sobre los campos exactos.
    """
    query = db.query(CitaDB)

    if fecha:
        query = query.filter(CitaDB.fecha == fecha)
    if profesional:
        query = query.filter(CitaDB.profesional == profesional)
    if servicio:
        query = query.filter(CitaDB.servicio == servicio)

    citas = query.order_by(CitaDB.fecha, CitaDB.hora).all()

    return [
        {
            "id": c.id,
            "cliente": c.cliente,
            "servicio": c.servicio,
            "profesional": c.profesional,
            "fecha": c.fecha,
            "hora": c.hora,
            "precio": c.precio,
            "timestamp_creacion": c.timestamp_creacion,
        }
        for c in citas
    ]


@app.delete("/cancelar-cita/{cita_id}")
def cancelar_cita(cita_id: int, db: Session = Depends(get_db)):
    """
    Elimina una cita por su ID.
    También elimina el turno ocupado asociado (mismo profesional, fecha y hora).
    """
    # Buscar la cita
    cita = db.query(CitaDB).filter(CitaDB.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada.")

    # Encontrar el índice del profesional
    idx_profesional = -1
    for i, p in enumerate(profesionales):
        if p["nombre"] == cita.profesional:
            idx_profesional = i
            break

    # Eliminar el turno ocupado asociado
    if idx_profesional >= 0:
        db.query(TurnoOcupadoDB).filter(
            TurnoOcupadoDB.profesional_index == idx_profesional,
            TurnoOcupadoDB.fecha == cita.fecha,
            TurnoOcupadoDB.hora == cita.hora,
        ).delete()

    # Eliminar la cita
    db.delete(cita)
    db.commit()

    return {"ok": True, "mensaje": f"Cita #{cita_id} cancelada exitosamente."}


@app.get("/ingresos-semana")
def get_ingresos_semana(db: Session = Depends(get_db)):
    """
    Devuelve la suma de precios de las citas cuya fecha
    está en la semana actual (lunes a domingo).
    Las fechas están en formato ISO YYYY-MM-DD en la DB.
    """
    hoy = date.today()
    dia_semana = hoy.weekday()  # 0=lunes, 6=domingo
    lunes = hoy - timedelta(days=dia_semana)
    domingo = lunes + timedelta(days=6)

    # Filtrar por rango de fechas usando comparación de strings ISO
    citas = db.query(CitaDB).filter(
        CitaDB.fecha >= lunes.isoformat(),
        CitaDB.fecha <= domingo.isoformat(),
    ).all()

    total = sum(c.precio for c in citas)
    return {"total": total}


@app.delete("/limpiar-datos")
def limpiar_datos(db: Session = Depends(get_db)):
    """Elimina todas las citas y turnos ocupados de la base de datos."""
    db.query(CitaDB).delete()
    db.query(TurnoOcupadoDB).delete()
    db.commit()
    return {"ok": True, "mensaje": "Todos los datos han sido eliminados"}
