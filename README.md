# Estado del Proyecto - Sistema de Gestión de Becas

El sistema de gestión de becas y ayudas ya está completamente terminado y funcional. Hemos implementado todas las características solicitadas utilizando únicamente HTML, CSS y JavaScript puro, logrando la persistencia de datos mediante el uso de localStorage para simular una base de datos real sin necesidad de backend.

La aplicación integra correctamente los tres roles de usuario definidos. El administrador tiene control absoluto sobre la plataforma, pudiendo crear, editar y eliminar convocatorias de becas, así como gestionar usuarios y eliminar solicitudes erróneas. Los evaluadores disponen de un panel especializado donde pueden revisar los detalles de cada candidato, asignar puntajes numéricos a los criterios económicos, académicos y sociales, y decidir la aprobación o rechazo de las solicitudes. Los postulantes tienen un flujo completo que les permite registrarse, explorar las becas disponibles con filtros y enviar sus solicitudes mediante un formulario que valida automáticamente si cumplen con los requisitos de edad y promedio.

Toda la lógica de negocio se encuentra activa, incluyendo el bloqueo de postulaciones duplicadas, el cálculo automático de notas de evaluación y la visualización del historial de trámites. Este es un comentario de Christopher confirmando que el sistema cumple con todos los requerimientos y está listo para su entrega.

---

#  Cuentas de Prueba 

Para que prueben rápido sin registrarse a cada rato, usen estas cuentas:

###  Administrador (Ve TODO)
- **Correo:** `admin@admin.com`
- **Contraseña:** `123456` (o cualquier otra contra)

###  Evaluador (Ve Evaluaciones y Vistas de Usuario)
- **Correo:** `tormentionrex@evaluador.com`
- **Contraseña:** `undertale`

### Usuario / Postulante (Solo ve sus becas)
- **Correo:** `juan@gmail.com`
- **Contraseña:** `123456`

---

# Guía para el (Main): Cómo Aceptar Cambios

Esta sección es exclusiva para quien maneja la rama `main`. Su trabajo es unir el trabajo de los 3 o 4 compañeros sin que explote nada XD

### Paso 1: Ir a "Pull Requests"
1.  Entra al repositorio en GitHub.
2.  Haz clic en la pestaña **"Pull Requests"** (arriba a la izquierda).
3.  Verás una lista con las solicitudes de tus compañeros (ej: "Andres quiere unir cambios", "Cristopher subió navbar", etc.).

### Paso 2: Revisar y Unir (Uno por uno)
Debes hacer esto con CADA solicitud, una por una:

1.  Dale clic al título del Pull Request (ej: "Cambios de Andres").
2.  Baja hasta ver el botón verde que dice **"Merge pull request"**.
    *   Si el botón es VERDE:  GitHub lo puede unir automático.
    *   Si el botón es GRIS: Hay conflictos. Debes resolverlos manualmente (GitHub te guiará).
3.  Presiona **"Merge pull request"**.
4.  Presiona **"Confirm merge"**.

### Paso 3: Sincronizar tu PC
Una vez que aceptaste los 3 o 4 Pull Requests en GitHub
Debes descargarlos para tener el proyecto completo:

1.  Abre tu terminal en la carpeta del proyecto.
2.  Ejecuta: `git pull origin main`
y listo, ya tienes los cambios de todas las demas ramas.

---

# Guía Rápida para el Equipo

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
