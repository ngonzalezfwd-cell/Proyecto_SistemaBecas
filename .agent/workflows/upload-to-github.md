---
description: Cómo subir cambios a GitHub y fusionarlos con main
---

Para subir tus cambios a GitHub y luego pasarlos a la rama principal (`main`), sigue estos pasos:

### 1. Preparar y subir tu rama actual (`christopher`)

Primero, asegúrate de que todos tus cambios estén guardados y subidos a tu rama de trabajo.

// turbo
```powershell
git add .
git commit -m "feat: restringir login a usuarios registrados y mejorar mensajes de error"
git push origin christopher
```

### 2. Fusionar con la rama `main`

Ahora que tus cambios están en GitHub bajo la rama `christopher`, tienes dos opciones:

#### Opción A: Desde la terminal (Recomendado para rapidez)

// turbo
```powershell
# Cambiar a la rama main
git checkout main

# Asegurarse de tener lo último de main
git pull origin main

# Fusionar tus cambios de la rama christopher a main
git merge christopher

# Subir los cambios ya fusionados a GitHub
git push origin main

# (Opcional) Volver a tu rama de trabajo
git checkout christopher
```

#### Opción B: Desde la web de GitHub (Recomendado para revisión)
1. Ve a tu repositorio en GitHub.
2. Verás un botón amarillo que dice **"Compare & pull request"**. Haz clic en él.
3. Asegúrate de que `base: main` y `compare: christopher`.
4. Haz clic en **"Create pull request"**.
5. Finalmente, haz clic en **"Merge pull request"** y después en **"Confirm merge"**.

> [!TIP]
> Si eliges la **Opción B**, recuerda hacer `git checkout main` y `git pull origin main` en tu computadora después para tener los cambios actualizados localmente.
