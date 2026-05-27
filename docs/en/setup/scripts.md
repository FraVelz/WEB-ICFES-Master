# Project scripts

This document describes the scripts defined in `package.json` and what they do.

---

## Development

### `dev`

```bash
pnpm dev
```

**Command:** `next dev`

**Description:** Starts the Next.js development server with hot reload. Defaults to `http://localhost:3000`.

---

### `dev:clean`

```bash
pnpm dev:clean
```

**Command:** `rm -rf .next && next dev`

**Description:** Deletes `.next` and starts the dev server again (useful when build cache causes issues).

---

### `start`

```bash
pnpm start
```

**Command:** `next start`

**Description:** Starts the Next.js production server. Run `pnpm build` first.

---

### `preview`

```bash
pnpm preview
```

**Command:** `next start`

**Description:** Alias of `start` to preview the production build locally.

---

## Build and tests

### `build`

```bash
pnpm build
```

**Command:** `next build`

**Description:** Production build (output in `.next/`). This repo does **not** enable `output: 'export'` by default;
`out/` is not generated unless you add that option in `next.config`.

---

### `test`

```bash
pnpm test
```

**Command:** `vitest run`

**Description:** Runs the unit test suite (utilities, area constants, gamification).

---

### `test:watch`

```bash
pnpm test:watch
```

**Command:** `vitest`

**Description:** Runs tests in watch mode during development.

---

## Code quality

### `lint`

```bash
pnpm lint
```

**Command:** `eslint .`

**Description:** Runs ESLint across the project.

---

### `format`

```bash
pnpm format
```

**Command:** `prettier --write .`

**Description:** Formats code with Prettier.

---

### `format:check`

```bash
pnpm format:check
```

**Command:** `prettier --check .`

**Description:** Checks formatting without writing files. Useful in CI.

---

### `react:doctor`

```bash
pnpm react:doctor
```

**Command:** `react-doctor . --verbose --full`

**Description:** React-focused health scan of the codebase.

---

### `lint:md`

```bash
pnpm lint:md
```

**Command:** `markdownlint-cli2`

**Description:** Lints Markdown files (documentation under `docs/`).

---

### `lint:md:fix`

```bash
pnpm lint:md:fix
```

**Command:** `markdownlint-cli2 --fix`

**Description:** Auto-fixes Markdown formatting issues when possible.

---

## Recommended workflow

| Task                | Script(s)                      |
| ------------------- | ------------------------------ |
| Local development   | `pnpm dev`                     |
| Dev after bad cache | `pnpm dev:clean`               |
| Production build    | `pnpm build`                   |
| Local preview       | `pnpm start` or `pnpm preview` |
| Deploy              | Vercel / Netlify / Node host   |
| Lint                | `pnpm lint`                    |
| Unit tests          | `pnpm test`                    |
| Format check        | `pnpm format:check`            |
| Format code         | `pnpm format`                  |
| Docs lint           | `pnpm lint:md`                 |
| React audit         | `pnpm react:doctor`            |

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
