
var servicios = [
    { nombre: "Corte de cabello",   duracion: "30 min", precio: 25000 },
    { nombre: "Manicura",           duracion: "45 min", precio: 35000 },
    { nombre: "Pedicura",           duracion: "50 min", precio: 40000 },
    { nombre: "Tinte de cabello",   duracion: "60 min", precio: 80000 },
    { nombre: "Masaje relajante",   duracion: "60 min", precio: 60000 },
    { nombre: "Corte de barba",     duracion: "20 min", precio: 15000 }
];

var profesionales = [
    { nombre: "Ana Garcia",      especialidad: "Estilista",    imagen: "img/Ana.jpg" },
    { nombre: "Carlos Lopez",    especialidad: "Barbero",      imagen: "img/Carlos.jpg" },
    { nombre: "Laura Martinez",  especialidad: "Manicurista",  imagen: "img/Laura.jpg" },
    { nombre: "Pedro Sanchez",   especialidad: "Masajista",    imagen: "img/Pedro.jpg" }
];

var horarios = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM"
];

// ───────────────────────────────────────────
// 2. PERSISTENCIA CON localStorage
// ───────────────────────────────────────────

/** Carga las citas guardadas en localStorage, o devuelve un array vacio */
function cargarCitas() {
    var datos = localStorage.getItem("bookyCitas");
    if (datos) {
        return JSON.parse(datos);
    }
    return [];
}

/** Guarda el array de citas en localStorage */
function guardarCitas() {
    localStorage.setItem("bookyCitas", JSON.stringify(citas));
}

/** Carga los turnos ocupados desde localStorage, o devuelve un array vacio */
function cargarTurnosOcupados() {
    var datos = localStorage.getItem("bookyTurnos");
    if (datos) {
        return JSON.parse(datos);
    }
    return [];
}

/** Guarda los turnos ocupados en localStorage */
function guardarTurnosOcupados() {
    localStorage.setItem("bookyTurnos", JSON.stringify(turnosOcupados));
}

// Inicializar arrays desde localStorage
var citas = cargarCitas();
var turnosOcupados = cargarTurnosOcupados();

// ───────────────────────────────────────────
// 3. FORMATEO DE PRECIOS EN PESOS COLOMBIANOS
// ───────────────────────────────────────────

/**
 * Formatea un numero a pesos colombianos con separador de miles.
 * Ejemplo: formatearPrecio(25000) devuelve "$25.000"
 */
function formatearPrecio(valor) {
    var str = valor.toString();
    var resultado = "";
    var contador = 0;

    for (var i = str.length - 1; i >= 0; i--) {
        resultado = str[i] + resultado;
        contador++;
        if (contador % 3 === 0 && i > 0) {
            resultado = "." + resultado;
        }
    }

    return "$" + resultado;
}

// ───────────────────────────────────────────
// 4. UTILIDAD DE FECHA
// ───────────────────────────────────────────

/** Devuelve la fecha de hoy en formato dd/mm/yyyy */
function obtenerFechaHoy() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    if (dia < 10) dia = "0" + dia;
    if (mes < 10) mes = "0" + mes;
    return dia + "/" + mes + "/" + anio;
}

/** Devuelve la fecha de hoy en formato largo legible */
function obtenerFechaLarga() {
    var hoy = new Date();
    return hoy.toLocaleDateString("es-CO", {
        weekday: "long",
        year:    "numeric",
        month:   "long",
        day:     "numeric"
    });
}

// ───────────────────────────────────────────
// 5. VARIABLES DE SELECCION ACTUAL
// ───────────────────────────────────────────

var seleccion = {
    servicio:     null,
    profesional:  null,
    horario:      null
};

// ───────────────────────────────────────────
// 6. FUNCIONES DE NAVEGACION ENTRE VISTAS
// ───────────────────────────────────────────

/** Muestra la vista del cliente y oculta el dashboard */
function mostrarVistaCliente() {
    document.getElementById("vistaCliente").classList.remove("d-none");
    document.getElementById("vistaDueno").classList.add("d-none");
    document.getElementById("btnVistaCliente").className = "btn btn-light btn-sm me-2";
    document.getElementById("btnVistaDueno").className   = "btn btn-outline-light btn-sm";
}

/** Muestra el dashboard del dueno y oculta la vista del cliente */
function mostrarVistaDueno() {
    document.getElementById("vistaCliente").classList.add("d-none");
    document.getElementById("vistaDueno").classList.remove("d-none");
    document.getElementById("btnVistaCliente").className = "btn btn-outline-light btn-sm me-2";
    document.getElementById("btnVistaDueno").className   = "btn btn-light btn-sm";
    actualizarDashboard();
}

// ───────────────────────────────────────────
// 7. FUNCIONES DE NAVEGACION ENTRE PASOS
// ───────────────────────────────────────────

/** Muestra el paso indicado (1-4 o "exito") y oculta los demas */
function irAPaso(numero) {
    var pasos = ["paso1", "paso2", "paso3", "paso4", "pasoExito"];
    for (var i = 0; i < pasos.length; i++) {
        document.getElementById(pasos[i]).classList.add("d-none");
    }

    if (numero === "exito") {
        document.getElementById("pasoExito").classList.remove("d-none");
    } else {
        document.getElementById("paso" + numero).classList.remove("d-none");
    }
}
