# 📖 BookyFlow — Explicacion tecnica del proyecto (Segundo Avance)

## 📌 Descripcion general

BookyFlow es una **aplicacion web de reservas** para negocios de servicios (barberias, salones de belleza, consultorios, etc.). En este segundo avance se agregaron mejoras funcionales importantes:

- **Persistencia de datos** con `localStorage` (las citas sobreviven recargas de pagina).
- **Control de disponibilidad real** (los horarios ya ocupados se bloquean).
- **Imagenes de profesionales** en las tarjetas de seleccion.
- **Precios en pesos colombianos** con formato de miles (ej. `$25.000`).
- **Bootstrap Icons** en lugar de emojis para una apariencia mas profesional.

---

## 📂 Estructura de archivos

```
TareaPaginaWeb/
├── index.html       ← Estructura y contenido de la pagina
├── styles.css       ← Estilos CSS adicionales
├── app.js           ← Logica de la aplicacion
├── explicacion.md   ← Este archivo de documentacion
├── contexto.md      ← Contexto del proyecto
└── img/             ← Carpeta con imagenes de profesionales
    ├── Ana.jpg
    ├── Carlos.jpg
    ├── Laura.jpg
    └── Pedro.jpg
```

---

## 🔧 Tecnologias utilizadas

| Tecnologia | Uso | Version |
|-----------|-----|---------|
| **HTML5** | Estructura semantica de la pagina | - |
| **CSS3** | Estilos visuales personalizados | - |
| **JavaScript** | Logica, datos mock, manipulacion del DOM | ES5 (vanilla) |
| **Bootstrap 5** | Framework CSS para componentes y diseño responsivo | 5.3.3 (CDN) |
| **Bootstrap Icons** | Libreria de iconos vectoriales | 1.11.3 (CDN) |

### CDNs utilizados en el `<head>`

```html
<!-- CSS de Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
```

```html
<!-- JS de Bootstrap (al final del body) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

### ¿Como se usa Bootstrap Icons?

Se insertan con la etiqueta `<i>` y una clase que empieza con `bi bi-`:

```html
<i class="bi bi-calendar3"></i>      <!-- Icono de calendario -->
<i class="bi bi-person"></i>          <!-- Icono de persona -->
<i class="bi bi-clock"></i>           <!-- Icono de reloj -->
<i class="bi bi-check-lg"></i>        <!-- Icono de palomita -->
<i class="bi bi-arrow-left"></i>      <!-- Flecha izquierda -->
<i class="bi bi-scissors"></i>        <!-- Tijeras -->
<i class="bi bi-cash"></i>            <!-- Dinero -->
<i class="bi bi-trash3"></i>          <!-- Bote de basura -->
<i class="bi bi-exclamation-triangle"></i>  <!-- Advertencia -->
```

La ventaja sobre los emojis es que los iconos son **vectoriales** (no se pixelean), tienen **tamaño consistente** y un **estilo uniforme**.

---

## 📄 Explicacion de `index.html`

### Estructura general del documento

```
<!DOCTYPE html>
<html lang="es">
  <head>               ← Metadatos + CDNs de Bootstrap y Bootstrap Icons
  <body>
    <header>           ← Encabezado con logo y navegacion
    <main>             ← Contenido principal
      <section>        ← Vista del cliente (4 pasos + exito)
      <section>        ← Vista del dueño (dashboard)
    <footer>           ← Pie de pagina
  </body>
</html>
```

### Etiquetas semanticas utilizadas

| Etiqueta | Para que sirve | Donde se usa en BookyFlow |
|----------|---------------|--------------------------|
| `<header>` | Encabezado de la pagina | Barra superior azul con "BookyFlow" y botones de navegacion |
| `<nav>` | Navegacion | Contiene los botones "Cliente" y "Panel de dueño" |
| `<main>` | Contenido principal | Envuelve la vista del cliente y el dashboard |
| `<section>` | Seccion tematica | Cada paso del flujo de reserva y el dashboard |
| `<footer>` | Pie de pagina | Barra oscura inferior con copyright |

### La tabla del dashboard

```html
<table class="table table-striped table-hover table-bordered align-middle">
    <thead class="table-dark">
        <tr>
            <th><i class="bi bi-hash"></i></th>
            <th><i class="bi bi-person"></i> Cliente</th>
            <th><i class="bi bi-scissors"></i> Servicio</th>
            <!-- ... mas columnas ... -->
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

**Clases de Bootstrap en la tabla:**

| Clase | Que hace |
|-------|---------|
| `table` | Estilo base de tabla de Bootstrap |
| `table-striped` | Alterna colores en las filas (efecto zebra) |
| `table-hover` | Resalta la fila al pasar el mouse |
| `table-bordered` | Bordes en todas las celdas |
| `table-dark` | Fondo oscuro (en el `<thead>`) |
| `table-secondary` | Fondo gris claro (en el `<tfoot>`) |
| `align-middle` | Alinea verticalmente el contenido al centro |
| `table-responsive` | Agrega scroll horizontal en pantallas chicas (en el `<div>` contenedor) |

### Imagenes de profesionales

Las imagenes se insertan con la etiqueta `<img>` dentro de las cards:

```html
<img src="img/Ana.jpg"
     alt="Foto de Ana Garcia"
     class="img-profesional mb-2"
     onerror="this.onerror=null; this.src='...';">
```

| Atributo | Que hace |
|----------|---------|
| `src` | Ruta de la imagen (carpeta `img/` + nombre del profesional) |
| `alt` | Texto alternativo que describe la imagen (accesibilidad y SEO) |
| `class` | Aplica estilos CSS (forma circular, borde, tamaño) |
| `onerror` | Si la imagen no se encuentra, muestra un placeholder SVG con la inicial del nombre |

### Card de ingresos destacada

```html
<div class="card card-ingresos mt-3">
    <div class="card-body">
        <h5 class="card-title">
            <i class="bi bi-wallet2"></i> Ingresos estimados de la semana
        </h5>
        <p class="display-6 text-success fw-bold" id="ingresosSemana">$0</p>
    </div>
</div>
```

La clase `card-ingresos` esta definida en `styles.css` y le da un fondo verde suave con un borde lateral verde para que resalte visualmente.

---

## 🎨 Explicacion de `styles.css`

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

Usa Flexbox para que el `<body>` ocupe toda la pantalla. El `<main>` se expande para llenar el espacio, empujando el `<footer>` hasta abajo.

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
| `cursor: pointer` | Cambia el cursor a "manita" al pasar encima |
| `transition` | Anima los cambios suavemente en 0.15 segundos |
| `transform: translateY(-3px)` | Mueve la card 3px hacia arriba al hacer hover |
| `box-shadow` | Agrega una sombra difusa |

### 3. Imagen circular de profesionales

```css
.img-profesional {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #dee2e6;
}
```

| Propiedad | Que hace |
|-----------|---------|
| `width/height: 100px` | Tamaño fijo de 100x100 pixeles |
| `object-fit: cover` | Recorta la imagen para que llene el cuadro sin deformarse |
| `border-radius: 50%` | Convierte el cuadro en un circulo perfecto |
| `border` | Borde gris claro alrededor del circulo |

### 4. Card de ingresos destacada

```css
.card-ingresos {
    background-color: #f0fdf4;
    border-left: 4px solid #198754;
}
```

Le da un fondo verde muy suave y una linea verde gruesa en el borde izquierdo, haciendo que resalte del resto del dashboard.

---

## ⚙️ Explicacion de `app.js`

### 📦 Seccion 1: Datos mock

Los datos se declaran como arrays de objetos. Los precios estan en **pesos colombianos**:

```javascript
var servicios = [
    { nombre: "Corte de cabello", duracion: "30 min", precio: 25000 },
    { nombre: "Manicura",         duracion: "45 min", precio: 35000 },
    // ...
];
```

Los profesionales ahora incluyen una propiedad `imagen` con la ruta al archivo:

```javascript
var profesionales = [
    { nombre: "Ana Garcia", especialidad: "Estilista", imagen: "img/Ana.jpg" },
    // ...
];
```

### 💾 Seccion 2: Persistencia con localStorage

`localStorage` es un almacenamiento del navegador que permite guardar datos como texto (strings). Los datos **persisten** aunque se cierre el navegador o se recargue la pagina.

```javascript
function cargarCitas() {
    var datos = localStorage.getItem("bookyCitas");  // Leer del storage
    if (datos) {
        return JSON.parse(datos);   // Convertir texto JSON a array/objeto
    }
    return [];   // Si no hay datos, devolver array vacio
}

function guardarCitas() {
    localStorage.setItem("bookyCitas", JSON.stringify(citas));  // Guardar como texto JSON
}
```

| Metodo | Que hace |
|--------|---------|
| `localStorage.getItem("clave")` | Lee un valor guardado (devuelve un string o `null`) |
| `localStorage.setItem("clave", "valor")` | Guarda un valor (solo acepta strings) |
| `JSON.stringify(objeto)` | Convierte un array/objeto de JavaScript a texto JSON |
| `JSON.parse(texto)` | Convierte texto JSON de vuelta a un array/objeto |

**¿Por que se necesitan `JSON.stringify` y `JSON.parse`?** Porque `localStorage` solo puede guardar **texto** (strings). Un array como `[{nombre: "Ana"}]` necesita convertirse primero a texto `'[{"nombre":"Ana"}]'` para guardarse, y luego reconvertirse al leerlo.

Se manejan **dos claves** en localStorage:

| Clave | Que guarda |
|-------|-----------|
| `bookyCitas` | Array de todas las citas confirmadas (para el dashboard) |
| `bookyTurnos` | Array de turnos ocupados (para el control de disponibilidad) |

### 💲 Seccion 3: Formateo de precios en pesos colombianos

```javascript
function formatearPrecio(valor) {
    var str = valor.toString();       // 25000 → "25000"
    var resultado = "";
    var contador = 0;

    // Recorrer el string de derecha a izquierda
    for (var i = str.length - 1; i >= 0; i--) {
        resultado = str[i] + resultado;
        contador++;
        // Cada 3 digitos, agregar un punto (separador de miles)
        if (contador % 3 === 0 && i > 0) {
            resultado = "." + resultado;
        }
    }

    return "$" + resultado;   // "$25.000"
}
```

**¿Como funciona?**
1. Convierte el numero a string: `25000` → `"25000"`
2. Recorre cada digito **de derecha a izquierda**
3. Cada 3 digitos, inserta un punto `.` como separador de miles
4. Agrega el signo `$` al inicio

| Entrada | Salida |
|---------|--------|
| `25000` | `$25.000` |
| `80000` | `$80.000` |
| `15000` | `$15.000` |

### 📅 Seccion 4: Utilidades de fecha

```javascript
function obtenerFechaHoy() {
    var hoy = new Date();
    var dia = hoy.getDate();        // Dia del mes (1-31)
    var mes = hoy.getMonth() + 1;   // Mes (0-11, por eso +1)
    var anio = hoy.getFullYear();   // Año completo (2026)
    if (dia < 10) dia = "0" + dia;  // Agregar cero a la izquierda si es menor a 10
    if (mes < 10) mes = "0" + mes;
    return dia + "/" + mes + "/" + anio;  // "05/05/2026"
}
```

**¿Por que `getMonth() + 1`?** Porque en JavaScript los meses van de **0 a 11** (enero = 0, diciembre = 11). Se le suma 1 para que sea el numero de mes normal.

### 🔒 Seccion 10: Control de disponibilidad (horarios)

Esta es la mejora mas importante del segundo avance. Antes de mostrar los horarios, se **filtran** los que ya estan ocupados:

```javascript
function renderizarHorarios() {
    var contenedor = document.getElementById("listaHorarios");
    contenedor.innerHTML = "";

    var fechaHoy = obtenerFechaHoy();
    var idxProf = seleccion.profesional;    // Indice del profesional elegido

    for (var i = 0; i < horarios.length; i++) {
        // Verificar si este horario ya esta ocupado
        var ocupado = false;
        for (var j = 0; j < turnosOcupados.length; j++) {
            var t = turnosOcupados[j];
            if (t.profesional === idxProf &&
                t.fecha === fechaHoy &&
                t.hora === horarios[i]) {
                ocupado = true;
                break;    // Ya lo encontro, no necesita seguir buscando
            }
        }

        if (ocupado) {
            // Boton deshabilitado (gris, no se puede hacer clic)
            // ...innerHTML con btn-outline-secondary y disabled...
        } else {
            // Boton activo (verde, se puede hacer clic)
            // ...innerHTML con btn-outline-success y onclick...
        }
    }
}
```

**Logica paso a paso:**
1. Obtiene la fecha de hoy y el indice del profesional seleccionado.
2. Por cada horario del array base, busca si existe un turno ocupado que coincida en los **3 criterios**: mismo profesional, misma fecha y misma hora.
3. Si esta ocupado: renderiza un boton **gris y deshabilitado** (`disabled`).
4. Si esta libre: renderiza un boton **verde y clicable**.
5. Si **todos** los horarios estan ocupados, muestra un mensaje de advertencia.

**¿Como se marca un turno como ocupado?** Al confirmar una reserva:

```javascript
turnosOcupados.push({
    profesional: seleccion.profesional,   // Indice del profesional
    fecha:       fechaHoy,                // "05/05/2026"
    hora:        hora                     // "09:00 AM"
});
guardarTurnosOcupados();   // Persiste en localStorage
```

### 🗑️ Seccion 13: Limpiar datos

```javascript
function limpiarDatos() {
    if (confirm("¿Estas seguro de que quieres eliminar todas las citas?")) {
        citas = [];
        turnosOcupados = [];
        guardarCitas();
        guardarTurnosOcupados();
        actualizarDashboard();
    }
}
```

`confirm()` muestra un cuadro de dialogo con botones "Aceptar" y "Cancelar". Devuelve `true` si el usuario acepta, `false` si cancela.

---

## 🔄 Flujo completo de la aplicacion

```
   ┌──────────────────────────────┐
   │ Pagina carga                 │
   │ cargarCitas() de localStorage│
   │ cargarTurnosOcupados()       │
   │ inicializarUI()              │
   └──────────┬───────────────────┘
              │
   ┌──────────▼──────────┐
   │ PASO 1              │
   │ Ver servicios       │──── Clic en una card
   │ (precios en COP)    │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────┐
   │ PASO 2              │
   │ Ver profesionales   │──── Clic en una card
   │ (con foto circular) │
   └──────────┬──────────┘
              │
   ┌──────────▼──────────────┐
   │ PASO 3                  │
   │ Ver horarios            │──── Clic en un boton
   │ (ocupados deshabilitados)│
   └──────────┬──────────────┘
              │
   ┌──────────▼──────────┐
   │ PASO 4              │
   │ Resumen + nombre    │──── Clic en "Confirmar"
   └──────────┬──────────┘
              │
              │ citas.push() + guardarCitas()
              │ turnosOcupados.push() + guardarTurnosOcupados()
              │
   ┌──────────▼──────────┐     ┌───────────────────────┐
   │ EXITO               │     │ PANEL DEL DUEÑO       │
   │ Mensaje de exito    │     │ Tabla + ingresos COP  │
   │ con icono check     │     │ Boton limpiar datos   │
   └─────────────────────┘     └───────────────────────┘
```

---

## 💾 Como funciona localStorage (resumen visual)

```
   GUARDAR                           LEER
   ───────                           ────
   Array JS                          localStorage
   [{...}, {...}]                     "bookyCitas" : "[{...},{...}]"
        │                                  │
        ▼ JSON.stringify()                 ▼ JSON.parse()
   Texto JSON                         Array JS
   "[{...},{...}]"                    [{...}, {...}]
        │                                  │
        ▼ localStorage.setItem()           ▼ se usa en el codigo
   Se guarda en el navegador          Se trabaja normalmente
```

---

## 📐 Sistema de grilla de Bootstrap (responsive)

| Prefijo | Tamaño de pantalla | Ancho minimo |
|---------|-------------------|-------------|
| `col-` | Extra pequeño (celulares) | < 576px |
| `col-sm-` | Pequeño | >= 576px |
| `col-md-` | Mediano (tablets) | >= 768px |
| `col-lg-` | Grande (laptops) | >= 992px |

**Servicios:** `col-md-4 col-sm-6` → 3 cards en desktop, 2 en tablet, 1 en celular.
**Profesionales:** `col-md-3 col-sm-6` → 4 cards en desktop, 2 en tablet, 1 en celular.

---

## 📝 Conceptos clave de JavaScript usados

| Concepto | Ejemplo en el proyecto | Explicacion |
|----------|----------------------|-------------|
| Variables | `var servicios = [...]` | Espacios en memoria para guardar datos |
| Arrays | `["09:00 AM", "10:00 AM"]` | Listas ordenadas de elementos |
| Objetos | `{ nombre: "Ana", imagen: "img/Ana.jpg" }` | Colecciones de pares clave-valor |
| Funciones | `function irAPaso(numero) {...}` | Bloques de codigo reutilizables |
| Ciclo for | `for (var i = 0; i < arr.length; i++)` | Repite codigo N veces |
| For anidado | Dos `for` dentro de otro | Para buscar turnos ocupados dentro de horarios |
| Condicional if/else | `if (ocupado) { ... } else { ... }` | Ejecuta codigo segun una condicion |
| Manipulacion del DOM | `document.getElementById()` | Acceder y modificar elementos HTML |
| Eventos onclick | `onclick="funcion()"` | Ejecutar codigo al hacer clic |
| Metodo push | `citas.push(objeto)` | Agrega un elemento al final de un array |
| Metodo split | `fecha.split("/")` | Divide un string en un array |
| Objeto Date | `new Date()` | Fechas y horas |
| localStorage | `localStorage.setItem()` | Almacenamiento persistente en el navegador |
| JSON.stringify | `JSON.stringify(citas)` | Convierte objetos/arrays a texto |
| JSON.parse | `JSON.parse(datos)` | Convierte texto JSON a objetos/arrays |
| Operador ternario | `(cond) ? val1 : val2` | If/else en una linea |
| Comparacion estricta | `===` | Compara valor y tipo de dato |
| break | `break;` | Sale inmediatamente de un ciclo for |
| confirm() | `confirm("¿Seguro?")` | Cuadro de confirmacion (Aceptar/Cancelar) |
| alert() | `alert("Mensaje")` | Cuadro de dialogo simple |
| onerror (img) | `onerror="..."` | Maneja errores de carga de imagenes |
| toString() | `valor.toString()` | Convierte un numero a texto |
| toFixed(2) | `precio.toFixed(2)` | Numero con 2 decimales |

---

## ❓ Preguntas frecuentes

**¿Que pasa si se borra el cache del navegador?**
Los datos de `localStorage` se eliminan. Las citas y turnos ocupados se perderan y la aplicacion comenzara como nueva.

**¿Los turnos ocupados funcionan solo para el dia de hoy?**
Si. El filtro compara la fecha del turno con la fecha de hoy. Si mañana se abre la app, todos los horarios apareceran disponibles para el nuevo dia (aunque las citas viejas siguen en el historial del dashboard).

**¿Por que se guardan los turnos ocupados SEPARADOS de las citas?**
Para hacer la busqueda de disponibilidad mas rapida y sencilla. El array `turnosOcupados` solo tiene 3 datos (profesional, fecha, hora), mientras que `citas` tiene mas informacion (cliente, servicio, precio).

**¿Que pasa si la imagen de un profesional no se encuentra?**
El atributo `onerror` del `<img>` genera un **placeholder SVG** con la inicial del nombre del profesional sobre un fondo gris. Asi la card nunca se ve rota.

**¿Por que se usa `var` en vez de `let` o `const`?**
Porque este es un proyecto de nivel introductorio. `var` es la forma clasica de declarar variables en JavaScript.
