# Scripts del proyecto

Este documento describe los scripts definidos en `package.json` y su función.

---

## Desarrollo

### `dev`

```bash
pnpm dev
```

**Comando:** `next dev`

**Descripción:** Inicia el servidor de desarrollo de Next.js con recarga en caliente. Por defecto corre en `http://localhost:3000`.

---

### `dev:clean`

```bash
pnpm dev:clean
```

**Comando:** `rm -rf .next && next dev`

**Descripción:** Borra la carpeta `.next` y arranca de nuevo el servidor de desarrollo (útil si el caché de build causa problemas).

---

### `start`

```bash
pnpm start
```

**Comando:** `next start`

**Descripción:** Inicia el servidor de producción de Next.js. Requiere haber ejecutado `pnpm build` antes.

---

### `preview`

```bash
pnpm preview
```

**Comando:** `next start`

**Descripción:** Alias de `start` para previsualizar el build de producción en local.

---

## Build

### `build`

```bash
pnpm build
```

**Comando:** `next build`

**Descripción:** Compila la aplicación para producción (salida en `.next/`). En este repo **no** está configurado `output: 'export'` por defecto; no se genera `out/` salvo que se añada esa opción en `next.config`.

---

## Calidad de código

### `lint`

```bash
pnpm lint
```

**Comando:** `eslint .`

**Descripción:** Ejecuta ESLint en todo el proyecto.

---

### `format`

```bash
pnpm format
```

**Comando:** `prettier --write .`

**Descripción:** Formatea el código con Prettier.

---

### `format:check`

```bash
pnpm format:check
```

**Comando:** `prettier --check .`

**Descripción:** Comprueba el formato sin modificar archivos. Útil en CI.

---

### `react:doctor`

```bash
pnpm react:doctor
```

**Comando:** `react-doctor . --verbose --full`

**Descripción:** Análisis de deuda técnica / patrones de React en el árbol del proyecto.

---

## Flujo de trabajo recomendado

| Tarea                    | Script(s)                         |
| ------------------------ | --------------------------------- |
| Desarrollo local         | `pnpm dev`                        |
| Desarrollo tras caché raro | `pnpm dev:clean`                |
| Compilar para producción | `pnpm build`                      |
| Vista previa local       | `pnpm start` o `pnpm preview`     |
| Despliegue               | Vercel / Netlify / host con Node  |
| Revisar código           | `pnpm lint`                       |
| Comprobar formato        | `pnpm format:check`               |
| Formatear código         | `pnpm format`                     |
| Auditoría React          | `pnpm react:doctor`               |

---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
