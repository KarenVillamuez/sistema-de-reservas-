# BookyFlow – Plataforma básica de reservas

## 🎯 Objetivo del proyecto
Crear una aplicación web sencilla que sirva como puente digital entre un negocio de servicios (barbería, consultorio, etc.) y sus clientes.  
La meta es eliminar la dependencia de WhatsApp para agendar citas, mostrando una interfaz clara para el cliente y un panel de control para el dueño.

## 🧱 Tecnologías y restricciones
- Solo HTML, CSS y JavaScript plano.
- Bootstrap 5 (CDN) para estilos y componentes.
- **Sin instalaciones externas de software** (no se usará Node, npm, ni bases de datos como MySQL o MongoDB).
- Para persistencia futura se podría usar `localStorage` del navegador.
- En el **primer avance** todos los datos serán mock (arrays duros en JavaScript).

## 🧩 Funcionalidades esperadas (versión final simplificada)
### Lado del cliente (página pública)
1. Ver lista de servicios disponibles (ej. “Corte de cabello”, “Manicura”).
2. Seleccionar un profesional/barbero.
3. Escoger una fecha y un horario disponible.
4. Confirmar la reserva y ver un mensaje de éxito.

### Lado del dueño (dashboard)
1. Ver una tabla con todas las citas agendadas (cliente, servicio, profesional, fecha, hora).
2. Ver un resumen del ingreso estimado de la semana.

## 📦 Primer avance – Entregable
Crear la estructura base del proyecto con mockups totalmente funcionales usando datos falsos.

### Entregables concretos:
- `index.html`: estructura semántica con Bootstrap, enlaza `styles.css` y `app.js`.
- `app.js`: arrays con datos mock de servicios, profesionales, citas y horarios.
- Navegación simulada (puede ser un solo HTML con secciones que se muestran/ocultan con JS o páginas separadas simples).
- Pantalla de **cliente**: selección de servicio → selección de profesional → selección de horario → confirmación.
- Pantalla de **dashboard**: tabla de citas agendadas (usa la etiqueta `<table>` del contexto.md) y un resumen de ingresos semanales.

### Requisitos técnicos del avance
- Utilizar etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, etc.) como se vio en el contexto.
- Incluir al menos una tabla bien estructurada con `<thead>`, `<tbody>`, `<tfoot>` (para las citas).
- Aplicar clases de Bootstrap para diseño responsivo y componentes (botones, cards, formularios básicos).
- Todo el contenido dinámico debe generarse desde los arrays mock en JavaScript.

## ⏳ Próximo avance (NO incluido ahora)
Integrar almacenamiento en `localStorage` para que las reservas persistan y se reflejen en el dashboard, y posiblemente un sistema muy simple de filtrado. Eso se abordará en el segundo prompt.