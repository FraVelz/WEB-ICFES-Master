# Configuración del entorno

Referencia de variables de entorno y modos de ejecución. Para la instalación inicial, ver
[installation.md](./installation.md).

---

## Variables de entorno

Copia [`.env.example`](../../../.env.example) a `.env.local` en la raíz del proyecto.

| Variable                        | Obligatoria | Descripción                                       |
| ------------------------------- | ----------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Sí          | URL del proyecto Supabase                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí          | Clave anónima pública de Supabase                 |
| `OPENAI_API_KEY`                | No          | API key de OpenAI para `/api/chat` (asistente IA) |

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
