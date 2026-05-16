# Actualizar documentación (ortografía + espejo EN/ES)

Usar cuando el usuario mencione este comando y adjunte con `@` uno o más archivos Markdown de documentación del repo (por ejemplo `docs/es/...`, `README.md`).

## Objetivo

1. **Revisar ortografía y redacción** del archivo fuente (según el idioma del documento) y **aplicar correcciones en el mismo archivo**.
2. **Sincronizar el contenido** con la versión en el **otro idioma** del proyecto (normalmente inglés respecto al español de `docs/es/` y viceversa), manteniendo el mismo significado y estructura.
3. Si el documento es o debe tratarse como **generado por IA**, mantener al final la **marca y la fecha de última actualización** (ver más abajo) y **actualizar el contenido factual** según el tipo de archivo (estructura del repo, rutas, etc.).

## Idioma fuente y archivo espejo

- Inferir el idioma del contenido (ES vs EN), no solo por la ruta.
- **Par principal del proyecto:**
  - Raíz: `README.md` ↔ `README.en.md`
  - Docs: `docs/es/` ↔ `docs/en/` (misma ruta relativa dentro de cada árbol, salvo excepciones abajo).

### Excepciones (nombre distinto entre ES y EN)

| Español (`docs/es/`) | Inglés (`docs/en/`) |
|----------------------|---------------------|
| `setup/rutes.md` | `setup/routes.md` |
| `data/progreso-cliente-local.md` | `data/client-local-progress.md` |

Si no existe par conocido (por ejemplo un `README.md` solo dentro de `src/features/...`), **no inventar** otro archivo: corregir ortografía del adjunto y **avisar** que no hay espejo bilingüe en el repo.

## Documentación generada por IA

### Cuándo aplica

- El archivo **ya incluye** al final una línea o bloque que indica que fue generado por IA (o equivalente).
- El usuario **indica de forma implícita o explícita** que el archivo fue generado por IA aunque aún **no tenga la marca**: en ese caso, **añadir o normalizar** el pie y tratar el archivo como generado por IA en lo sucesivo.

### Pie obligatorio al final del archivo

En **cada archivo tocado** que entre en esta categoría, el **último contenido** del Markdown debe incluir la marca y la **fecha exacta del día de ejecución** del comando (no una fecha inventada: usar la fecha actual del entorno o la indicada en el contexto de la conversación si es autorizada como “hoy”).

**Archivos en español** (o idioma principal del doc si no hay par EN): bloque final con fecha literal del día de ejecución, por ejemplo:

```markdown
---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
```

**Archivo espejo en inglés** (`README.en.md`, `docs/en/...`): mismo día calendario, por ejemplo:

```markdown
---
*AI-generated file. Last updated: Saturday, May 16, 2026.*
```

(Los ejemplos anteriores son ilustrativos: usar siempre la **fecha real del día** en que se ejecuta el comando, no copiar la de muestra.)

- Si ya existía un pie similar, **reemplazarlo** actualizando solo la fecha cuando el contenido no cambió; si hubo cambios sustantivos, actualizar contenido y fecha.
- Usar **una sola línea** de cierre (o el bloque `---` + cursiva) para no duplicar marcas.

### Actualizar según el tipo de documento

Cuando el archivo sea generado por IA (o se trate como tal), además de ortografía y espejo:

| Tipo de documento (ejemplos) | Acción |
|------------------------------|--------|
| Estructura de carpetas, árbol del proyecto, `project-structure` | Inspeccionar el repo (listar carpetas relevantes, convenciones del proyecto) y **alinear** el documento con la realidad actual. |
| Rutas, comandos, scripts, stack | Contrastar con `package.json`, carpetas `src/`, `scripts/`, etc., y **corregir** rutas o nombres obsoletos. |
| Resúmenes ejecutivos / índices | Ajustar enlaces rotos y referencias a archivos que hayan cambiado de nombre o ubicación. |

Si no es posible inferir el tipo, **preguntar al usuario** solo cuando haga falta información que no esté en el repo.

## Pasos para el agente

1. **Leer** los archivos `@` indicados por el usuario.
2. Determinar si deben tratarse como **generados por IA** (marca al final o indicación del usuario).
3. **Corregir** en el archivo fuente:
   - Ortografía, tildes, puntuación y typos (ej. `espa;ol`).
   - Consistencia de mayúsculas en nombres propios (ICFES, Colombia, etc.).
   - Redacción breve si una frase es confusa o redundante, **sin cambiar el alcance técnico** ni inventar funcionalidades.
4. Si es IA o contenido factual sensible al repo: **actualizar** según la tabla de tipos (explorar el proyecto con herramientas necesarias).
5. Si es IA: **asegurar o añadir** el pie con **“Archivo generado por IA”** y **fecha de hoy** al final del archivo (y el equivalente en inglés en el espejo).
6. **Guardar** los cambios del archivo fuente.
7. **Resolver la ruta espejo** con la tabla anterior y la regla `docs/es` ↔ `docs/en`.
8. **Actualizar el archivo en el otro idioma:**
   - Traducir o alinear párrafos, listas y títulos para que reflejen **exactamente** el contenido ya corregido del fuente.
   - Mantener estructura Markdown (niveles de encabezado, listas, tablas, bloques de código).
   - **Enlaces internos:** ajustar rutas relativas (`docs/es/...` → `docs/en/...` y al revés donde aplique).
   - No traducir identificadores de código, nombres de archivos en rutas de import, ni variables; sí adaptar el texto que las rodea.
   - **Pie IA:** misma fecha de actualización (mismo día), texto en inglés en archivos `docs/en/` y `README.en.md`.
9. Si el usuario pasó **varios** archivos, repetir el flujo por cada uno que tenga par bilingüe.
10. **Resumen final** al usuario: qué archivos se tocaron, si se aplicó tratamiento IA, y si hubo ambigüedad, qué decisión se tomó.

## Restricciones

- No eliminar secciones enteras salvo que el fuente ya las haya eliminado o el usuario lo pida explícitamente.
- No añadir **contenido narrativo nuevo** al sincronizar el espejo más allá de lo necesario para traducción alineada; **excepción:** pie de “generado por IA” y **actualizaciones factuales** cuando el doc sea IA y corresponda refrescar datos del repo.
- Respuesta al usuario en **español** si no indica otro idioma.
