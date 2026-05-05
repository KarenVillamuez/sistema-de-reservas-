# 📖 BookyFlow — Explicacion tecnica del proyecto

## 📌 Descripcion general

BookyFlow es una **aplicacion web de reservas** para negocios de servicios (barberias, salones de belleza, consultorios, etc.). Este primer avance es un **prototipo funcional con datos de ejemplo** (mock data) que demuestra dos flujos principales:

1. **Vista del cliente** — Un proceso paso a paso para agendar una cita.
2. **Panel del dueño (dashboard)** — Una tabla con todas las citas agendadas y un resumen de ingresos semanales.

Todo funciona en el navegador sin necesidad de servidor, base de datos ni instalaciones.

---

## 📂 Estructura de archivos

El proyecto se compone de **3 archivos**:

| Archivo | Descripcion |
|---------|-------------|
| `index.html` | Estructura y contenido de la pagina (HTML + Bootstrap) |
| `styles.css` | Estilos CSS adicionales (ajustes minimos) |
| `app.js` | Logica de la aplicacion en JavaScript vanilla |

---

## 🔧 Tecnologias utilizadas

| Tecnologia | Uso | Version |
|-----------|-----|---------|
| **HTML5** | Estructura semantica de la pagina | - |
| **CSS3** | Estilos visuales personalizados | - |
| **JavaScript** | Logica, datos mock, manipulacion del DOM | ES5 (vanilla) |
| **Bootstrap 5** | Framework CSS para componentes y diseño responsivo | 5.3.3 (CDN) |

Bootstrap se carga desde un **CDN** (Content Delivery Network), lo que significa que no se instala nada localmente; el navegador descarga los archivos directamente de internet:

```html
<!-- CSS de Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- JS de Bootstrap -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 📄 Explicacion de `index.html`

### Estructura general del documento

```
<!DOCTYPE html>        ← Declara que es un documento HTML5
<html lang="es">       ← Idioma español
  <head>               ← Metadatos (no visibles en pantalla)
  <body>               ← Contenido visible
    <header>           ← Encabezado con logo y navegacion
    <main>             ← Contenido principal
      <section>        ← Secciones tematicas
    <footer>           ← Pie de pagina
  </body>
</html>
```

### Etiquetas semanticas utilizadas

Las etiquetas semanticas dan **significado** al contenido. No cambian el aspecto visual, pero ayudan a los navegadores, lectores de pantalla y motores de busqueda a entender la estructura de la pagina.

| Etiqueta | Para que sirve | Donde se usa en BookyFlow |
|----------|---------------|--------------------------|
| `<header>` | Encabezado de la pagina o seccion | Barra superior azul con el nombre "BookyFlow" y los botones de navegacion |
| `<nav>` | Navegacion (enlaces o botones para moverse) | Dentro del `<header>`, contiene los botones "Cliente" y "Panel de dueño" |
| `<main>` | Contenido principal de la pagina | Envuelve toda la zona central (vista cliente + dashboard) |
| `<section>` | Seccion tematica del contenido | Cada paso del flujo de reserva (paso1 a paso4), la vista del cliente y el dashboard |
| `<footer>` | Pie de pagina | Barra oscura inferior con el copyright |

**Ejemplo en el codigo:**

```html
<header class="bg-primary text-white py-3">
    <div class="container d-flex justify-content-between align-items-center">
        <h1 class="h4 mb-0">📅 BookyFlow</h1>
        <nav>
            <button id="btnVistaCliente" ...>👤 Cliente</button>
            <button id="btnVistaDueno" ...>💼 Panel de dueño</button>
        </nav>
    </div>
</header>
```

### 📋 La tabla del dashboard

La tabla de citas en el panel del dueño usa una estructura semantica completa con tres partes:

| Parte | Etiqueta | Que contiene |
|-------|----------|-------------|
| Cabecera | `<thead>` | Los titulos de las columnas (#, Cliente, Servicio, etc.) |
| Cuerpo | `<tbody>` | Las filas con los datos de cada cita (se llenan con JS) |
| Pie | `<tfoot>` | El total de citas registradas |

```html
<table class="table table-striped table-hover table-bordered">
    <thead class="table-dark">
        <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Profesional</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Precio</th>
        </tr>
    </thead>
    <tbody id="tablaCitasBody">
        <!-- JavaScript llena las filas aqui -->
    </tbody>
    <tfoot>
        <tr class="table-secondary">
            <td colspan="7" id="tablaCitasFoot" class="text-end fw-bold">
                Sin citas registradas
            </td>
        </tr>
    </tfoot>
</table>
```

**Clases de Bootstrap usadas en la tabla:**

| Clase | Que hace |
|-------|---------|
| `table` | Aplica el estilo base de tabla de Bootstrap |
| `table-striped` | Alterna colores en las filas (zebra) para mejor legibilidad |
| `table-hover` | Resalta la fila al pasar el mouse encima |
| `table-bordered` | Agrega bordes a todas las celdas |
| `table-dark` | Fondo oscuro (usado en el `<thead>`) |
| `table-secondary` | Fondo gris claro (usado en el `<tfoot>`) |
| `table-responsive` | Envuelve la tabla en un `<div>` que agrega scroll horizontal en pantallas chicas |

### Atributo `colspan`

```html
<td colspan="7">Sin citas registradas</td>
```

`colspan="7"` hace que **una sola celda ocupe el ancho de 7 columnas**, fusionandolas en una. Se usa en el `<tfoot>` para que el mensaje de total aparezca centrado abajo de toda la tabla.

### 🔤 Entity codes (codigos de entidad)

En HTML, algunos caracteres especiales se escriben con codigos de entidad para que el navegador los interprete correctamente:

| Codigo | Resultado | Descripcion |
|--------|-----------|-------------|
| `&ndash;` | – | Guion medio (en-dash) |
| `&copy;` | © | Simbolo de copyright |
| `&bull;` | • | Viñeta (bullet) |
| `&larr;` | ← | Flecha izquierda |
| `&ntilde;` | ñ | Letra eñe |
| `&aacute;` | a | Letra a con acento |
| `&#128197;` | 📅 | Emoji de calendario (codigo numerico) |
| `&#10004;` | ✔ | Marca de verificacion |

Los que empiezan con `&#` seguido de un **numero** son codigos numericos Unicode. Los que empiezan con `&` seguido de un **nombre** son entidades con nombre.

### 🎨 Clases de Bootstrap mas usadas

| Clase | Que hace |
|-------|---------|
| `container` | Centra el contenido y le pone un ancho maximo responsivo |
| `row` | Crea una fila del sistema de grilla (grid) |
| `col-md-4` | Columna que ocupa 4/12 del ancho en pantallas medianas o mas grandes |
| `col-sm-6` | Columna que ocupa 6/12 del ancho en pantallas pequeñas o mas grandes |
| `d-flex` | Activa Flexbox en el elemento |
| `justify-content-between` | Distribuye los hijos con espacio entre ellos |
| `align-items-center` | Alinea verticalmente al centro |
| `d-none` | Oculta el elemento (`display: none`) |
| `btn` | Estilo base de boton |
| `btn-primary` | Boton azul |
| `btn-success` | Boton verde |
| `btn-secondary` | Boton gris |
| `btn-outline-primary` | Boton con borde azul y fondo transparente |
| `card` | Componente tarjeta de Bootstrap |
| `card-body` | Contenido interior de una tarjeta |
| `card-title` | Titulo de una tarjeta |
| `alert alert-success` | Cuadro de alerta verde |
| `mb-3` | Margen inferior (margin-bottom) de tamaño 3 |
| `mt-3` | Margen superior (margin-top) de tamaño 3 |
| `my-4` | Margen vertical (arriba y abajo) de tamaño 4 |
| `py-3` | Padding vertical de tamaño 3 |
| `me-2` | Margen derecho (margin-end) de tamaño 2 |
| `ms-2` | Margen izquierdo (margin-start) de tamaño 2 |
| `text-center` | Centra el texto |
| `text-end` | Alinea el texto a la derecha |
| `text-muted` | Texto en color gris claro |
| `fw-bold` | Texto en negritas (font-weight bold) |
| `h-100` | Altura al 100% del contenedor padre |
| `g-3` | Gap (espacio) de tamaño 3 entre columnas de la grilla |

El sistema de grilla de Bootstrap divide cada fila en **12 columnas**. `col-md-4` significa "ocupa 4 de 12 columnas" = un tercio del ancho.

---

## 🎨 Explicacion de `styles.css`

Este archivo es **muy corto** porque Bootstrap ya maneja la mayoria de los estilos. Solo se agregan 3 ajustes:

### 1. Footer pegado al fondo (sticky footer)

```css
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
}
```

**Que hace:** Usa Flexbox para que el `<body>` ocupe al menos toda la pantalla (`100vh` = 100% del alto de la ventana). El `<main>` se expande (`flex: 1`) para llenar el espacio disponible, empujando el `<footer>` hasta abajo.

**Sin esto:** Si el contenido es poco, el footer quedaria flotando a media pantalla.

### 2. Cards clicables con efecto hover

```css
.card-seleccionable {
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card-seleccionable:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

| Propiedad | Que hace |
|-----------|---------|
| `cursor: pointer` | Cambia el cursor a "manita" para indicar que se puede hacer clic |
| `transition` | Hace que los cambios de estilo sean suaves (animados en 0.15 segundos) |
| `transform: translateY(-3px)` | Mueve la card 3 pixeles hacia arriba al pasar el mouse |
| `box-shadow` | Agrega una sombra difusa debajo de la card al hacer hover |

### 3. Ancho minimo para botones de horario

```css
.btn-horario {
    min-width: 100px;
}
```

Esto asegura que todos los botones de horario tengan al menos 100px de ancho para que se vean uniformes.

---

## ⚙️ Explicacion de `app.js`

Este archivo contiene **toda la logica** de la aplicacion. Esta organizado en 10 secciones numeradas.

### 📦 Seccion 1: Datos mock (arrays de ejemplo)

Los datos estan almacenados en **arrays de objetos** declarados con `var`:

```javascript
var servicios = [
    { nombre: "Corte de cabello", duracion: "30 min", precio: 150 },
    { nombre: "Manicura",         duracion: "45 min", precio: 200 },
    // ...
];
```

| Array | Tipo de dato | Propiedades de cada objeto |
|-------|-------------|---------------------------|
| `servicios` | Array de objetos | `nombre` (string), `duracion` (string), `precio` (number) |
| `profesionales` | Array de objetos | `nombre` (string), `especialidad` (string) |
| `horarios` | Array de strings | Cada elemento es una hora como `"09:00 AM"` |
| `citas` | Array vacio `[]` | Se llena al confirmar una reserva con objetos que tienen: `cliente`, `servicio`, `profesional`, `fecha`, `hora`, `precio` |

**¿Por que se usa `var`?** Porque es la forma basica de declarar variables en JavaScript. Tambien existen `let` y `const` (versiones mas modernas), pero `var` es el nivel introductorio.

### 📦 Seccion 2: Variable de seleccion actual

```javascript
var seleccion = {
    servicio:     null,
    profesional:  null,
    horario:      null
};
```

Este **objeto** guarda los **indices** (posiciones en el array) de lo que el usuario ha seleccionado en cada paso. Se inicializa en `null` (nada seleccionado).

### 🔀 Seccion 3: Navegacion entre vistas (Cliente / Dueño)

```javascript
function mostrarVistaCliente() {
    document.getElementById("vistaCliente").classList.remove("d-none");
    document.getElementById("vistaDueno").classList.add("d-none");
    // ...
}
```

**¿Como funciona el mostrar/ocultar?**

Se usa la clase `d-none` de Bootstrap, que aplica `display: none` al elemento. Para **mostrar** algo, se le **quita** la clase `d-none`. Para **ocultar** algo, se le **agrega**.

| Metodo | Que hace |
|--------|---------|
| `document.getElementById("id")` | Busca un elemento HTML por su atributo `id` |
| `.classList.add("clase")` | Agrega una clase CSS al elemento |
| `.classList.remove("clase")` | Quita una clase CSS del elemento |

### 🔢 Seccion 4: Navegacion entre pasos (1 → 2 → 3 → 4 → exito)

```javascript
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
```

**Paso a paso:**
1. Define un array con los IDs de todos los pasos.
2. Recorre el array con un `for` y **oculta todos** agregando `d-none`.
3. Luego **muestra solo el paso solicitado** quitando `d-none`.
4. Usa **concatenacion** (`"paso" + numero`) para construir el ID dinamicamente. Si `numero` es `2`, se convierte en `"paso2"`.

### 🏗️ Secciones 5, 6 y 7: Renderizar servicios, profesionales y horarios

Las tres funciones siguen el **mismo patron**:

```javascript
function renderizarServicios() {
    var contenedor = document.getElementById("listaServicios");
    contenedor.innerHTML = "";                     // 1. Limpiar el contenedor

    for (var i = 0; i < servicios.length; i++) {   // 2. Recorrer el array
        var s = servicios[i];
        var col = document.createElement("div");   // 3. Crear un elemento <div>
        col.className = "col-md-4 col-sm-6";       // 4. Asignarle clases

        col.innerHTML = '...HTML de la card...';    // 5. Poner el HTML interno

        contenedor.appendChild(col);               // 6. Agregarlo al contenedor
    }
}
```

**Metodos del DOM utilizados:**

| Metodo | Que hace |
|--------|---------|
| `document.getElementById("id")` | Obtiene un elemento por su ID |
| `document.createElement("tag")` | Crea un nuevo elemento HTML en memoria |
| `elemento.innerHTML = "..."` | Establece el contenido HTML interno de un elemento |
| `elemento.className = "..."` | Establece las clases CSS del elemento |
| `contenedor.appendChild(hijo)` | Agrega un elemento hijo al final del contenedor |

**¿Que es `.innerHTML = ""`?** Limpiar el contenido previo antes de volver a llenar el contenedor. Si no se hace esto, cada vez que se llame a la funcion se duplicarian las cards.

**¿Como se pasa el indice al hacer clic?** Se usa concatenacion para construir el atributo `onclick`:

```javascript
'onclick="seleccionarServicio(' + i + ')"'
```

Si `i` vale `2`, el resultado es `onclick="seleccionarServicio(2)"`. Asi JavaScript sabe que servicio se eligio.

### ✅ Seccion 8: Resumen y confirmacion

**`mostrarResumen()`** — Accede a los arrays con los indices guardados en `seleccion` y pone los datos en el HTML:

```javascript
var servicio = servicios[seleccion.servicio];  // Acceder al objeto por indice
document.getElementById("resServicio").textContent = servicio.nombre;
```

`.textContent` es similar a `.innerHTML`, pero inserta **solo texto plano** (sin interpretar HTML). Es mas seguro cuando el contenido viene de datos del usuario.

**Formato de fecha:** Se usa `toLocaleDateString("es-MX", opciones)` para mostrar la fecha en español:

```javascript
var hoy = new Date();   // Crea un objeto con la fecha/hora actual
var fechaTexto = hoy.toLocaleDateString("es-MX", {
    weekday: "long",    // "lunes", "martes", etc.
    year:    "numeric", // "2026"
    month:   "long",    // "abril"
    day:     "numeric"  // "28"
});
// Resultado: "lunes, 28 de abril de 2026"
```

**`confirmarReserva()`** — Valida el nombre, crea un objeto de cita y lo agrega al array:

```javascript
var nombreCliente = document.getElementById("inputCliente").value.trim();

if (nombreCliente === "") {
    alert("Por favor escribe tu nombre para confirmar la cita.");
    return;   // Detiene la ejecucion de la funcion
}

var nuevaCita = {
    cliente:     nombreCliente,
    servicio:    servicio.nombre,
    profesional: profesional.nombre,
    fecha:       fechaCorta,
    hora:        hora,
    precio:      servicio.precio
};

citas.push(nuevaCita);   // Agrega el objeto al final del array
```

| Metodo/Propiedad | Que hace |
|-----------------|---------|
| `.value` | Obtiene el texto escrito en un `<input>` |
| `.trim()` | Quita espacios en blanco al inicio y al final del texto |
| `alert()` | Muestra un cuadro de dialogo con un mensaje |
| `return` | Sale de la funcion inmediatamente (no ejecuta el codigo que viene despues) |
| `.push()` | Agrega un elemento al final de un array |

### 📊 Seccion 9: Dashboard del dueño

**`actualizarDashboard()`** — Recorre el array `citas` y genera filas de la tabla:

```javascript
for (var i = 0; i < citas.length; i++) {
    var c = citas[i];
    var fila = document.createElement("tr");   // Crea una fila <tr>
    fila.innerHTML =
        '<td>' + (i + 1) + '</td>' +           // Numero de fila
        '<td>' + c.cliente + '</td>' +          // Nombre del cliente
        '<td>' + c.servicio + '</td>' +         // Servicio
        '<td>' + c.profesional + '</td>' +      // Profesional
        '<td>' + c.fecha + '</td>' +            // Fecha
        '<td>' + c.hora + '</td>' +             // Hora
        '<td>$' + c.precio.toFixed(2) + '</td>';// Precio con 2 decimales
    tbody.appendChild(fila);
}
```

**`.toFixed(2)`** — Convierte un numero a string con exactamente 2 decimales. Ejemplo: `150` se convierte en `"150.00"`.

**`calcularIngresosSemana()`** — Suma los precios de las citas que caen en la semana actual:

```javascript
// Obtener el lunes de esta semana
var diaSemana = hoy.getDay();  // 0=domingo, 1=lunes, ..., 6=sabado
var diffLunes = (diaSemana === 0) ? 6 : diaSemana - 1;
var lunes = new Date(hoy);
lunes.setDate(hoy.getDate() - diffLunes);
lunes.setHours(0, 0, 0, 0);   // Inicio del dia (00:00:00)

// Obtener el domingo de esta semana
var domingo = new Date(lunes);
domingo.setDate(lunes.getDate() + 6);
domingo.setHours(23, 59, 59, 999);   // Fin del dia (23:59:59)
```

Luego compara la fecha de cada cita contra el rango lunes-domingo y suma el precio si esta dentro.

**Operador ternario** `(condicion) ? valorSi : valorNo`:

```javascript
var diffLunes = (diaSemana === 0) ? 6 : diaSemana - 1;
```

Es equivalente a:

```javascript
var diffLunes;
if (diaSemana === 0) {
    diffLunes = 6;         // Si es domingo, retroceder 6 dias
} else {
    diffLunes = diaSemana - 1;   // Si es otro dia, retroceder menos
}
```

### 🚀 Seccion 10: Inicializacion

```javascript
function inicializarUI() {
    renderizarServicios();    // Genera las cards de servicios
    mostrarVistaCliente();    // Muestra la vista del cliente
}

inicializarUI();   // Se ejecuta automaticamente al cargar la pagina
```

Cuando el navegador llega a esta linea, llama a `inicializarUI()` inmediatamente. No necesita esperar a ningun evento porque el `<script>` esta al **final del `<body>`**, asi que para ese momento todo el HTML ya existe en la pagina.

---

## 🔄 Flujo completo de la aplicacion

```
   ┌─────────────────┐
   │ Pagina carga    │
   │ inicializarUI() │
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │ PASO 1          │
   │ Ver servicios   │──── Clic en una card
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │ PASO 2          │
   │ Ver profesional │──── Clic en una card
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │ PASO 3          │
   │ Ver horarios    │──── Clic en un boton
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │ PASO 4          │
   │ Resumen + nombre│──── Clic en "Confirmar"
   └────────┬────────┘
            │
            │ citas.push(nuevaCita)
            │
   ┌────────▼────────┐     ┌──────────────────────┐
   │ EXITO           │     │ PANEL DEL DUEÑO      │
   │ Mensaje verde   │     │ Tabla con las citas   │
   └─────────────────┘     │ + ingresos semanales  │
                           └──────────────────────┘
```

Cada paso tiene un boton **"Volver"** que llama a `irAPaso()` con el numero del paso anterior, permitiendo al usuario regresar y cambiar su seleccion.

---

## 📐 Sistema de grilla de Bootstrap (responsive)

Bootstrap divide cada fila (`row`) en **12 columnas**. Las clases `col-XX-N` indican cuantas columnas ocupa un elemento segun el tamaño de pantalla:

| Prefijo | Tamaño de pantalla | Ancho minimo |
|---------|-------------------|-------------|
| `col-` | Extra pequeño (celulares) | < 576px |
| `col-sm-` | Pequeño | >= 576px |
| `col-md-` | Mediano (tablets) | >= 768px |
| `col-lg-` | Grande (laptops) | >= 992px |

**Ejemplo en el proyecto:**

```html
<div class="col-md-4 col-sm-6">
```

- En pantallas **medianas o mas grandes**: ocupa 4/12 = **33%** del ancho (caben 3 cards por fila).
- En pantallas **pequeñas**: ocupa 6/12 = **50%** del ancho (caben 2 cards por fila).
- En pantallas **extra pequeñas**: ocupa 12/12 = **100%** del ancho (1 card por fila, es el comportamiento por defecto).

---

## 📝 Conceptos clave de JavaScript usados

| Concepto | Ejemplo en el proyecto | Explicacion |
|----------|----------------------|-------------|
| Variables | `var servicios = [...]` | Espacios en memoria para guardar datos |
| Arrays | `["09:00 AM", "10:00 AM"]` | Listas ordenadas de elementos |
| Objetos | `{ nombre: "Ana", especialidad: "Estilista" }` | Colecciones de pares clave-valor |
| Funciones | `function irAPaso(numero) {...}` | Bloques de codigo reutilizables |
| Ciclo for | `for (var i = 0; i < arr.length; i++)` | Repite codigo N veces |
| Condicional if/else | `if (nombre === "") { ... }` | Ejecuta codigo solo si se cumple una condicion |
| Manipulacion del DOM | `document.getElementById()` | Acceder y modificar elementos de la pagina |
| Eventos onclick | `onclick="funcion()"` | Ejecutar codigo al hacer clic |
| Metodo push | `citas.push(objeto)` | Agrega un elemento al final de un array |
| Metodo split | `fecha.split("/")` | Divide un string en un array usando un separador |
| Objeto Date | `new Date()` | Representa fechas y horas |
| Template strings | Concatenacion con `+` | Construir cadenas de texto dinamicamente |
| Operador ternario | `(cond) ? val1 : val2` | If/else abreviado en una linea |
| Comparacion estricta | `===` | Compara valor **y** tipo de dato |

---

## ❓ Preguntas frecuentes

**¿Por que los datos se pierden al recargar la pagina?**
Porque los arrays estan en memoria RAM. Al recargar, JavaScript se ejecuta de nuevo y los arrays vuelven a su estado inicial (vacio para `citas`). En el segundo avance se usara `localStorage` para persistir los datos.

**¿Por que se usa `var` en vez de `let` o `const`?**
Porque este es un proyecto de nivel introductorio. `var` es la forma clasica de declarar variables en JavaScript. `let` y `const` son mas modernos (ES6+) y ofrecen mejores practicas, pero no se requieren para este avance basico.

**¿Por que el `<script>` esta al final del `<body>`?**
Para que todo el HTML ya exista en la pagina cuando JavaScript se ejecuta. Si estuviera en el `<head>`, `document.getElementById()` no encontraria los elementos porque aun no se habrian creado.

**¿Que significa "mock data"?**
Son datos falsos/de ejemplo creados manualmente para simular una funcionalidad real. Aqui los servicios, profesionales y horarios son inventados para demostrar como funcionaria la app con datos reales.
