# Fase 2c — Seguridad

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Método:** Revisión estática de código, APIs, middleware, bundle

---

## Tabla de hallazgos

| ID | Severidad | Archivo | Descripción | Estado |
|----|-----------|---------|-------------|--------|
| SEC-01 | **Crítica** | `api/gamification/award/route.ts` | `reason` sin allowlist → farmeo XP/monedas (500/req, 60/min) | Abierto |
| SEC-02 | **Alta** | Repo `supabase/` | Carpeta vacía — migraciones RLS no versionadas | Abierto |
| SEC-03 | **Alta** | `features/exam/data/questions.ts` | `correctAnswer` en bundle cliente (Fase 1) | Abierto |
| SEC-04 | **Alta** | `api/chat/route.ts` | Cuota anónima por cookie manipulable; gasto OpenAI | Abierto |
| SEC-05 | **Media** | `utils/rateLimit.ts` | Sin KV = límite en memoria por instancia | Abierto |
| SEC-06 | **Media** | `api/demo/session/route.ts` | Demo facilita scraping sin identidad | Diseño |
| SEC-07 | **Media** | `contentSecurityPolicy.ts` | `img-src https:` muy permisivo | Abierto |
| SEC-08 | **Media** | `userPersistence.ts` / avatares | Data URL base64; sin allowlist URLs externas | Abierto |
| SEC-09 | **Media** | `r2Config.ts` | Fallback lectura credenciales desde `NEXT_PUBLIC_*` | Footgun |
| SEC-10 | **Baja** | `next.config` vs middleware | Headers duplicados; CSP solo en middleware | Info |
| SEC-11 | **Baja** | `postcss` (audit) | CVE moderada transitiva GHSA-qx2v-qp2m-jg93 | Abierto |
| SEC-12 | **Info** | Bundle cliente | Sin `SERVICE_ROLE`/`OPENAI`/`R2_SECRET` en static | OK |
| SEC-13 | **Info** | XSS perfil | Texto React escapado en perfil público | OK |
| SEC-14 | **Info** | Markdown | `rehype-sanitize` en lecciones y chat asistente | OK |

---

## API routes (8)

| Ruta | Auth | Rate limit | Validación | Notas |
|------|------|------------|------------|-------|
| `/api/gamification/award` | JWT | 60/min | Solo longitud `reason` | **SEC-01** |
| `/api/exam/questions` | JWT/demo + middleware | Sí | Sin `correctAnswer` en respuesta | OK |
| `/api/exam/grade` | JWT/demo | Sí | Demo sin claves en respuesta | OK |
| `/api/learning/quiz/grade` | JWT | Sí | Devuelve `correctAnswer` post-grade | Esperado |
| `/api/chat` | Opcional | 8/min IP anón | Cookie cuota | **SEC-04** |
| `/api/demo/session` | Público | Sí | Cookie 4h httpOnly | **SEC-06** |
| `/api/profile/public/[userId]` | Público | Sí | UUID regex | OK |
| `/api/r2/infographic/[id]` | Público | Sí | ID catálogo | OK |

---

## Autenticación y autorización

### Correcto

- `middleware.ts`: Supabase `getUser()`, demo cookie, CSP nonce, `/dev/` → redirect en prod
- `protectedRoutes.ts`: prefijos dashboard; `/perfil/public` excluido
- `safeRedirect.ts`: anti open-redirect con allowlist
- Cookies demo/chat: `httpOnly`, `secure` prod, `sameSite: lax`
- `ProtectedPage.tsx` + middleware en capas

### Pendiente

- `ProtectedPage`: flash breve sin JS (middleware compensa)
- OAuth callback: timeout 10s; sin botón reintento

---

## Gamificación — brecha SEC-01

```ts
// validateReason: solo longitud 1-64
// Cliente puede: { type: 'xp', points: 500, reason: 'farm_123' }
```

Razones legítimas en servidor:

- `lesson_quiz_{lessonId}`
- `practice_{timestamp}`
- `exam_full_{timestamp}`
- `achievement_{id}`

Ninguna validada en API.

---

## Headers y CSP

| Header | Origen | Valor |
|--------|--------|-------|
| CSP | middleware | nonce prod; `unsafe-eval` solo dev |
| HSTS | middleware + next.config | prod |
| X-Frame-Options | ambos | DENY |
| X-Content-Type-Options | ambos | nosniff |
| Referrer-Policy | middleware | strict-origin-when-cross-origin |
| Permissions-Policy | middleware | camera/mic/geo off |

`connect-src`: Supabase, OpenAI, Vercel vitals — OK.  
Sin CORS abierto — OK.

---

## XSS

| Vector | Estado |
|--------|--------|
| `dangerouslySetInnerHTML` | Solo JSON-LD + theme script con nonce |
| Markdown lecciones | `rehype-sanitize` |
| Chat asistente | `rehype-sanitize` |
| Mensajes usuario chat | Texto plano `<p>` |
| Perfil público bio/nombre | React escape |

---

## Variables de entorno

| Variable | Exposición | Riesgo |
|----------|------------|--------|
| `NEXT_PUBLIC_SUPABASE_*` | Cliente | Esperado; RLS en remoto |
| `NEXT_PUBLIC_SITE_URL` | Cliente | SEO |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | Crítico si filtra |
| `OPENAI_API_KEY` | Solo servidor | OK |
| `R2_*` | Servidor; footgun `NEXT_PUBLIC` | Documentado en `.env.example` |

---

## Prioridad corrección seguridad

1. **Crítica:** allowlist `reason` en gamificación o eliminar endpoint genérico
2. **Alta:** versionar migraciones RLS; sacar `correctAnswer` del cliente
3. **Alta:** reforzar chat (auth obligatorio / KV / captcha)
4. **Media:** KV rate limit prod; endurecer `img-src`; validar URLs avatar
5. **Baja:** actualizar postcss cuando cadena Next lo permita
