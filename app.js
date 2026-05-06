// ===== app.js — Logica de BookyFlow (Segundo Avance) =====

// ───────────────────────────────────────────
// 1. DATOS MOCK (arrays de ejemplo)
// ───────────────────────────────────────────

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

// ───────────────────────────────────────────
// 8. PASO 1 – RENDERIZAR SERVICIOS
// ───────────────────────────────────────────

/** Genera las cards de servicios a partir del array */
function renderizarServicios() {
    var contenedor = document.getElementById("listaServicios");
    contenedor.innerHTML = "";

    for (var i = 0; i < servicios.length; i++) {
        var s = servicios[i];
        var col = document.createElement("div");
        col.className = "col-md-4 col-sm-6";

        col.innerHTML =
            '<div class="card card-seleccionable h-100" onclick="seleccionarServicio(' + i + ')">' +
                '<div class="card-body text-center">' +
                    '<h5 class="card-title">' + s.nombre + '</h5>' +
                    '<p class="card-text">' +
                        '<i class="bi bi-clock"></i> ' + s.duracion + '<br>' +
                        '<i class="bi bi-cash"></i> ' + formatearPrecio(s.precio) +
                    '</p>' +
                    '<span class="btn btn-outline-primary btn-sm">Seleccionar</span>' +
                '</div>' +
            '</div>';

        contenedor.appendChild(col);
    }
}

/** Guarda el servicio elegido y avanza al paso 2 */
function seleccionarServicio(indice) {
    seleccion.servicio = indice;
    renderizarProfesionales();
    irAPaso(2);
}

// ───────────────────────────────────────────
// 9. PASO 2 – RENDERIZAR PROFESIONALES
// ───────────────────────────────────────────

/** Genera las cards de profesionales a partir del array (con imagen) */
function renderizarProfesionales() {
    var contenedor = document.getElementById("listaProfesionales");
    contenedor.innerHTML = "";

    for (var i = 0; i < profesionales.length; i++) {
        var p = profesionales[i];
        var col = document.createElement("div");
        col.className = "col-md-3 col-sm-6";

        col.innerHTML =
            '<div class="card card-seleccionable h-100" onclick="seleccionarProfesional(' + i + ')">' +
                '<div class="card-body text-center">' +
                    '<img src="' + p.imagen + '" alt="Foto de ' + p.nombre + '" ' +
                        'class="img-profesional mb-2" ' +
                        'onerror="this.onerror=null; this.src=\'data:image/svg+xml;charset=UTF-8,' +
                        '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot;>' +
                        '<rect fill=&quot;%236c757d&quot; width=&quot;100&quot; height=&quot;100&quot;/>' +
                        '<text fill=&quot;white&quot; font-size=&quot;40&quot; x=&quot;50&quot; y=&quot;60&quot; text-anchor=&quot;middle&quot;>' +
                        p.nombre.charAt(0) +
                        '</text></svg>\';">' +
                    '<h5 class="card-title">' + p.nombre + '</h5>' +
                    '<p class="card-text text-muted">' + p.especialidad + '</p>' +
                    '<span class="btn btn-outline-primary btn-sm">Elegir</span>' +
                '</div>' +
            '</div>';

        contenedor.appendChild(col);
    }
}

/** Guarda el profesional elegido y avanza al paso 3 */
function seleccionarProfesional(indice) {
    seleccion.profesional = indice;
    renderizarHorarios();
    irAPaso(3);
}

// ───────────────────────────────────────────
// 10. PASO 3 – RENDERIZAR HORARIOS (con disponibilidad)
// ───────────────────────────────────────────

/**
 * Genera los botones de horarios disponibles.
 * Filtra los horarios que ya estan ocupados para el profesional
 * seleccionado en la fecha de hoy.
 */
function renderizarHorarios() {
    var contenedor = document.getElementById("listaHorarios");
    contenedor.innerHTML = "";

    var fechaHoy = obtenerFechaHoy();
    var idxProf = seleccion.profesional;
    var hayDisponibles = false;

    for (var i = 0; i < horarios.length; i++) {
        // Verificar si este horario ya esta ocupado
        var ocupado = false;
        for (var j = 0; j < turnosOcupados.length; j++) {
            var t = turnosOcupados[j];
            if (t.profesional === idxProf && t.fecha === fechaHoy && t.hora === horarios[i]) {
                ocupado = true;
                break;
            }
        }

        var col = document.createElement("div");
        col.className = "col-auto";

        if (ocupado) {
            // Boton deshabilitado para horarios ocupados
            col.innerHTML =
                '<button class="btn btn-outline-secondary btn-horario" disabled>' +
                    '<i class="bi bi-x-circle"></i> ' + horarios[i] +
                '</button>';
        } else {
            // Boton activo para horarios disponibles
            col.innerHTML =
                '<button class="btn btn-outline-success btn-horario" onclick="seleccionarHorario(' + i + ')">' +
                    '<i class="bi bi-clock"></i> ' + horarios[i] +
                '</button>';
            hayDisponibles = true;
        }

        contenedor.appendChild(col);
    }

    // Mensaje si no hay horarios disponibles
    if (!hayDisponibles) {
        var aviso = document.createElement("div");
        aviso.className = "col-12";
        aviso.innerHTML =
            '<div class="alert alert-warning mt-2">' +
                '<i class="bi bi-exclamation-triangle"></i> ' +
                'No hay horarios disponibles para este profesional hoy. ' +
                'Prueba con otro profesional.' +
            '</div>';
        contenedor.appendChild(aviso);
    }
}

/** Guarda el horario elegido, muestra el resumen y avanza al paso 4 */
function seleccionarHorario(indice) {
    seleccion.horario = indice;
    mostrarResumen();
    irAPaso(4);
}

// ───────────────────────────────────────────
// 11. PASO 4 – RESUMEN Y CONFIRMACION
// ───────────────────────────────────────────

/** Llena los campos del resumen con la seleccion actual */
function mostrarResumen() {
    var servicio    = servicios[seleccion.servicio];
    var profesional = profesionales[seleccion.profesional];
    var hora        = horarios[seleccion.horario];

    document.getElementById("resServicio").textContent    = servicio.nombre;
    document.getElementById("resProfesional").textContent = profesional.nombre;
    document.getElementById("resFecha").textContent       = obtenerFechaLarga();
    document.getElementById("resHora").textContent        = hora;
    document.getElementById("resPrecio").textContent      = formatearPrecio(servicio.precio);
}

/** Confirma la reserva: agrega la cita al array, guarda en localStorage */
function confirmarReserva() {
    var nombreCliente = document.getElementById("inputCliente").value.trim();

    if (nombreCliente === "") {
        alert("Por favor escribe tu nombre para confirmar la cita.");
        return;
    }

    var servicio    = servicios[seleccion.servicio];
    var profesional = profesionales[seleccion.profesional];
    var hora        = horarios[seleccion.horario];
    var fechaHoy    = obtenerFechaHoy();

    // Crear objeto de cita y agregarlo al array
    var nuevaCita = {
        cliente:     nombreCliente,
        servicio:    servicio.nombre,
        profesional: profesional.nombre,
        fecha:       fechaHoy,
        hora:        hora,
        precio:      servicio.precio
    };

    citas.push(nuevaCita);
    guardarCitas();

    // Marcar el turno como ocupado
    turnosOcupados.push({
        profesional: seleccion.profesional,
        fecha:       fechaHoy,
        hora:        hora
    });
    guardarTurnosOcupados();

    // Limpiar el campo de nombre
    document.getElementById("inputCliente").value = "";

    // Mostrar mensaje de exito
    irAPaso("exito");
}

/** Reinicia el flujo de reserva para agendar otra cita */
function nuevaReserva() {
    seleccion.servicio    = null;
    seleccion.profesional = null;
    seleccion.horario     = null;
    irAPaso(1);
}

// ───────────────────────────────────────────
// 12. DASHBOARD DEL DUENO
// ───────────────────────────────────────────

/** Actualiza la tabla de citas y el resumen de ingresos semanales */
function actualizarDashboard() {
    var tbody = document.getElementById("tablaCitasBody");
    var tfoot = document.getElementById("tablaCitasFoot");
    tbody.innerHTML = "";

    if (citas.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="7" class="text-center text-muted">' +
            '<i class="bi bi-calendar-x"></i> No hay citas agendadas aun</td></tr>';
        tfoot.textContent = "Sin citas registradas";
        document.getElementById("ingresosSemana").textContent = "$0";
        return;
    }

    // Llenar filas de la tabla
    for (var i = 0; i < citas.length; i++) {
        var c = citas[i];
        var fila = document.createElement("tr");
        fila.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + c.cliente + '</td>' +
            '<td>' + c.servicio + '</td>' +
            '<td>' + c.profesional + '</td>' +
            '<td>' + c.fecha + '</td>' +
            '<td>' + c.hora + '</td>' +
            '<td>' + formatearPrecio(c.precio) + '</td>';
        tbody.appendChild(fila);
    }

    // Calcular ingresos de la semana actual
    var ingresoSemanal = calcularIngresosSemana();
    tfoot.textContent = "Total citas: " + citas.length;
    document.getElementById("ingresosSemana").textContent = formatearPrecio(ingresoSemanal);
}

/**
 * Calcula la suma de precios de las citas cuya fecha
 * cae en la semana actual (lunes a domingo).
 */
function calcularIngresosSemana() {
    var hoy = new Date();

    // Obtener lunes de esta semana
    var diaSemana = hoy.getDay(); // 0=dom, 1=lun...
    var diffLunes = (diaSemana === 0) ? 6 : diaSemana - 1;
    var lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diffLunes);
    lunes.setHours(0, 0, 0, 0);

    // Obtener domingo de esta semana
    var domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    var total = 0;
    for (var i = 0; i < citas.length; i++) {
        var partes = citas[i].fecha.split("/");
        // Formato: dd/mm/yyyy
        var fechaCita = new Date(partes[2], partes[1] - 1, partes[0]);

        if (fechaCita >= lunes && fechaCita <= domingo) {
            total += citas[i].precio;
        }
    }

    return total;
}

// ───────────────────────────────────────────
// 13. LIMPIAR DATOS
// ───────────────────────────────────────────

/** Elimina todas las citas y turnos ocupados de localStorage */
function limpiarDatos() {
    if (confirm("¿Estas seguro de que quieres eliminar todas las citas?")) {
        citas = [];
        turnosOcupados = [];
        guardarCitas();
        guardarTurnosOcupados();
        actualizarDashboard();
    }
}

// ───────────────────────────────────────────
// 14. INICIALIZACION
// ───────────────────────────────────────────

/** Inicializa la interfaz al cargar la pagina */
function inicializarUI() {
    renderizarServicios();
    mostrarVistaCliente();
}

// Ejecutar al cargar
inicializarUI();
