# Proyecto_SistemaBecas
Un pequeño proyecto en equipo para el lunes, sobre un Sistema de Gestión de Becas y Ayudas que permita administrar de forma digital y transparente todo el proceso de asignación de becas, desde la postulación hasta la evaluación, aprobación y seguimiento histórico, garantizando trazabilidad, control y generación de reportes.

---

# 👑 Guía para el Líder (Main): Cómo Aceptar Cambios

Esta sección es exclusiva para quien maneja la rama `main`. Tu trabajo es unir el trabajo de los 3 o 4 compañeros sin que explote nada.

### Paso 1: Ir a "Pull Requests"
1.  Entra al repositorio en GitHub.
2.  Haz clic en la pestaña **"Pull Requests"** (arriba a la izquierda).
3.  Verás una lista con las solicitudes de tus compañeros (ej: "Andres quiere unir cambios", "Cristopher subió navbar", etc.).

### Paso 2: Revisar y Unir (Uno por uno)
Debes hacer esto con CADA solicitud, una por una:

1.  Dale clic al título del Pull Request (ej: "Cambios de Andres").
2.  Baja hasta ver el botón verde que dice **"Merge pull request"**.
    *   *Si el botón es VERDE:* ¡Genial! GitHub lo puede unir automático.
    *   *Si el botón es GRIS:* Hay conflictos. Debes resolverlos manualmente (GitHub te guiará).
3.  Presiona **"Merge pull request"**.
4.  Presiona **"Confirm merge"**.
5.  (Opcional pero recomendado) Presiona "Delete branch" si ya no se usará esa rama.

### Paso 3: Sincronizar tu PC
Una vez que aceptaste los 3 o 4 Pull Requests en GitHub, **TU PC TODAVÍA NO LO SABE**.
Debes descargarlos para tener el proyecto completo:

1.  Abre tu terminal en la carpeta del proyecto.
2.  Ejecuta: `git pull origin main`

---

# 👷 Guía Rápida para el Equipo

Para evitar borrar el trabajo de los demás, sigue esta regla:  
**SIEMPRE haz `git pull` antes de hacer `git push`.**

## Flujo de Trabajo
1.  **Guarda tus cambios:**  
    `git add .`  
    `git commit -m "Descripción"`
2.  **Sincroniza (Descarga lo nuevo):**  
    `git pull origin main`  
3.  **Sube tus cambios:**  
    `git push origin tu-rama`
