# Guía Práctica de Git para el Equipo (Ángela, Diana y Karen)

Esta guía explica el flujo paso a paso de cómo subir sus aportes al repositorio compartido sin sobrescribir el trabajo de las demás ni generar conflictos difíciles.

---

## 🛠️ Conceptos Básicos que Deben Saber

*   **`main` (o `master`):** Es la rama principal. Aquí está el código final que funciona.
*   **Ramas (Branches):** Copias de trabajo independientes del código. Cada una creará su propia rama para programar o documentar su parte sin dañar el proyecto principal.
*   **`git pull`:** Descarga los últimos cambios del repositorio en la nube a tu computadora.
*   **`git push`:** Sube tus commits locales a la nube.

---

## 🚀 Flujo Paso a Paso para cada Integrante

Para que la subida sea equitativa e independiente, sigan este proceso una por una o en sus respectivas computadoras.

### Paso 1: Asegurarse de tener lo último del proyecto
Antes de hacer cualquier cambio, debes traer lo que tus compañeras ya subieron a la nube.
Abre tu terminal en la carpeta del proyecto y escribe:
```bash
git checkout main
git pull origin main
```

### Paso 2: Crear tu propia rama de trabajo
Para no mezclar tu código directamente con la rama principal mientras lo pruebas, crea una rama con tu nombre:
*   **Ángela:** `git checkout -b feature-login-angela`
*   **Diana:** `git checkout -b feature-modales-diana`
*   **Karen:** `git checkout -b feature-grafica-karen`

*(El comando `checkout -b` crea la rama y te cambia a ella inmediatamente).*

### Paso 3: Realizar los cambios o agregar archivos
Ahora puedes modificar tus archivos o agregar el documento de sustentación en tu computadora de manera normal.

### Paso 4: Preparar y guardar tus cambios localmente (Commit)
Una vez que termines tu parte, dile a Git qué archivos quieres guardar:
1.  Verifica qué archivos cambiaste:
    ```bash
    git status
    ```
2.  Agrega los archivos modificados al área de preparación (staging):
    ```bash
    git add .
    ```
    *(El punto `.` agrega todos los archivos modificados de la carpeta actual)*
3.  Guarda los cambios con un mensaje descriptivo:
    ```bash
    git commit -m "Explicación breve de lo que hiciste (Ej: Agregar módulo de login)"
    ```

### Paso 5: Subir tu rama a la nube (GitHub / GitLab)
Sube tu rama de trabajo con tus commits al repositorio remoto:
*   Si eres **Ángela**: `git push origin feature-login-angela`
*   Si eres **Diana**: `git push origin feature-modales-diana`
*   Si eres **Karen**: `git push origin feature-grafica-karen`

---

## 🤝 Cómo Unir el Trabajo en la Rama Principal (`main`)

Una vez que las ramas de todas estén en GitHub/GitLab, deben unirlas a la rama `main`. La forma más segura y profesional de hacerlo es mediante un **Pull Request (PR)** o **Merge Request**:

1.  Entren a la página web del repositorio en GitHub/GitLab.
2.  Verán un botón amarillo que dice **"Compare & pull request"** para la rama que acaban de subir. Denle clic.
3.  Escriban un título descriptivo y denle a **"Create pull request"**.
4.  Si no hay conflictos, hagan clic en **"Merge pull request"** y luego en **"Confirm merge"**.

### ⚠️ Qué hacer si hay conflictos (Conflictos de Merge)
Si dos personas modificaron la misma línea del mismo archivo (por ejemplo, el archivo `Dashboard.tsx`), Git les advertirá que hay un conflicto y no les dejará hacer merge automáticamente.
*   **Solución:** Abran el archivo conflictivo en VS Code. Verán secciones marcadas con `<<<<<<< HEAD` y `=======`. Decidan en equipo qué versión del código dejar, borren los marcadores de Git, guarden el archivo, hagan `git add .`, `git commit` y vuelvan a subirlo.
