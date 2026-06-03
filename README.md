# 📅 BookyFlow — Sistema de Reservas

Una plataforma web moderna y responsiva para gestionar reservas en negocios de servicios (barberias, salones de belleza, consultorios, etc.).

![Versión](https://img.shields.io/badge/version-v3.0-blue)
![Licencia](https://img.shields.io/badge/license-MIT-green)
![Estado](https://img.shields.io/badge/status-mantenido-brightgreen)

---

## 🎯 Características

### Para Clientes
✅ Seleccionar servicio deseado  
✅ Elegir profesional  
✅ Escoger horario disponible  
✅ Confirmar reserva con nombre  
✅ Ver horarios bloqueados (en tiempo real)  

### Para Propietarios
✅ Ver todas las citas agendadas  
✅ Cancelar citas individuales  
✅ Calcular ingresos semanales  
✅ Limpiar todos los datos  
✅ Dashboard intuitivo  

---

## 🚀 Inicio Rápido

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CDNs de Bootstrap)
- No requiere instalacion o configuracion adicional

### Como usar
1. **Descarga o clona el repositorio**
   ```bash
   git clone https://github.com/usuario/sistema-de-reservas.git
   cd sistema-de-reservas
   ```

2. **Abre el archivo en tu navegador**
   ```
   Abre el archivo `index.html` en tu navegador favorito
   O: Click derecho → Abrir con → Navegador web
   ```

3. **¡Comienza a usar!**
   - Vista **Cliente**: Realiza una reserva completando los 4 pasos
   - Vista **Propietario**: Accede al panel para gestionar citas

---

## 📂 Estructura del Proyecto

```
sistema-de-reservas-/
│
├── 📄 index.html           # Pagina principal (HTML5 semantico)
├── 🎨 styles.css           # Estilos CSS personalizados (v3)
├── ⚙️  app.js              # Logica de la aplicacion
│
├── 📖 README.md            # Este archivo
├── 📋 CHANGELOG.md         # Historial de versiones
├── 📝 explicacion.md       # Documentacion tecnica
├── 📌 contexto.md          # Contexto del proyecto
│
└── 🖼️  img/                # Imagenes de profesionales
    ├── Ana.jpg
    ├── Carlos.jpg
    ├── Laura.jpg
    └── Pedro.jpg
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnologia | Proposito |
|-----------|----------|
| **HTML5** | Estructura semantica |
| **CSS3** | Estilos y diseño |
| **JavaScript (ES5)** | Logica y dinamica |
| **Bootstrap 5** | Framework CSS (CDN) |
| **Bootstrap Icons** | Conjunto de iconos |

### CDNs usados
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 💾 Persistencia de Datos

Los datos se almacenan **localmente** en el navegador usando `localStorage`:

- **bookyCitas**: Citas confirmadas por clientes
- **bookyTurnos**: Turnos occupados para control de disponibilidad

✅ **Ventajas**: Los datos persisten sin servidor  
⚠️ **Limitacion**: Se borran si limpias cache del navegador  

---

## 📊 Datos Incluidos

### Servicios Disponibles
| Servicio | Duración | Precio |
|----------|----------|--------|
| Corte de cabello | 30 min | $25.000 |
| Manicura | 45 min | $35.000 |
| Pedicura | 50 min | $40.000 |
| Tinte de cabello | 60 min | $80.000 |
| Masaje relajante | 60 min | $60.000 |
| Corte de barba | 20 min | $15.000 |

### Profesionales
- 👩 **Ana Garcia** - Estilista
- 👨 **Carlos Lopez** - Barbero
- 💅 **Laura Martinez** - Manicurista
- 🧘 **Pedro Sanchez** - Masajista

### Horarios
De 09:00 AM a 05:00 PM (9 franjas disponibles)

---

## 🔐 Validaciones

✓ Nombre del cliente: 2-100 caracteres  
✓ Horarios ocupados bloqueados automáticamente  
✓ Confirmacion antes de cancelar citas  
✓ Confirmacion antes de limpiar todos los datos  
✓ Validacion de campos obligatorios  

---

## 🎨 Diseño y UX

- **Colores consistentes**: Tema profesional con azul y tonos neutros
- **Animaciones suaves**: Transiciones entre vistas y efectos hover
- **Responsive**: Optimizado para desktop, tablet y móvil
- **Accesibilidad**: Iconos Bootstrap para mejor UX
- **Gradientes**: Design moderno en card de ingresos

---

## 📱 Responsive Design

| Dispositivo | Breakpoint | Optimizacion |
|-----------|-----------|---------|
| Mobile | < 576px | Fonts reducidos, padding menor |
| Tablet | 576px - 768px | Botones adaptados |
| Desktop | > 768px | Diseño completo |

---

## 🐛 Problemas Resueltos

| v1 | v2 | v3 |
|----|----|----|
| - | Persistencia | **Eliminacion de citas** |
| - | Horarios bloqueados | **Validacion mejorada** |
| - | Imagenes profesionales | **Estilos CSS profesionales** |
| - | Precios formateados | **Mejor UX/UI** |

---

## 🚀 Proximo Avance (v4)

- [ ] Seleccionar fechas futuras (no solo hoy)
- [ ] Filtrador de citas
- [ ] Editar citas existentes
- [ ] Integracion con calendarios
- [ ] Sistema de login simple
- [ ] Envio de confirmaciones email (requeriria backend)

---

## 📸 Screenshots

### Vista Cliente (Paso 1)
Selecciona un servicio con precio y duracion

### Vista Cliente (Paso 4)
Confirma tu reserva antes de agendar

### Dashboard Propietario
Tabla de citas + Resumen de ingresos semanales

---

## 💡 Tips de Uso

### Para propietarios
1. Accede al panel desde el botón "Panel de dueño" en el header
2. Revisa todas las citas agendadas en la tabla
3. Cancela citas problematicas usando el botón 🗑️ rojo
4. Ve el total de ingresos de la semana actual
5. Usa "Limpiar todas las citas" solo como ultimo recurso

### Para clientes
1. Completa los 4 pasos sin volver atras (o usa botones "Volver")
2. Asegúrate de escribir tu nombre correctamente
3. Verifica que el horario no este bloqueado
4. Confirma el resumen antes de finalizar

---

## 🤝 Contribuir

¿Quieres mejorar BookyFlow? ¡Bienvenido!

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE). ¡Usa y modifica libremente!

---

## 📞 Contacto y Soporte

- 📧 Email: info@bookyflow.com
- 🐛 Reportar bugs: [Issues](https://github.com/usuario/sistema-de-reservas/issues)
- 💬 Sugerencias: Crea una discussion

---

## 🙏 Creditos

Desarrollado con ❤️ por el equipo de **BookyFlow**

Tecnologias:
- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

---

## 📚 Documentacion Adicional

- [Explicacion Tecnica](explicacion.md) - Detalles técnicos del proyecto
- [Changelog](CHANGELOG.md) - Historial de cambios
- [Contexto](contexto.md) - Antecedentes del proyecto

---

**Version**: v3.0 | **Actualizado**: 2 de junio de 2026

🌟 **Si te gusta este proyecto, dale una ⭐ en GitHub!**
