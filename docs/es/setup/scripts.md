# Scripts del Proyecto

Este documento describe todos los scripts disponibles en `package.json` y su función.

---

## Desarrollo

### `dev`

```bash
pnpm dev
```

**Comando:** `next dev`

**Descripción:** Inicia el servidor de desarrollo de Next.js con hot-reload. Por defecto corre en `http://localhost:3000`.

---

### `start`

```bash
pnpm start
```

**Comando:** `next start`

**Descripción:** Inicia el servidor de producción de Next.js. Requiere haber ejecutado `build` previamente.

---

### `preview`

```bash
pnpm preview
```

**Comando:** `next start`

**Descripción:** Igual que `start`. Sirve para previsualizar el build de producción localmente.

---

## Build

### `build`

```bash
pnpm build
```

**Comando:** `next build`

**Descripción:** Compila la aplicación para producción. Si usas `output: 'export'` en next.config, genera la carpeta `out/` para hosting estático.

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

**Descripción:** Formatea automáticamente todo el código según Prettier.

---

### `format:check`

```bash
pnpm format:check
```

**Comando:** `prettier --check .`

**Descripción:** Verifica el formato sin modificar archivos. Útil para CI/CD.

---

## Despliegue

### `deploy`

```bash
pnpm deploy
```

**Comando:** `pnpm run build && echo 'Build complete. Push out/ to GitHub Pages or gh-pages branch.'`

**Descripción:** Compila y muestra recordatorio para subir a hosting estático.

---

## Flujo de trabajo recomendado

| Tarea | Script(s) |
|-------|-----------|
| Desarrollo local | `pnpm dev` |
| Compilar para producción | `pnpm build` |
| Preview local | `pnpm start` |
| Desplegar | `pnpm deploy` o Vercel/Netlify |
| Revisar código | `pnpm lint` y `pnpm format:check` |
| Formatear código | `pnpm format` |
