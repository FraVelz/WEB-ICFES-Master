# Project Scripts

This document describes all scripts available in `package.json` and their purpose.

---

## Development

### `dev`

```bash
pnpm dev
```

**Command:** `next dev`

**Description:** Starts the Next.js development server with hot-reload. By default runs at `http://localhost:3000`.

---

### `start`

```bash
pnpm start
```

**Command:** `next start`

**Description:** Starts the Next.js production server. Requires running `build` first.

---

### `preview`

```bash
pnpm preview
```

**Command:** `next start`

**Description:** Same as `start`. Used to preview the production build locally.

---

## Build

### `build`

```bash
pnpm build
```

**Command:** `next build`

**Description:** Compiles the application for production. If using `output: 'export'` in next.config, generates the `out/` folder for static hosting.

---

## Code quality

### `lint`

```bash
pnpm lint
```

**Command:** `eslint .`

**Description:** Runs ESLint across the entire project.

---

### `format`

```bash
pnpm format
```

**Command:** `prettier --write .`

**Description:** Automatically formats all code according to Prettier.

---

### `format:check`

```bash
pnpm format:check
```

**Command:** `prettier --check .`

**Description:** Verifies format without modifying files. Useful for CI/CD.

---

## Deployment

### `deploy`

```bash
pnpm deploy
```

**Command:** `pnpm run build && echo 'Build complete. Push out/ to GitHub Pages or gh-pages branch.'`

**Description:** Builds and shows reminder to push to static hosting.

---

## Recommended workflow

| Task              | Script(s)                    |
| ----------------- | ---------------------------- |
| Local development | `pnpm dev`                   |
| Production build  | `pnpm build`                 |
| Local preview     | `pnpm start`                 |
| Deploy            | `pnpm deploy` or Vercel/Netlify |
| Code review       | `pnpm lint` and `pnpm format:check` |
| Format code       | `pnpm format`                |
