# Guía Avanzada de Sustentación del Proyecto — BookyFlow

Este documento contiene una explicación técnica **exhaustiva, línea por línea y función por función** de toda la lógica del panel del dueño en **`Dashboard.tsx`**. Está diseñado para que **Ángela, Diana y Karen** comprendan a nivel de ingeniería de software cada elemento y puedan responder con solvencia cualquier pregunta técnica de su profesor.

---

## 🧭 Estructura General y Helpers (Explicación para Todo el Grupo)

Antes de entrar en las asignaciones individuales, deben entender las funciones auxiliares de formato y las constantes globales ubicadas al inicio del archivo.

### 1. Formateador de Moneda (`formatearPrecio`)
```typescript
function formatearPrecio(valor: number): string {
  const str = valor.toString();
  let resultado = "";
  let contador = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    resultado = str[i] + resultado;
    contador++;
    if (contador % 3 === 0 && i > 0) {
      resultado = "." + resultado;
    }
  }

  return "$" + resultado;
}
```
*   **Propósito:** Transforma un valor numérico entero (ej. `25000`) en una cadena legible con formato de moneda colombiana (ej. `$25.000`).
*   **Explicación línea por línea:**
    *   `const str = valor.toString();`: Convierte el número recibido en texto para poder iterar sobre sus dígitos.
    *   `let resultado = "";` y `let contador = 0;`: Inicializan variables para construir la cadena final de derecha a izquierda y contar las posiciones de los miles.
    *   `for (let i = str.length - 1; i >= 0; i--)`: Un bucle inverso que comienza en la última cifra del número (las unidades) y va retrocediendo hacia la izquierda.
    *   `resultado = str[i] + resultado;`: Agrega el dígito actual al principio del string resultado.
    *   `contador++;`: Incrementa el contador de dígitos procesados.
    *   `if (contador % 3 === 0 && i > 0)`: Si el contador es múltiplo de 3 (llegamos a las unidades de mil, millón, etc.) y todavía quedan dígitos a la izquierda (`i > 0`), inserta un punto decimal de separación.
    *   `return "$" + resultado;`: Agrega el símbolo de pesos al principio del string de salida.

### 2. Conversor de Fecha Visual (`formatearFechaVisual`)
```typescript
function formatearFechaVisual(fechaISO: string): string {
  if (!fechaISO || !fechaISO.includes("-")) return fechaISO;
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}
```
*   **Propósito:** Convierte la representación de fecha estándar de la base de datos (`YYYY-MM-DD`) a un formato de lectura tradicional latinoamericano (`DD/MM/YYYY`).
*   **Explicación línea por línea:**
    *   `if (!fechaISO || !fechaISO.includes("-")) return ...`: Validación de seguridad. Si la cadena está vacía o no tiene el formato esperado, la devuelve tal cual para evitar errores de ejecución.
    *   `const [anio, mes, dia] = fechaISO.split("-");`: Utiliza la técnica de *destructuring* para dividir la fecha por guiones en tres constantes separadas.
    *   `return ${dia}/${mes}/${anio};`: Interpola los valores en el nuevo orden separados por barras diagonales.

---

## 👥 Roles de Exposición Detallados

---

### 🧑‍💻 ROL 1: Ángela (Autenticación, Sesión y Control del Panel)
*Ángela explica cómo se bloquea el acceso no autorizado, cómo se captura la información y cómo se mantiene la sesión activa usando las APIs nativas del navegador.*

#### 1. Variables de Estado de Ángela:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  return localStorage.getItem("bf_owner_auth") === "true";
});
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loginError, setLoginError] = useState("");
```
*   **`isAuthenticated` (líneas 1-3):** Define si el usuario ha iniciado sesión. El uso de la función flecha dentro de `useState` hace un *lazy check* en `localStorage`. Si el navegador tiene almacenada la clave `"bf_owner_auth"` con valor `"true"`, se inicia en `true`, manteniendo la sesión persistente incluso si el usuario cierra el navegador o refresca la pestaña.
*   **`username` y `password`:** Estados encargados de almacenar en tiempo real lo que digita el usuario en las entradas de texto correspondientes.
*   **`loginError`:** Almacena el mensaje a mostrar en caso de fallo en las credenciales.

#### 2. Controlador de Envío del Formulario (`handleLogin`):
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
*   **`e.preventDefault();`:** Evita que el navegador realice una petición HTTP GET/POST nativa y recargue la página completa. Esto es crucial en aplicaciones de una sola página (SPA).
*   **`if (username === "admin" && password === "admin123")`:** Validador simple de credenciales fijas.
*   **`setIsAuthenticated(true);`:** Actualiza el estado reactivo a verdadero para activar el re-renderizado de la interfaz.
*   **`localStorage.setItem("bf_owner_auth", "true");`:** Registra la bandera en el almacenamiento del navegador para mantener la persistencia.

#### 3. Cierre de Sesión (`handleLogout`):
```typescript
function handleLogout() {
  setIsAuthenticated(false);
  localStorage.removeItem("bf_owner_auth");
  setUsername("");
  setPassword("");
}
```
*   **`setIsAuthenticated(false);`:** Vuelve el estado a falso, forzando la aparición del componente del Login.
*   **`localStorage.removeItem("bf_owner_auth");`:** Destruye el registro en el almacenamiento local del navegador para prevenir accesos no autorizados posteriores.

---

### 🧑‍💻 ROL 2: Diana (Carga de Datos, Filtros y Modales Personalizados)
*Diana explica cómo se sincroniza la interfaz con la API de FastAPI, cómo funcionan los filtros de búsqueda y el diseño dinámico de los modales en React.*

#### 1. Petición Asíncrona de Datos (`cargarDatos` y `useEffect`):
```typescript
const cargarDatos = useCallback(async (filtros?: FiltrosCitas) => {
  if (!isAuthenticated) return;
  try {
    setLoading(true);
    setError(null);
    const [citasData, ingresosData] = await Promise.all([
      getCitas(filtros),
      getIngresosSemana(),
    ]);
    setCitas(citasData);
    setIngresos(ingresosData.total);
    setLoading(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error desconocido");
    setLoading(false);
  }
}, [isAuthenticated]);
```
*   **`useCallback`:** Envuelve la función asíncrona para memorizarla. Esto evita recrear la función innecesariamente en cada ciclo de render, optimizando el rendimiento.
*   **`Promise.all([...])`:** Técnica avanzada para ejecutar múltiples llamadas HTTP al servidor en paralelo (`getCitas` y `getIngresosSemana`). Disminuye a la mitad el tiempo de espera en la red en comparación con llamarlas secuencialmente mediante `await` individuales.

#### 2. Lógica del Filtro de Búsqueda:
```typescript
function handleAplicarFiltros() {
  const filtros: FiltrosCitas = {};
  if (filtroFecha) filtros.fecha = filtroFecha;
  if (filtroProfesional) filtros.profesional = filtroProfesional;
  if (filtroServicio) filtros.servicio = filtroServicio;
  setFiltrosActivos(!!(filtroFecha || filtroProfesional || filtroServicio));
  cargarDatos(filtros);
}
```
*   **Construcción Dinámica del Objeto `filtros`:** Solo se anexan las propiedades al objeto `filtros` si la variable de estado correspondiente contiene información. Esto evita enviar parámetros vacíos al backend.
*   **`!!( ... )`:** Operador doble negación (cast a booleano). Evalúa si al menos uno de los tres filtros tiene contenido.

#### 3. Estructura y Callback del Modal Reutilizable:
```typescript
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [modalTitle, setModalTitle] = useState("");
const [modalMessage, setModalMessage] = useState("");
const [modalAction, setModalAction] = useState<(() => void) | null>(null);
const [modalType, setModalType] = useState<"danger" | "warning">("danger");
```
*   **`modalAction`:** Guarda la referencia a una función asíncrona dentro del estado del componente. Esto permite que el mismo modal sirva para **cancelar una cita** (tipo `warning`) o **vaciar toda la base de datos** (tipo `danger`).
*   Al dar clic en "Sí, continuar" en el HTML del modal, se ejecuta:
    ```typescript
    onClick={() => {
      if (modalAction) modalAction();
      setShowConfirmModal(false);
    }}
    ```
    Llama a la acción guardada en memoria y cierra el modal cambiando `showConfirmModal` a `false`.

---

### 🧑‍💻 ROL 3: Karen (Procesamiento de Negocios y Gráfica Flexbox)
*Karen explica la matemática detrás de la gráfica semanal, la conversión temporal y la construcción responsiva de elementos visuales proporcionales en CSS/HTML.*

#### 1. Cálculo de Fechas de la Semana Actual (`obtenerDiasSemanaActual`):
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
*   **`hoy.getDay()`:** Obtiene el índice numérico del día de la semana actual.
*   **Ajuste para que el Lunes sea 0:** Los servidores calculan la semana desde el Lunes. Restamos la diferencia de días para fijar la variable `lunes` en el inicio de la semana correspondiente.
*   **Bucle de 7 días:** Sumamos del `0` al `6` al día lunes inicial.
*   **`.padStart(2, "0")`:** Función fundamental de JavaScript que asegura que los meses o días de un solo dígito siempre tengan un cero inicial (ej. convierte un `9` en `"09"`), garantizando la compatibilidad con el formato de fecha ISO `YYYY-MM-DD` de la base de datos.

#### 2. Suma Acumulativa por Día (`reduce`):
```typescript
const ventasPorDia = diasSemanaISO.map((fechaStr) => {
  return citas
    .filter((c) => c.fecha === fechaStr)
    .reduce((sum, c) => sum + c.precio, 0);
});
```
*   **`citas.filter(...)`:** Retorna un sub-arreglo que contiene únicamente las citas registradas en el día iterado.
*   **`reduce((sum, c) => sum + c.precio, 0)`:** Recorre el sub-arreglo acumulando la suma de los campos de `precio` en la variable `sum`, partiendo desde el valor semilla `0`.

#### 3. Escalado Proporcional e Renderizado HTML de las Barras:
```typescript
const maxVenta = Math.max(...ventasPorDia, 10000);
```
*   **`Math.max(...ventasPorDia)`:** Evalúa cuál de los siete días tuvo el ingreso más alto. Este número se convierte en el 100% de la altura visual disponible de la gráfica.
*   **Renderizado de la Barra:**
    ```typescript
    const porcentaje = (valor / maxVenta) * 100;
    ```
    Calculamos el porcentaje de altura exacto de la barra según su ganancia diaria relativa.
    ```typescript
    style={{
      height: `${Math.max(porcentaje, 4)}%`,
      width: "35%",
      background: valor > 0 ? "linear-gradient(180deg, var(--accent) 0%, #aa3bff 100%)" : "rgba(200, 200, 200, 0.3)",
      borderRadius: "6px 6px 0 0"
    }}
    ```
    *   `Math.max(porcentaje, 4)%`: Asegura que aunque un día tenga `$0` en ventas, la barra tenga al menos una altura mínima del `4%` para que la estructura del gráfico sea visible.
    *   `linear-gradient(...)`: Aplica un degradado suave de color violeta a las barras con ventas, y un color gris translúcido para los días sin operaciones.

---

## ❓ Preguntas Avanzadas para la Defensa

### 1. ¿Cómo manejan el problema de los ciclos de renderizados infinitos en React al traer datos?
*   **Respuesta:** Envolviendo la llamada HTTP en una función usando el hook `useCallback` y condicionando su ejecución dentro de un `useEffect` con un arreglo de dependencias controlado `[cargarDatos, isAuthenticated]`. Esto garantiza que la consulta al backend ocurra solo al cargar la interfaz o cuando el usuario cambie su estado de sesión.

### 2. ¿Cómo se comunican las acciones entre el componente Modal y el Dashboard?
*   **Respuesta:** Mediante el concepto de *Callbacks*. Cuando el modal se abre, le inyectamos una función ejecutable al estado `modalAction`. El modal no sabe exactamente qué proceso interno va a correr, solo invoca la función callback contenida dentro de este estado al confirmar. Esto desacopla la vista del modal de la lógica de negocio.

### 3. ¿Por qué hicieron la gráfica con Flexbox y CSS dinámico en lugar de importar librerías pesadas?
*   **Respuesta:** Usar componentes Flexbox de HTML5 nativo evita instalar librerías externas de terceros (como ChartJS o Recharts) que incrementan el peso del archivo empaquetado final (*bundle size*). Esto mejora la velocidad de carga de la página, permite un control total sobre las transiciones con CSS nativo y asegura la compatibilidad responsiva móvil de manera nativa sin sobrecargar el procesador del cliente.
