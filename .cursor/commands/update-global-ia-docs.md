# Actualizar toda la documentación IA en `/docs`

Usar cuando el usuario quiera **refrescar en bloque** la documentación bajo `docs/` que esté **marcada explícitamente como generada por IA**, aplicando las mismas reglas que [update-docs.md](./update-docs.md) (ortografía, hechos del repo, espejo EN/ES, pie con fecha).

**Cuándo tiene sentido este comando:** el repositorio es **grande** y mantiene documentación bilingüe en **`docs/es/`** y **`docs/en/`**. En repos pequeños o sin ese árbol, usar solo **`/update-docs`**.

## Relación con `update-docs.md`

Este comando **no sustituye** a `update-docs.md`: delega en él la política de contenido (pares `docs/es` ↔ `docs/en`, excepciones de nombres si las hay en `update-docs.md`, pies, tabla de tipos, restricciones).

Aquí solo se define **cómo descubrir el ámbito**, **en qué orden trabajar** y **cuándo se permite tocar estructura o archivos nuevos**.

## Criterio: qué entra en el barrido

### Inclusión automática (sí entran)

Archivos `*.md` bajo `docs/` cuyo **final del documento** incluya el pie estándar de IA definido en `update-docs.md`, por ejemplo:

- Español: texto tipo `Archivo generado por IA` + `Última actualización:` + fecha.
- Inglés: texto tipo `AI-generated file` + `Last updated:` + fecha.
- Bloque cita equivalente en README o docs del proyecto.

**Paso obligatorio al ejecutar:** localizar primero esos archivos (búsqueda por las cadenas anteriores o equivalentes) y **listar al usuario el inventario** antes de editar: ruta, idioma inferido y par esperado (si existe).

### Exclusión por defecto (no entran)

- Markdown en `docs/` **sin** pie de “generado por IA” / “AI-generated file”, aunque tengan otra línea de “Última actualización”.
- Archivos fuera de `docs/` (p. ej. `README.md` raíz), salvo que el usuario los mencione aparte; en ese caso usar **`/update-docs`** sobre esos `@` concretos.

Si el usuario pide **añadir la marca IA** a docs que aún no la tienen, normalizar el pie según `update-docs.md` y **después** incluirlos en barridos futuros.

## Flujo para el agente

1. **Inventario (solo lectura)**  
   Encontrar todos los `.md` en `docs/` con pie IA válido. Agrupar por par bilingüe usando la misma ruta relativa en `docs/es/` y `docs/en/`, más cualquier **tabla de excepciones** en `update-docs.md` de este repo.

2. **Informar**  
   Mostrar lista: archivo → ¿marcado? → par (`Sí` / `No` / `Par incompleto`).

3. **Por cada grupo (idealmente par ES+EN)**  
   Aplicar **íntegramente** los pasos de `update-docs.md`: corregir fuente, alinear hechos con el repo, actualizar pie con **fecha del día de ejecución**, sincronizar espejo y enlaces relativos.

4. **Orden sugerido**  
   - Primero índices y resúmenes que enlazan a otros docs.  
   - Luego guías de estructura, setup, backend, datos, etc.

5. **Estructura y archivos nuevos**

   - **Permitido:** renombrar, crear o fusionar archivos **solo** entre documentación IA o para coherencia de índices y pares EN/ES.
   - **Obligatorio:** si se crea o renombra algo, actualizar **todos** los enlaces internos afectados en `docs/es` y `docs/en` en la misma ejecución.
   - **Preferencia:** no reestructurar por gusto; hacerlo cuando el repo o los índices lo exijan.

6. **Resumen final**  
   Archivos tocados, pares sincronizados, huérfanos, cambios estructurales, y docs con “última actualización” pero **sin** marca IA (no modificados salvo petición).

## Restricciones

- Heredar las de `update-docs.md`.
- Respuesta al usuario en **español** salvo que pida otro idioma.
