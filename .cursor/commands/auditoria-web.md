# Auditoría web — SEO, accesibilidad, UX/UI y seguridad (`/auditoria-web`)

## Cuándo ejecutar

- El usuario invoca **`/auditoria-web`** o pide una auditoría enfocada en **SEO**, **accesibilidad (a11y)**,
  **experiencia UI/UX** o **seguridad** de la web del cliente.
- Complementa **`/problems-search`** (auditoría global de build, arquitectura, CI, etc.); este comando **no** sustituye
  esa revisión amplia, sino que profundiza en calidad percibida por usuarios, buscadores y superficie de ataque.
- **No** implica corregir nada salvo petición explícita posterior; primero **inventariar, evidenciar y priorizar**.

## Alcance del proyecto

Aplica a **`WEB-ICFES-Master/`** (`web-icfes-master`). Si el usuario no indica otra app, asumir el cliente Next.js 15
en `src/app/`. Ver **`monorepo-projects.mdc`** si el contexto apunta al admin o la app móvil.

## Objetivo

Entregar un informe **accionable** en cuatro ejes, ordenado por **prioridad** (P0→P3) e **impacto en producción**:

1. **SEO** — indexación, metadata, enlaces, rendimiento percibido por crawlers.
2. **Accesibilidad** — WCAG 2.2 orientativo (teclado, foco, contraste, semántica, lectores de pantalla).
3. **UI/UX** — flujos críticos, estados de carga/error, consistencia visual, fricción móvil/desktop.
4. **Seguridad** — headers, API routes, auth, secretos, validación de entrada, rate limiting, dependencias.

## Qué debe hacer el asistente

1. **Comprobaciones automáticas** (sin saltar hooks ni alterar git config):
   - `pnpm run lint`
   - `pnpm run build` (como en CI)
   - `pnpm run audit` (CVE en dependencias; reportar solo hallazgos reales)
   - Opcional si aporta valor: `pnpm run format:check`, `pnpm run react:doctor`
2. **Revisión dirigida del código** según las checklists de cada eje (abajo).
3. **Evidencia obligatoria**: cada hallazgo cita archivo/ruta, línea aproximada o salida de comando. Hipótesis → marcar
   _posible_ y qué comprobaría (p. ej. contraste en runtime, Lighthouse manual).
4. **No inventar problemas** ni extrapolar CVE sin salida de `pnpm audit` o fuente verificable.
5. **No commitear ni pushear** salvo petición explícita.

### Alcance opcional del usuario

Si el usuario indica **ruta**, **feature** o **página** (`@`, URL, «solo landing», «solo auth»), acotar la revisión pero
mantener el formato del informe en las cuatro secciones (puede haber «Sin hallazgos» en un eje).

---

## Escala de prioridad

| Nivel  | Etiqueta | Criterio orientativo                                                                 |
| ------ | -------- | ------------------------------------------------------------------------------------ |
| **P0** | Crítico  | XSS/inyección, exposición de secretos, rutas API sin auth donde la hay, bloqueo total de uso. |
| **P1** | Alto     | SEO roto en páginas públicas clave, a11y que impide completar flujos, UX rota en auth/dashboard. |
| **P2** | Medio    | Metadata incompleta, foco/contraste débil, fricción UX notable, headers o validación mejorables. |
| **P3** | Bajo     | Mejoras de copy SEO, micro-interacciones, nitpicks de a11y sin bloqueo, hardening opcional. |

---

## 1. SEO

### Global y configuración

- `src/app/layout.tsx` — `metadata`, `metadataBase`, `title.template`, `robots`, Open Graph, Twitter.
- `src/config/site.ts`, `src/config/seo.ts`, `src/config/ogImage.ts`, `src/config/publicContentPages.ts`.
- `src/app/robots.ts`, `src/app/sitemap.ts` — URLs canónicas, exclusión de rutas privadas `(dashboard)`, `trailingSlash`.
- `next.config.ts` — redirects permanentes, `images.remotePatterns`.
- `.env.example` — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TWITTER_SITE` documentados y coherentes con producción.

### Páginas públicas (prioridad de revisión)

- Landing: `src/app/page.tsx`, features en `src/features/home/`.
- Contenido: `src/app/(content)/` (`importancia`, `consejos`, `informacion`, `lectura`).
- Legales: `src/app/privacidad/`, `src/app/terminos/`.
- Perfil público: `src/app/perfil/public/`, `src/app/api/profile/public/[userId]/`.
- Evaluación: `src/app/evaluacion-nivel/`.
- `src/app/not-found.tsx` — metadata y UX de 404.

### Checklist SEO

- [ ] Una sola `<h1>` semántico por página pública; jerarquía `h2`–`h6` coherente.
- [ ] `title` y `description` únicos por ruta indexable; sin duplicados genéricos.
- [ ] `canonical` / URLs absolutas vía `metadataBase` + rutas con barra final (`trailingSlash: true`).
- [ ] Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `locale: es_CO`.
- [ ] `robots` correcto: **noindex** en auth, dashboard, APIs y páginas de sesión; **index** en marketing/contenido.
- [ ] Sitemap incluye solo rutas públicas estables; sin slugs rotos ni rutas de demo.
- [ ] Enlaces internos desde landing y contenido hacia rutas clave; sin `href="#"` vacíos en CTAs principales.
- [ ] Texto alternativo en imágenes hero/OG decorativas vs informativas (`alt=""` solo si es puramente decorativa).
- [ ] JSON-LD / structured data — si falta en landing, valorar como P2–P3 (no obligatorio salvo que exista patrón en repo).
- [ ] Core Web Vitals indirectos: imágenes `next/image` donde aplique, fuentes sin FOIT excesivo, scripts de terceros
      (`@vercel/analytics`, theme init en `layout.tsx`) no bloqueantes.

---

## 2. Accesibilidad (a11y)

### Áreas críticas

- Auth: `src/app/(auth)/` (login, signup, forgot/reset password, onboarding).
- Dashboard shell: `src/app/(dashboard)/layout.tsx`, `src/components/DashboardHeader/`.
- Examen y aprendizaje: `src/features/exam/`, `src/features/learning/` (chat, roadmap, modales).
- Formularios y modales: settings, tienda, logros, PDF viewer.
- Contenido matemático: KaTeX (`react-katex`) — legibilidad y anuncio para AT.
- Tema: `src/features/theme/`, script de tema en `layout.tsx` + `prefers-color-scheme` / contraste en dark mode.
- Estados globales: `src/app/global-error.tsx`, `src/components/ErrorBoundary.tsx`.

### Checklist a11y

- [ ] Navegación completa por **teclado** (Tab, Shift+Tab, Enter, Escape en modales).
- [ ] **Foco visible** (`:focus-visible` en `globals.css` y componentes); sin `outline: none` sin reemplazo.
- [ ] Controles icon-only con `aria-label` o texto visible.
- [ ] Formularios: `<label>` asociado, `aria-invalid`, mensajes de error vinculados (`aria-describedby`).
- [ ] Modales/drawers: trap de foco, `role="dialog"`, `aria-modal`, cierre con Escape.
- [ ] Botones vs enlaces: `<button>` para acciones, `<a href>` para navegación.
- [ ] Contraste texto/fondo (objetivo WCAG AA 4.5:1 texto normal; 3:1 texto grande) — marcar _posible_ si no se midió con
      herramienta.
- [ ] `prefers-reduced-motion`: animaciones GSAP y CSS respetan la media query (ver `src/lib/gsap.ts`, `globals.css`).
- [ ] Live regions para toasts/alertas dinámicas (`aria-live`) donde haya feedback asíncrono.
- [ ] Skip link o landmark `<main>` en layouts principales.
- [ ] Imágenes informativas con `alt` descriptivo; decorativas con `alt=""`.
- [ ] Tablas/listas de leaderboard y rankings: encabezados o roles accesibles.

---

## 3. UI/UX

### Flujos a evaluar (happy path + errores)

| Flujo              | Rutas / código principal                                              |
| ------------------ | --------------------------------------------------------------------- |
| Primera visita     | Landing → signup/login → onboarding                                   |
| Dashboard          | `(dashboard)/` home, sidebar móvil/desktop                            |
| Aprendizaje        | `ruta-aprendizaje`, `lessons/[area]/[topic]`, chat asistente          |
| Examen / práctica  | `practica/[area]`, simulacros, feedback de respuestas                 |
| Gamificación       | logros, tienda, leaderboard                                           |
| Perfil y ajustes   | perfil, settings, modo demo                                           |
| Contenido público  | páginas `(content)/`, PDFs, evaluación de nivel                         |

### Checklist UX/UI

- [ ] **Jerarquía visual** clara: título, acción primaria, secundaria distinguibles.
- [ ] **Estados de carga** (skeleton/spinner) en fetchs lentos; sin layout shift brusco.
- [ ] **Estados vacíos y error** con mensaje útil y CTA de recuperación (reintentar, volver).
- [ ] **Feedback** tras acciones (guardar, comprar, completar lección): confirmación visible.
- [ ] **Móvil**: tap targets ≥ 44px, sin overflow horizontal, nav inferior/accesible.
- [ ] **Consistencia**: tokens Tailwind semánticos, dark mode sin componentes «rotos».
- [ ] **Copy** claro en español; microcopy de errores accionable (no solo «Error»).
- [ ] **Fricción**: pasos de más en auth/onboarding; modales que no se pueden cerrar.
- [ ] **Chat OpenAI**: indicador de streaming, límite de cuota visible, degradación si falla la API.
- [ ] **Demo mode**: transición clara entre demo y cuenta real sin pérdida de contexto confusa.
- [ ] Animaciones no bloquean interacción; duración razonable (< 500 ms para UI crítica).

Opcional: `pnpm run react:doctor` — incorporar hallazgos relevantes a UX (prop drilling extremo, componentes gigantes)
solo si impactan mantenibilidad percibida o bugs de UI.

---

## 4. Seguridad

### Configuración y superficie

- `next.config.ts` — `securityHeaders` (CSP si existe, HSTS prod, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- Secretos: `.env.example` vs uso en código; **nunca** `service_role` ni `OPENAI_API_KEY` en cliente.
- `src/config/supabaseClient.ts` — separación server/client; cookies de sesión.
- Dependencias: salida de `pnpm run audit`.

### API routes (`src/app/api/`)

Revisar cada handler: auth, validación, rate limit, métodos HTTP permitidos, fugas de información.

| Ruta                               | Riesgos a comprobar                                      |
| ---------------------------------- | -------------------------------------------------------- |
| `api/chat/route.ts`                | Rate limit, JWT, límites de mensajes, sin filtrar system prompt |
| `api/exam/grade`, `learning/quiz/grade` | Auth, validación de payload, anti-trampa cliente    |
| `api/gamification/*`               | Solo usuario autenticado; sin inflar puntos arbitrariamente |
| `api/demo/session`                 | Alcance demo acotado; sin escalada a prod                |
| `api/r2/infographic/[id]`          | IDs predecibles, path traversal, cache headers           |
| `api/profile/public/[userId]`      | Solo datos públicos; sin PII sensible                    |

### Auth y rutas protegidas

- `(dashboard)/layout.tsx` y guards — redirección sin flash de contenido privado.
- `src/app/auth/callback/` — intercambio OAuth seguro.
- Cookies de chat/cuota — `httpOnly`, `secure` en prod, `sameSite` donde aplique.
- Markdown/HTML renderizado: `rehype-sanitize` en rutas que aceptan rich text.
- CORS / CSRF en POST sensibles (SameSite + verificación de origen si aplica).

### Checklist seguridad

- [ ] Sin secretos en repo ni en `NEXT_PUBLIC_*` indebidos.
- [ ] API routes mutables exigen autenticación o rate limit estricto (chat anónimo).
- [ ] Validación y límites de tamaño en body (ej. chat `MAX_MESSAGE_LENGTH`).
- [ ] Errores 500 sin stack trace al cliente en producción.
- [ ] Headers de seguridad en todas las rutas (`headers()` en `next.config.ts`).
- [ ] Supabase RLS asumido en servidor — si el código confía solo en cliente, marcar P0/P1.
- [ ] Enlaces externos con `rel="noopener noreferrer"` cuando `target="_blank"`.
- [ ] Subida de archivos / R2: tipos MIME y tamaño acotados si existe upload.

Para revisión profunda de diff local: sugerir skill **`/review-security`** si el usuario lo pide después.

---

## Formato del informe (obligatorio)

Responder en **español**, con esta estructura:

```markdown
## Resumen ejecutivo

- Hallazgos por eje: SEO (n), A11y (n), UX (n), Seguridad (n).
- P0: … | P1: … | P2: … | P3: …
- 1–3 frases: qué atacar primero y por qué.

## SEO

### P0 / P1
- [ ] **Título** — ruta — impacto — fix sugerido (1 línea)

### P2 / P3
…

## Accesibilidad

### P0 / P1
…

### P2 / P3
…

## UI/UX

### P0 / P1
…

### P2 / P3
…

## Seguridad

### P0 / P1
…

### P2 / P3
…

## Comprobaciones ejecutadas

- `pnpm run lint` — OK / fallos
- `pnpm run build` — OK / fallos
- `pnpm run audit` — OK / CVE listados
- (otros)

## Áreas sin hallazgos relevantes

- Breve lista opcional por eje.
```

### Reglas del informe

- Máximo **~20–30 ítems** con impacto real; agrupar nitpicks en un bullet por eje en P3.
- Si un eje está limpio, decirlo explícitamente.
- Separar **problema** de **recomendación**; la recomendación en la misma línea o sub-bullet corto.
- Priorizar hallazgos en **páginas públicas y flujos de conversión** (landing → registro → uso).

---

## Resumen para el agente

- Auditoría **focalizada** en SEO, a11y, UX/UI y seguridad del cliente Next.js.
- Ejecutar lint, build y audit; revisar rutas y APIs con evidencia.
- Informe en cuatro secciones + prioridad P0→P3; **no** aplicar fixes masivos sin petición.
- Auditoría amplia (CI, arquitectura, deuda): derivar a **`/problems-search`**.
