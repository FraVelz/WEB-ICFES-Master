# Fase 4 — Estado de remediación (post-fixes)

**Fecha:** 2026-06-12  
**Commits de código:** `1897a8a` … `9f41e67` (5 commits en `main` local)

---

## Hallazgos críticos/altos del informe

| ID | Estado | Notas |
|----|--------|-------|
| G-01 Farmeo XP/monedas | ✅ | Allowlist en `/api/gamification/award` |
| G-02 RLS en repo | ⚠️ | `rls_baseline` ya en Supabase remoto; repo sincroniza nuevas migraciones en `supabase/migrations/` |
| G-03 `correctAnswer` en cliente | ✅ | Pool estático `server-only`; fichas fuera del bundle |
| G-04 Nav móvil examen | ✅ | `HIDE_MOBILE_MAIN_NAV_PATHS` |
| G-05 / G-06 h1 home y lectura | ✅ | |
| G-07 / G-08 a11y examen | ✅ | Diálogo + radiogroup |
| G-09 Chat anónimo | ✅ | POST exige auth + UI |

---

## Supabase (`web-icfes-master`)

**Tablas con RLS activo:** `users`, `user_gamification`, `learning_content`, `exam_questions`, `profile_reports`, etc.

**Migraciones remotas (2026-06-12):**

- `split_learning_lesson_body_sections`
- `consolidate_lesson_content_dividers`
- `rls_baseline`
- `league_rank_config_rls_and_lock_admin_rpc` (aplicada en esta remediación)

**Pendiente en Supabase (requiere tu revisión):**

| Severidad | Tema | Acción sugerida |
|-----------|------|-----------------|
| ERROR | Vista `exam_questions_public` SECURITY DEFINER | Valorar `SECURITY INVOKER` o restringir grants |
| WARN | RPC ligas ejecutables por `anon` | Parcialmente cerrado; revisar advisors tras deploy |
| WARN | Protección contraseñas filtradas desactivada | Dashboard → Auth → Password security |
| WARN | GraphQL expone tablas a `anon` | Solo relevante si usas GraphQL; la app usa REST |

---

## Verificación local

| Check | Resultado |
|-------|-----------|
| `pnpm test` | 99/99 ✅ |
| `pnpm build` | ✅ |
| Bundle cliente sin pool estático | ✅ (sin `fichas2022` en `.next/static`) |
| Lighthouse prod local (móvil, post-fix) | home: perf 88, a11y **100**, seo 92; lectura: perf 93, a11y 95, seo 91 |

---

## Tu checklist (manual)

1. **Vercel:** `NEXT_PUBLIC_SITE_URL=https://icfesmaster.com` (o tu dominio canónico).
2. **Vercel KV / Upstash:** `KV_REST_API_URL` + `KV_REST_API_TOKEN` para rate limit en prod.
3. **Twitter:** `NEXT_PUBLIC_TWITTER_SITE=@tu_cuenta` si tienes cuenta de marca.
4. **Search Console:** registrar propiedad y enviar `sitemap.xml`.
5. **Push + deploy** de los 5+ commits locales y re-ejecutar Lighthouse en prod.

---

## Backlog bajo aún abierto

- OG/imagen por ruta (más allá de `opengraph-image.png` global)
- Breadcrumbs en dashboard
- Touch targets secundarios
- PostCSS CVE (override en `package.json` hasta actualización Next)
