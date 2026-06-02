# Guía de Sustentación del Proyecto — BookyFlow

Este documento contiene la explicación detallada del código implementado en el panel del dueño (**Dashboard.tsx**). Está diseñado para ser presentado y defendido ante el profesor, dividido equitativamente para **Ángela, Diana y Karen**.

---

## 👥 Distribución para la Sustentación

### 🧑‍💻 Ángela: Control de Acceso y Persistencia de Sesión (Login)
* **Tema:** Sistema de Autenticación para el Panel del Dueño.
* **Componentes clave:** Estados de login, validación de credenciales, persistencia con `localStorage` y renderizado condicional de la vista.

### 🧑‍💻 Diana: Interacción Fluida y Modales de Confirmación
* **Tema:** Reemplazo de alertas nativas por ventanas emergentes personalizadas (Modales en React).
* **Componentes clave:** Estados de control del modal, paso de callbacks para acciones asíncronas (`cancelarCita` y `limpiarDatos`) y diseño responsivo del modal.

### 🧑‍💻 Karen: Inteligencia de Negocio y Gráficos Dinámicos
* **Tema:** Gráfica de barras interactiva de ventas semanales.
* **Componentes clave:** Cálculo dinámico de fechas ISO de la semana en JavaScript, agregación/reducción de datos de ventas (`reduce`) y renderizado proporcional mediante flexbox reactivo.

---

## 🔍 Explicación Detallada Línea por Línea por Integrante

### 🧑‍💻 Explicación de código: Ángela (Login)

Este bloque de código se encarga de proteger el panel administrativo para evitar que clientes u otros usuarios puedan cancelar citas o ver la contabilidad.

#### Código Explicado:
1. **Inicialización del Estado de Autenticación:**
   ```typescript
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
     return localStorage.getItem("bf_owner_auth") === "true";
   });
   ```
   * **Explicación:** Se define un estado de tipo booleano (`isAuthenticated`). Usamos un *lazy initializer* (una función dentro del `useState`) para leer el estado guardado en el disco del navegador a través de la API `localStorage`. Si el usuario ya se había autenticado antes, el valor será `"true"` y la sesión se mantendrá activa al recargar la página.

2. **Captura de Inputs y Manejo de Errores:**
   ```typescript
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [loginError, setLoginError] = useState("");
   ```
   * **Explicación:** Tres estados simples de tipo string para capturar lo que escribe el usuario en tiempo real en los campos del formulario y gestionar mensajes de error en caso de que las credenciales sean inválidas.

3. **Función Controladora del Login (`handleLogin`):**
   ```typescript
   function handleLogin(e: React.FormEvent) {
     e.preventDefault();
     if (username === "admin" && password === "admin123") {
       setIsAuthenticated(true);
       localStorage.setItem("bf_owner_auth", "true");
       setLoginError("");
     } else {
       setLoginError("Usuario o contraseña incorrectos");
     }
   }
   ```
   * **Explicación:**
     * `e.preventDefault()`: Detiene la recarga por defecto que hace el navegador al enviar un formulario.
     * Evaluamos si `username` es igual a `"admin"` y `password` a `"admin123"`. Si es correcto, cambiamos el estado `isAuthenticated` a `true` y guardamos esa marca en `localStorage`. De lo contrario, activamos el mensaje de error.

4. **Función de Cerrar Sesión (`handleLogout`):**
   ```typescript
   function handleLogout() {
     setIsAuthenticated(false);
     localStorage.removeItem("bf_owner_auth");
     setUsername("");
     setPassword("");
   }
   ```
   * **Explicación:** Limpia tanto los estados reactivos como el valor de `localStorage`, forzando a la aplicación a volver a mostrar la pantalla de Login.

5. **Renderizado Condicional (Bloqueador de Vista):**
   ```typescript
   if (!isAuthenticated) {
     return ( ... formulario de login HTML/Bootstrap ... )
   }
   ```
   * **Explicación:** Si el estado `isAuthenticated` es falso, la función del componente se interrumpe prematuramente retornando la tarjeta de inicio de sesión, impidiendo que el resto del código del panel se ejecute o renderice en el navegador.

---

### 🧑‍💻 Explicación de código: Diana (Modales Personalizados)

Este bloque reemplaza la función bloqueante `window.confirm()` por componentes interactivos que flotan sobre el contenido sin congelar el hilo principal de ejecución del navegador.

#### Código Explicado:

1. **Definición de Estados del Modal:**
   ```typescript
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [modalTitle, setModalTitle] = useState("");
   const [modalMessage, setModalMessage] = useState("");
   const [modalAction, setModalAction] = useState<(() => void) | null>(null);
   const [modalType, setModalType] = useState<"danger" | "warning">("danger");
   ```
   * **Explicación:** 
     * `showConfirmModal`: Controla si el modal es visible u oculto.
     * `modalTitle` y `modalMessage`: Definen el texto dinámico que mostrará la tarjeta.
     * `modalAction`: Guarda la **función (callback)** que debe ejecutarse si el usuario pulsa en "Sí, continuar".
     * `modalType`: Define la paleta de colores de Bootstrap a usar (`warning` para cancelaciones individuales y `danger` para eliminar toda la base de datos).

2. **Controlador de Cancelación de Cita (`handleConfirmarCancelarCita`):**
   ```typescript
   function handleConfirmarCancelarCita(cita: Cita) {
     setModalTitle("Confirmar cancelación");
     setModalMessage(`¿Deseas cancelar la cita agendada para "${cita.cliente}"...?`);
     setModalType("warning");
     setModalAction(() => async () => {
       setCancelando(cita.id);
       try {
         await cancelarCita(cita.id);
         // Lógica para recargar las citas...
       } catch (err) { ... }
     });
     setShowConfirmModal(true);
   }
   ```
   * **Explicación:** En lugar de llamar a `window.confirm()`, esta función define qué datos tendrá el modal y guarda la acción asíncrona dentro del estado `modalAction` utilizando una función envolvente `() => async () => { ... }`. Finalmente, activa `showConfirmModal` a `true` para renderizar el modal en pantalla.

3. **Estructura e Inyección del Modal en el HTML:**
   ```typescript
   {showConfirmModal && (
     <>
       <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
       <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
         {/* ... Contenido del modal ... */}
         <button onClick={() => {
           if (modalAction) modalAction();
           setShowConfirmModal(false);
         }}>Sí, continuar</button>
       </div>
     </>
   )}
   ```
   * **Explicación:** Se utiliza el operador lógico `&&` de JavaScript para renderizar el modal solo cuando el estado sea `true`. La clase `d-block` de Bootstrap fuerza al navegador a mostrarlo y el botón final ejecuta la función almacenada en el estado `modalAction` antes de cerrar la ventana flotante.

---

### 🧑‍💻 Explicación de código: Karen (Gráfica de Ventas)

Este bloque extrae la inteligencia de negocios procesando los precios de las citas de la base de datos y ordenándolos en un gráfico de barras interactivo.

#### Código Explicado:

1. **Cálculo Dinámico de los Límites de la Semana:**
   ```typescript
   const obtenerDiasSemanaActual = () => {
     const hoy = new Date();
     const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes...
     const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
     
     const lunes = new Date(hoy);
     lunes.setDate(hoy.getDate() - diasDesdeLunes);
     
     const dias = [];
     for (let i = 0; i < 7; i++) {
       const dia = new Date(lunes);
       dia.setDate(lunes.getDate() + i);
       const anio = dia.getFullYear();
       const mes = String(dia.getMonth() + 1).padStart(2, "0");
       const d = String(dia.getDate()).padStart(2, "0");
       dias.push(`${anio}-${mes}-${d}`);
     }
     return dias;
   };
   ```
   * **Explicación:** Obtenemos el día de la semana actual con `getDay()`. Ajustamos la fecha para localizar el Lunes inicial restando los días correspondientes. Después, recorremos con un bucle `for` 7 iteraciones para generar un arreglo con los 7 días de la semana actual formateados de la forma exacta en la que se guardan en la base de datos (`YYYY-MM-DD`).

2. **Agrupación y Suma de Ingresos Diarios:**
   ```typescript
   const ventasPorDia = diasSemanaISO.map((fechaStr) => {
     return citas
       .filter((c) => c.fecha === fechaStr)
       .reduce((sum, c) => sum + c.precio, 0);
   });
   ```
   * **Explicación:** Iteramos sobre los 7 días generados anteriormente. Para cada día, filtramos las citas del estado `citas` que coincidan exactamente con esa fecha, y usamos la función de orden superior `.reduce` para acumular (sumar) el atributo `precio` de cada cita. Obtenemos como resultado final un array numérico de 7 elementos.

3. **Escalamiento Proporcional:**
   ```typescript
   const maxVenta = Math.max(...ventasPorDia, 10000);
   ```
   * **Explicación:** Encontramos el valor diario más alto registrado usando el operador de propagación (`...`). Este valor servirá como límite superior de la gráfica para calcular qué altura porcentual debe tener cada barra (el 100% de la altura de la gráfica representa este valor).

4. **Renderizado Responsivo de Barras en CSS/HTML:**
   ```typescript
   {nombresDiasCortos.map((dia, idx) => {
     const valor = ventasPorDia[idx];
     const porcentaje = (valor / maxVenta) * 100;
     return (
       <div 
         style={{
           height: `${Math.max(porcentaje, 4)}%`,
           width: "35%",
           background: valor > 0 ? "linear-gradient(180deg, var(--accent) 0%, #aa3bff 100%)" : "rgba(200, 200, 200, 0.3)",
         }}
         className="bar-hover"
         title={`${nombresDiasCompletos[idx]}: ${formatearPrecio(valor)}`}
       />
     );
   })}
   ```
   * **Explicación:** Mediante un `.map`, generamos un elemento visual para cada día. Su altura en CSS se define dinámicamente con la fórmula `(valor / maxVenta) * 100`. Le aplicamos un gradiente púrpura si hay ventas y un tono grisáceo translúcido si está en cero. La interactividad de escalado al hacer hover se controla mediante la clase CSS `.bar-hover`.

---

## ❓ Preguntas Frecuentes del Profesor (Para Preparar)

1. **¿Por qué se usa `localStorage` para el Login y no una sesión tradicional?**
   * *Respuesta:* Por ser un desarrollo del lado del cliente (Frontend SPA), `localStorage` nos permite almacenar tokens o banderas de estado simples de forma síncrona en el dispositivo del usuario sin requerir configuraciones de cookies en el backend o servidores Redis adicionales, ideal para proyectos ágiles y prototipos.
2. **¿Qué beneficio tiene pasar funciones al estado reactivo (`modalAction`)?**
   * *Respuesta:* Permite que un solo modal sea reutilizable y polimórfico. No necesitamos crear un modal para cancelar citas y otro modal para borrar la base de datos; simplemente cargamos en la variable de estado la lógica específica que queremos ejecutar y el modal la invoca al confirmar.
3. **¿Cómo calcula la gráfica las ventas de días pasados o futuros de la misma semana?**
   * *Respuesta:* La función `obtenerDiasSemanaActual` calcula los días desde el lunes hasta el domingo de la semana en curso. Al filtrar las citas registradas en el estado global, el sistema agrupa los precios de manera automática sin importar si son del pasado (se suman los registros existentes) o si se planifican citas futuras en la semana actual (se proyectará la ganancia en la gráfica).
