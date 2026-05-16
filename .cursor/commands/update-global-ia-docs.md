# Actualizar toda la documentación IA en `/docs`

Usar cuando el usuario quiera **refrescar en bloque** la documentación bajo `docs/` que esté **marcada explícitamente como generada por IA**, aplicando las mismas reglas que [update-docs.md](./update-docs.md) (ortografía, hechos del repo, espejo EN/ES, pie con fecha).

## Relación con `update-docs.md`

Este comando **no sustituye** a `update-docs.md`: delega en él la política de contenido (pares `docs/es` ↔ `docs/en`, excepciones de nombres, pies, tabla de tipos, restricciones).

Aquí solo se define **cómo descubrir el ámbito**, **en qué orden trabajar** y **cuándo se permite tocar estructura o archivos nuevos**.

## Criterio: qué entra en el barrido

### Inclusión automática (sí entran)

Archivos `*.md` bajo `docs/` cuyo **final del documento** incluya el pie estándar de IA definido en `update-docs.md`, por ejemplo:

- Español: texto tipo `Archivo generado por IA` + `Última actualización:` + fecha.
- Inglés: texto tipo `AI-generated file` + `Last updated:` + fecha.

**Paso obligatorio al ejecutar:** localizar primero esos archivos (p. ej. búsqueda en el repo por las cadenas anteriores o equivalentes acordadas en `update-docs.md`) y **listar al usuario el inventario** antes de editar: ruta, idioma inferido y par esperado (si existe).

### Exclusión por defecto (no entran)

- Markdown en `docs/` **sin** pie de “generado por IA” / “AI-generated file”, aunque tengan otra línea de “Última actualización” o notas sueltas.
- Archivos fuera de `docs/` (p. ej. `README.md` raíz), salvo que el usuario los mencione aparte; en ese caso usar `update-docs.md` sobre esos `@` concretos.

Si el usuario pide **añadir la marca IA** a docs que aún no la tienen, eso es una extensión explícita: normalizar el pie según `update-docs.md` y **después** incluirlos en barridos futuros.

## Flujo para el agente

1. **Inventario (solo lectura)**  
   Encontrar todos los `.md` en `docs/` con pie IA válido. Agrupar por par bilingüe usando la misma ruta relativa en `docs/es/` y `docs/en/`, más la **tabla de excepciones** de nombres ES/EN descrita en `update-docs.md`.

2. **Informar**  
   Mostrar la tabla o lista: archivo → ¿marcado? → par (`Sí` / `No` / `Par incompleto`).

3. **Por cada grupo (idealmente par ES+EN)**  
   Aplicar **íntegramente** los pasos de `update-docs.md`: corregir fuente, alinear hechos con el repo si aplica, actualizar pie con **fecha del día de ejecución**, sincronizar el espejo y enlaces relativos.

4. **Orden sugerido**  
   - Primero índices y resúmenes que enlazan a otros docs (`overview`, resúmenes ejecutivos).  
   - Luego guías de estructura, setup, backend, datos, etc.  
   Así los enlaces rotos se detectan en pasadas posteriores dentro del mismo barrido.

5. **Estructura y archivos nuevos**

   - **Permitido:** renombrar, crear o fusionar archivos **solo** entre documentación ya tratada como IA o necesaria para que el índice y los pares EN/ES sigan siendo coherentes (p. ej. un `overview.md` apunta a un path que ya no existe).
   - **Obligatorio:** si se crea o renombra algo, actualizar **todos** los enlaces internos afectados en `docs/es` y `docs/en` en la misma ejecución (y el pie IA donde corresponda).
   - **Preferencia:** no reestructurar por gusto; hacerlo cuando el repo o los propios índices lo exijan.

6. **Resumen final**  
   Igual que en `update-docs.md`: archivos tocados, pares sincronizados, huérfanos (marcado en un idioma y no en el otro), cambios estructurales, y **docs candidatos** que tuvieran “última actualización” pero **sin** marca IA (no modificados salvo petición).

## Restricciones

- Heredar las de `update-docs.md` (no inventar funcionalidades, no narrativa de relleno en el espejo, etc.).
- Respuesta al usuario en **español** salvo que pida otro idioma.
