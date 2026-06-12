# Fase 3 — Informe final y backlog

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Documentos:** `00-inventario` → `01-herramientas` → `02a–02d` → este informe

---

## Resumen ejecutivo

| Ámbito | Estado general | Críticos | Altos | Medios | Bajos |
|--------|----------------|----------|-------|--------|-------|
| SEO | Base técnica sólida | 0 | 2 | 5 | 7 |
| Accesibilidad | Buena base, huecos en examen | 0 | 2 | 11 | 5 |
| Seguridad | Headers/CSP OK; economía expuesta | **1** | 3 | 5 | 2 |
| UI/UX | Tokens OK; móvil examen crítico | 0 | 2 | 9 | 5 |

**Total hallazgos documentados:** 54 (sin contar duplicados cross-ámbito).

---

## Matriz consolidada (ID global)

| ID | Ámbito | Sev. | Descripción | Archivo clave |
|----|--------|------|-------------|---------------|
| G-01 | Seg | Crítica | Farmeo XP/monedas API award | `api/gamification/award/route.ts` |
| G-02 | Seg | Alta | RLS/migraciones no en repo | `supabase/` |
| G-03 | Seg | Alta | `correctAnswer` en bundle cliente | `exam/data/questions.ts` |
| G-04 | UX | Alta | Nav móvil tapa examen | `constants.ts` |
| G-05 | SEO | Alta | 2× h1 en home | `HomePage.tsx` |
| G-06 | SEO | Alta | Sin h1 en `/lectura/` | `LecturaPage.tsx` |
| G-07 | A11y | Alta | Hoja respuestas sin diálogo | `PracticeMobileAnswerSheet.tsx` |
| G-08 | A11y | Alta | Examen sin radiogroup | `PracticeQuestionCard.tsx` |
| G-09 | Seg | Alta | Chat anónimo abusable | `api/chat/route.ts` |

---

## Definition of Done — auditoría

| Criterio | Estado |
|----------|--------|
| Inventario 28 rutas documentado | ✅ `00-inventario-rutas.md` |
| Herramientas ejecutadas (audit, Lighthouse, bundle) | ✅ `01-herramientas.md` |
| Informes por ámbito (SEO, a11y, seg, UX) | ✅ `02a–02d` |
| Informe final + backlog | ✅ este documento |
| 0 hallazgos críticos **corregidos** | ❌ G-01 abierto (auditoría solo documenta) |
| Lighthouse SEO ≥90 home + content | ✅ (91–92) |
| Lighthouse a11y ≥90 home + content | ✅ (95–100) |
| `NEXT_PUBLIC_SITE_URL` verificado en prod | ⚠️ verificar deploy Vercel |

**La auditoría documental está completa.** Las correcciones de código son un sprint separado.

---

## Backlog priorizado para implementación

### Sprint 1 — Seguridad (bloqueante)

| # | Tarea | Tipo commit sugerido |
|---|-------|---------------------|
| 1 | Allowlist `reason` en `/api/gamification/award` | `fix(services)` |
| 2 | Auditar/aplicar migraciones RLS en Supabase prod + versionar SQL | `chore(supabase)` |
| 3 | Mover preguntas estáticas a server-only o strip `correctAnswer` en build cliente | `fix(exam)` |
| 4 | Reforzar cuota chat (auth mínimo o KV) | `fix(learning)` |

### Sprint 2 — UX móvil examen

| # | Tarea | Tipo commit |
|---|-------|-------------|
| 5 | `HIDE_MOBILE_MAIN_NAV_PATHS` incluye práctica y examen completo | `fix(exam)` |
| 6 | `pb-20` + safe-area en vistas activas examen | `fix(exam)` |
| 7 | `useDialogA11y` en `PracticeMobileAnswerSheet` | `fix(a11y)` |
| 8 | Semántica `radiogroup` en preguntas examen | `fix(a11y)` |

### Sprint 3 — SEO + a11y rápido

| # | Tarea | Tipo commit |
|---|-------|-------------|
| 9 | Un solo h1 en home | `fix(seo)` |
| 10 | h1 en LecturaPage | `fix(seo)` |
| 11 | Quitar canonical conflictivo ruta-al-500 | `fix(seo)` |
| 12 | `role="alert"` forgot/reset password | `fix(a11y)` |
| 13 | Sitemap con `CONTENT_LAST_UPDATED` | `fix(seo)` |

### Sprint 4 — UX polish

| # | Tarea | Tipo commit |
|---|-------|-------------|
| 14 | Toast global lecciones/resultados | `feat(dashboard)` |
| 15 | EmptyState + retry en FullExam/Clasificatoria/Tienda error | `fix(ux)` |
| 16 | Skeletons perfil | `fix(ux)` |
| 17 | Reduced motion lecciones GSAP | `fix(a11y)` |
| 18 | KV rate limit en prod | `chore(infra)` |

### Backlog bajo (opcional)

- twitter:site, Search Console, OG por ruta
- breadcrumbs dashboard, touch targets secundarios
- logo JSON-LD, robots `/dev/`
- postcss CVE cuando Next actualice cadena

---

## Lighthouse — referencia rápida (móvil)

| URL | Perf | A11y | SEO |
|-----|------|------|-----|
| `/` | 89 | 100 | 92 |
| `/lectura/` | 93 | 95 | 91 |
| `/importancia/` | 93 | 96 | 91 |
| `/login/` | 96 | 90 | 54 |

---

## Entregables completados

1. ✅ Informe markdown por fase (`docs/es/auditoria/`)
2. ✅ Matriz 28 rutas (`00-inventario-rutas.md`)
3. ✅ Scores Lighthouse documentados (`01-herramientas.md`)
4. ✅ Backlog priorizado (este documento)

---

## Próximo paso recomendado

Ejecutar **Sprint 1** (seguridad gamificación) antes de considerar la app “auditada y remediada”. Los informes en `docs/es/auditoria/` permanecen como línea base para comparar tras cada sprint de fixes.
