# Fase 1 — Herramientas automatizadas

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Entorno:** Build producción local (`pnpm build` + `pnpm start` en `localhost:3099`)

---

## 1. `pnpm audit --audit-level moderate`

| Severidad | Paquete | Versión vulnerable | Ruta | Notas |
|-----------|---------|-------------------|------|-------|
| **Moderate** | `postcss` | `<8.5.10` | `next>postcss`, `@vercel/analytics>next>postcss` | GHSA-qx2v-qp2m-jg93 — XSS vía `</style>` en stringify |

**Resultado:** 1 vulnerabilidad moderada (transitiva vía Next.js). Actualizar cuando Next/postcss publiquen parche en la cadena de dependencias.

---

## 2. Lighthouse (móvil, Chrome headless)

Categorías: Performance, Accessibility, SEO, Best Practices.  
Form factor: mobile.  
URLs accesibles sin autenticación.

| URL | Perf | A11y | SEO | Best Practices |
|-----|------|------|-----|----------------|
| `/` (home) | 89 | **100** | 92 | 96 |
| `/lectura/` | 93 | 95 | 91 | 96 |
| `/importancia/` | 93 | 96 | 91 | 96 |
| `/consejos/` | 92 | 96 | 91 | 96 |
| `/informacion/` | 93 | 96 | 91 | 96 |
| `/login/` | 96 | 90 | **54** | 96 |

### URLs dashboard (no escaneadas)

Requieren sesión o cookie demo: `/ruta-aprendizaje/`, `/practica/matematicas/`, `/examen-completo/`, `/clasificatoria/`, `/tienda/`, `/configuracion/`.  
**Recomendación:** repetir Lighthouse con cookie `icfes_demo=1` o cuenta de prueba en CI.

### Hallazgos Lighthouse destacados

| URL | Auditoría | Score | Detalle |
|-----|-----------|-------|---------|
| `/lectura/` | `color-contrast` | 0 | Contraste insuficiente en algún texto/fondo |
| `/login/` | SEO global | 54 | Esperado parcialmente: `noindex` en layout auth reduce señales SEO |
| `/` (home) | — | — | Sin fallos a11y automáticos detectados (score 100) |

JSON crudos guardados localmente en `docs/es/auditoria/lighthouse/*.json` (no versionados — solo resumen aquí).

---

## 3. Inspección de bundle (`correctAnswer` y secretos)

Tras `pnpm build`, búsqueda en `.next/`:

### `correctAnswer` en cliente (estático)

| Archivo | Tipo | Riesgo |
|---------|------|--------|
| `.next/static/chunks/8078-*.js` | Client chunk (resultados examen) | Medio — lógica de resultados |
| `.next/static/chunks/4806-*.js` | Client chunk | Medio |
| `.next/static/chunks/app/(dashboard)/ruta-aprendizaje/leccion/.../layout-*.js` | Client layout lección | Medio — quiz en contenido |
| `.next/static/chunks/app/layout.js` | Root layout | Revisar imports |

### `correctAnswer` en servidor

| Archivo | Tipo |
|---------|------|
| `.next/server/chunks/5956.js` | Preguntas estáticas con respuestas embebidas (`questionFactory`, áreas) |
| `.next/server/chunks/7238.js`, `129.js`, `5862.js` | Chunks de examen/learning |
| `.next/server/app/api/exam/grade/route.js` | API grade — esperado |
| `.next/server/app/api/learning/quiz/grade/route.js` | API quiz — esperado |

**Conclusión:** Las preguntas estáticas de fallback (`src/features/exam/data/`) se empaquetan con `correctAnswer` accesible vía DevTools en chunks del cliente asociados a rutas de examen/learning.

### Secretos en bundle cliente

Búsqueda de `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `R2_SECRET` en `.next/static/`: **sin coincidencias**.

`NEXT_PUBLIC_SUPABASE_URL` puede aparecer en servidor — esperado.

---

## 4. axe / revisión automatizada complementaria

No se instaló `@axe-core/playwright` en CI. Proxy vía auditorías Lighthouse accessibility:

- Home: sin violaciones axe-equivalentes reportadas.
- Lectura: contraste de color.
- Login: score a11y 90 — revisar manualmente foco en inputs OAuth.

**Pendiente manual (Fase 2b):** modales sin `useDialogA11y`, examen sin `radiogroup`, `PracticeMobileAnswerSheet`.

---

## 5. Resumen Fase 1

| ID | Severidad | Hallazgo |
|----|-----------|----------|
| T01 | Media | 1 CVE moderada en `postcss` (transitiva) |
| T02 | Alta | `correctAnswer` en chunks cliente (examen/learning) |
| T03 | Media | `/lectura/` fallo `color-contrast` en Lighthouse |
| T04 | Baja | Dashboard sin Lighthouse por auth |
| T05 | Info | Home a11y 100 / SEO 92 en móvil |

---

## 6. Próximo paso

Fase 2a: informe SEO detallado → `02a-seo.md`.
