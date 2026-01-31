# Proyecto_SistemaBecas
Un pequeño proyecto en equipo para el lunes, sobre un Sistema de Gestión de Becas y Ayudas que permita administrar de forma digital y transparente todo el proceso de asignación de becas, desde la postulación hasta la evaluación, aprobación y seguimiento histórico, garantizando trazabilidad, control y generación de reportes.

---

# Actualizaciones Recientes (Gonzalez)

## 🎨 1. El Navbar ahora tiene un estilo mas profesional
Le metí mano al menú de arriba. Ahora empieza de un color azul sólido (para que se lea bien) pero más pegadito al borde, y cuando bajas (scroll), se pone blanco con letras azules. Se ve mas moderno y limpio.

### 🌊 2. Header (Encabezado) 
Cambié la imagen estática por un **Header Personalizado** con animaciones y efectos mas agradables a la vista.
- Fondo gradiente azul cian bien fresco.
- Un divisor en forma de **ola suave** abajo (SVG) para conectar con el resto de la página.
- La imagen principal (la ilustración) ahora tiene un efecto de "flotar" y se mezcla con el fondo.
- La barra de búsqueda ahora es cuadrada y minimalista.

### 🖱️ 3. Tarjetas Interactivas
en los cuadros de las becas antes teniamos que atinarle al botoncito de "Postular". Ahora **todo el cuadro es cliqueable**. Si le das click a cualquier parte de la tarjeta, te lleva directo al formulario y **te selecciona la beca automáticamente**.

### 🔐 4. Sistema de Roles Inteligente (¡Adiós botón de cambiar rol!)
Ya no hay que estar dándole al botón de "Cambiar Rol" para probar cosas. Ahora el sistema es listo y sabe quién eres por tu correo:

- Si tu correo tiene **"admin"** -> Eres el Jefe (Ves todo).
- Si tu correo tiene **"evaluador"** -> Eres Evaluador.
- Si no dice nada de eso -> Eres un Estudiante normal.

Además, te da la bienvenida en verde cuando entras para que sepas que todo salió bien. ✅

---

# 🧪 Cuentas de Prueba (Test Users)

Para que prueben rápido sin registrarse a cada rato, usen estas cuentas:

### 👑 Administrador (Ve TODO)
- **Correo:** `admin@admin.com`
- **Contraseña:** `123456` (o cualquiera)

### 📝 Evaluador (Ve Evaluaciones y Vistas de Usuario)
- **Correo:** `tormentionrex@evaluador.com`
- **Contraseña:** `undertale`

### 🎓 Usuario / Postulante (Solo ve sus becas)
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
Una vez que aceptaste los 3 o 4 Pull Requests en GitHub, **TU PC TODAVÍA NO LO SABE**.
Debes descargarlos para tener el proyecto completo:

1.  Abre tu terminal en la carpeta del proyecto.
2.  Ejecuta: `git pull origin main`
y listo, ya tienes los cambios de todos los compañeros.

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
