
// ───────────────────────────────────────────
// 1. DATOS MOCK (arrays de ejemplo)
// ───────────────────────────────────────────

var servicios = [
    { nombre: "Corte de cabello",   duracion: "30 min", precio: 150 },
    { nombre: "Manicura",           duracion: "45 min", precio: 200 },
    { nombre: "Pedicura",           duracion: "50 min", precio: 250 },
    { nombre: "Tinte de cabello",   duracion: "60 min", precio: 400 },
    { nombre: "Masaje relajante",   duracion: "60 min", precio: 350 },
    { nombre: "Corte de barba",     duracion: "20 min", precio: 100 }
];

var profesionales = [
    { nombre: "Ana García",      especialidad: "Estilista" },
    { nombre: "Carlos López",    especialidad: "Barbero" },
    { nombre: "Laura Martínez",  especialidad: "Manicurista" },
    { nombre: "Pedro Sánchez",   especialidad: "Masajista" }
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

// Array donde se guardan las citas confirmadas
var citas = [];

// ───────────────────────────────────────────
// 2. VARIABLES DE SELECCIÓN ACTUAL
// ───────────────────────────────────────────

var seleccion = {
    servicio:     null,   // índice del servicio elegido
    profesional:  null,   // índice del profesional elegido
    horario:      null    // índice del horario elegido
};

// ───────────────────────────────────────────
// 3. FUNCIONES DE NAVEGACIÓN ENTRE VISTAS
// ───────────────────────────────────────────

/** Muestra la vista del cliente y oculta el dashboard */
function mostrarVistaCliente() {
    document.getElementById("vistaCliente").classList.remove("d-none");
    document.getElementById("vistaDueno").classList.add("d-none");
    // Estilos de los botones del header
    document.getElementById("btnVistaCliente").className = "btn btn-light btn-sm me-2";
    document.getElementById("btnVistaDueno").className   = "btn btn-outline-light btn-sm";
}

/** Muestra el dashboard del dueño y oculta la vista del cliente */
function mostrarVistaDueno() {
    document.getElementById("vistaCliente").classList.add("d-none");
    document.getElementById("vistaDueno").classList.remove("d-none");
    // Estilos de los botones del header
    document.getElementById("btnVistaCliente").className = "btn btn-outline-light btn-sm me-2";
    document.getElementById("btnVistaDueno").className   = "btn btn-light btn-sm";
    // Actualizar la tabla cada vez que se abre el dashboard
    actualizarDashboard();
}

// ───────────────────────────────────────────
// 4. FUNCIONES DE NAVEGACIÓN ENTRE PASOS
// ───────────────────────────────────────────

/** Muestra el paso indicado (1-4 o "exito") y oculta los demás */
function irAPaso(numero) {
    // Ocultar todos los pasos
    var pasos = ["paso1", "paso2", "paso3", "paso4", "pasoExito"];
    for (var i = 0; i < pasos.length; i++) {
        document.getElementById(pasos[i]).classList.add("d-none");
    }

    // Mostrar el paso solicitado
    if (numero === "exito") {
        document.getElementById("pasoExito").classList.remove("d-none");
    } else {
        document.getElementById("paso" + numero).classList.remove("d-none");
    }
}

// ───────────────────────────────────────────
// 5. PASO 1 – RENDERIZAR SERVICIOS
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
                        '&#9202; ' + s.duracion + '<br>' +
                        '&#128181; $' + s.precio.toFixed(2) +
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
// 6. PASO 2 – RENDERIZAR PROFESIONALES
// ───────────────────────────────────────────

/** Genera las cards de profesionales a partir del array */
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
                    '<p class="display-6">&#129489;</p>' +
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
// 7. PASO 3 – RENDERIZAR HORARIOS
// ───────────────────────────────────────────

/** Genera los botones de horarios disponibles */
function renderizarHorarios() {
    var contenedor = document.getElementById("listaHorarios");
    contenedor.innerHTML = "";

    for (var i = 0; i < horarios.length; i++) {
        var col = document.createElement("div");
        col.className = "col-auto";

        col.innerHTML =
            '<button class="btn btn-outline-success btn-horario" onclick="seleccionarHorario(' + i + ')">' +
                '&#128337; ' + horarios[i] +
            '</button>';

        contenedor.appendChild(col);
    }
}

/** Guarda el horario elegido, muestra el resumen y avanza al paso 4 */
function seleccionarHorario(indice) {
    seleccion.horario = indice;
    mostrarResumen();
    irAPaso(4);
}

// ───────────────────────────────────────────
// 8. PASO 4 – RESUMEN Y CONFIRMACIÓN
// ───────────────────────────────────────────

/** Llena los campos del resumen con la selección actual */
function mostrarResumen() {
    var servicio    = servicios[seleccion.servicio];
    var profesional = profesionales[seleccion.profesional];
    var hora        = horarios[seleccion.horario];

    // Fecha de hoy en formato legible
    var hoy = new Date();
    var fechaTexto = hoy.toLocaleDateString("es-MX", {
        weekday: "long",
        year:    "numeric",
        month:   "long",
        day:     "numeric"
    });

    document.getElementById("resServicio").textContent    = servicio.nombre;
    document.getElementById("resProfesional").textContent = profesional.nombre;
    document.getElementById("resFecha").textContent       = fechaTexto;
    document.getElementById("resHora").textContent        = hora;
    document.getElementById("resPrecio").textContent      = servicio.precio.toFixed(2);
}

/** Confirma la reserva: agrega la cita al array y muestra mensaje de éxito */
function confirmarReserva() {
    var nombreCliente = document.getElementById("inputCliente").value.trim();

    if (nombreCliente === "") {
        alert("Por favor escribe tu nombre para confirmar la cita.");
        return;
    }

    var servicio    = servicios[seleccion.servicio];
    var profesional = profesionales[seleccion.profesional];
    var hora        = horarios[seleccion.horario];

    // Fecha de hoy en formato corto
    var hoy = new Date();
    var fechaCorta = hoy.toLocaleDateString("es-MX");

    // Crear objeto de cita y agregarlo al array
    var nuevaCita = {
        cliente:     nombreCliente,
        servicio:    servicio.nombre,
        profesional: profesional.nombre,
        fecha:       fechaCorta,
        hora:        hora,
        precio:      servicio.precio
    };

    citas.push(nuevaCita);

    // Limpiar el campo de nombre
    document.getElementById("inputCliente").value = "";

    // Mostrar mensaje de éxito
    irAPaso("exito al agendar");
}

/** Reinicia el flujo de reserva para agendar otra cita */
function nuevaReserva() {
    seleccion.servicio    = null;
    seleccion.profesional = null;
    seleccion.horario     = null;
    irAPaso(1);
}

// ───────────────────────────────────────────
// 9. DASHBOARD DEL DUEÑO
// ───────────────────────────────────────────

/** Actualiza la tabla de citas y el resumen de ingresos semanales */
function actualizarDashboard() {
    var tbody = document.getElementById("tablaCitasBody");
    var tfoot = document.getElementById("tablaCitasFoot");
    tbody.innerHTML = "";

    if (citas.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="7" class="text-center text-muted">No hay citas agendadas a&uacute;n</td></tr>';
        tfoot.textContent = "Sin citas registradas";
        document.getElementById("ingresosSemana").textContent = "$0.00";
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
            '<td>$' + c.precio.toFixed(2) + '</td>';
        tbody.appendChild(fila);
    }

    // Calcular ingresos de la semana actual
    var ingresoSemanal = calcularIngresosSemana();
    tfoot.textContent = "Total citas: " + citas.length;
    document.getElementById("ingresosSemana").textContent = "$" + ingresoSemanal.toFixed(2);
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
        // Parsear la fecha de la cita
        var partes = citas[i].fecha.split("/");
        // Formato es dd/mm/yyyy
        var fechaCita = new Date(partes[2], partes[1] - 1, partes[0]);

        if (fechaCita >= lunes && fechaCita <= domingo) {
            total += citas[i].precio;
        }
    }

    return total;
}

// ───────────────────────────────────────────
// 10. INICIALIZACIÓN
// ───────────────────────────────────────────

/** Inicializa la interfaz al cargar la página */
function inicializarUI() {
    renderizarServicios();
    mostrarVistaCliente();
}

// Ejecutar al cargar
inicializarUI();
