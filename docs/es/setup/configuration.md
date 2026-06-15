# Configuración del entorno

Referencia de variables de entorno y modos de ejecución. Para la instalación inicial, ver
[installation.md](./installation.md).

---

## Variables de entorno

Copia [`.env.example`](../../../.env.example) a `.env.local` en la raíz del proyecto.

| Variable                        | Obligatoria               | Descripción                                                               |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Sí                        | URL del proyecto Supabase                                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí                        | Clave anónima pública de Supabase                                         |
| `OPENAI_API_KEY`                | No                        | API key de OpenAI para `/api/chat` (asistente IA)                         |
| `NEXT_PUBLIC_SITE_URL`          | Recomendada en producción | Origen público para `metadataBase`, sitemap, Open Graph y URLs canónicas  |
| `NEXT_PUBLIC_TWITTER_SITE`      | No                        | Handle de Twitter/X (`@icfesmaster`) para `twitter:site` en metadatos     |
| `KV_REST_API_URL`               | Recomendada en producción | URL REST de Upstash/Vercel KV para rate limiting distribuido en APIs      |
| `KV_REST_API_TOKEN`             | Recomendada en producción | Token de KV; sin esto los límites son en memoria por instancia serverless |

### Rate limiting en APIs

Sin `KV_REST_API_*`, `src/utils/rateLimit.ts` usa un mapa en memoria por instancia (cada cold start en Vercel tiene su propio contador). En producción conviene configurar KV para límites globales en:

- `/api/chat`
- `/api/demo/session`
- `/api/exam/questions` y `/api/exam/grade`
- `/api/gamification/*`
- `/api/profile/public/[userId]`
- `/api/r2/infographic/[id]`

Si faltan las variables en `NODE_ENV=production`, el servidor registra un warning en logs al primer uso del fallback.

En **desarrollo local** no es necesario configurar KV: el fallback en memoria es suficiente para probar la app.

### SEO y metadatos públicos

- **`NEXT_PUBLIC_SITE_URL`:** usada por `getSiteUrl()` en `src/config/site.ts` para `metadataBase`, `robots.ts`, `sitemap.ts` y Open Graph. En Vercel, si no se define, se infiere de `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL`.
- **`NEXT_PUBLIC_TWITTER_SITE`:** opcional; si está definida, se añade `twitter:site` en el layout raíz (`src/app/layout.tsx`).

Sin `NEXT_PUBLIC_SITE_URL` en producción con dominio custom, los enlaces absolutos pueden apuntar al subdominio `.vercel.app` en lugar del dominio canónico.

Sin las variables de Supabase, login/registro y persistencia de cuentas no funcionan. El **modo demo** (landing) sigue usando almacenamiento local en el navegador sin cuenta.

### Supabase Auth (OAuth y recuperación)

En **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (o tu dominio)
- **Redirect URLs:**
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/callback?next=/ruta-aprendizaje`
  - `http://localhost:3000/reset-password`
  - `https://tu-dominio.com/auth/callback`

---

## Next.js

| Opción               | Valor  | Efecto                                                |
| -------------------- | ------ | ----------------------------------------------------- |
| `trailingSlash`      | `true` | Las URLs públicas llevan `/` final (p. ej. `/login/`) |
| `images.unoptimized` | `true` | Imágenes sin optimización de Next Image               |

Redirect permanente: `/aprendizaje` → `/ruta-aprendizaje` (ver `next.config.ts`).

---

## Modo demo

Desde la landing, el usuario puede entrar en **modo demo** sin cuenta. El estado vive en Zustand (`uiSession.demoMode`).
Ver [services-api.md](../backend/services-api.md) y `src/features/home/utils/enterDemoMode.ts`.

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
