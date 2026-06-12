# Fase 0 — Inventario de rutas y componentes críticos

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Alcance:** 28 rutas App Router, 8 API routes, modales, formularios, razones de gamificación.

---

## 1. Matriz de rutas (28 páginas)

Leyenda: ✅ presente · ❌ ausente · ➖ heredado del layout · 🔒 `noindex`

| # | Ruta pública | Archivo `page.tsx` | Metadata propia | noindex | Canonical | Skip link | `<main>` | `loading.tsx` | `error.tsx` | `<h1>` en UI |
|---|--------------|-------------------|-----------------|---------|-----------|-----------|----------|---------------|-------------|--------------|
| 1 | `/` | `src/app/page.tsx` | ✅ | ❌ index | ✅ `/` | ✅ HomePage | ✅ | ❌ | ➖ root | ⚠️ **2× h1** (mobile sr-only + desktop) |
| 2 | `/lectura/` | `(content)/lectura/page.tsx` | ✅ | ❌ | ✅ | ✅ ContentPageShell | ✅ | ❌ | ➖ | ❌ sin h1 |
| 3 | `/importancia/` | `(content)/importancia/page.tsx` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ➖ | ✅ ImportanciaPage |
| 4 | `/consejos/` | `(content)/consejos/page.tsx` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ➖ | ✅ TipsPage |
| 5 | `/informacion/` | `(content)/informacion/page.tsx` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ➖ | ✅ InformacionPage |
| 6 | `/privacidad/` | `privacidad/page.tsx` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ➖ | ✅ |
| 7 | `/terminos/` | `terminos/page.tsx` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ➖ | ✅ |
| 8 | `/login/` | `(auth)/login/page.tsx` | ✅ | 🔒 layout | ❌ | ✅ auth layout | ✅ | ❌ | ➖ | ✅ LoginForm |
| 9 | `/signup/` | `(auth)/signup/page.tsx` | ✅ | 🔒 | ❌ | ✅ | ✅ | ❌ | ➖ | ✅ SignupPageHeader |
| 10 | `/forgot-password/` | `(auth)/forgot-password/page.tsx` | ✅ | 🔒 | ❌ | ✅ | ✅ | ❌ | ➖ | ✅ |
| 11 | `/reset-password/` | `(auth)/reset-password/page.tsx` | ✅ | 🔒 | ❌ | ✅ | ✅ | ❌ | ➖ | ✅ |
| 12 | `/onboarding/` | `(auth)/onboarding/page.tsx` | ✅ | 🔒 | ❌ | ✅ | ✅ | ❌ | ➖ | ❌ (h2 en stages) |
| 13 | `/auth/callback/` | `auth/callback/page.tsx` | ➖ layout | 🔒 layout | ❌ | ❌ | ➖ client | ❌ | ➖ | ❌ |
| 14 | `/evaluacion-nivel/` | `evaluacion-nivel/page.tsx` | ✅ | 🔒 | ❌ | ❌ | ➖ | ❌ | ➖ | ❌ |
| 15 | `/perfil/public/` | `perfil/public/page.tsx` | ✅ `generateMetadata` | 🔒 siempre | ❌ | ❌ | ➖ PerfilPublico | ❌ | ➖ | ✅ ProfileHeroCard (ok) / error h1 |
| 16 | `/ruta-aprendizaje/` | `(dashboard)/ruta-aprendizaje/page.tsx` | ➖ | 🔒 dashboard | ❌ | ✅ DashboardLayoutChrome | ✅ | ✅ dashboard | ➖ ErrorBoundary | ❌ |
| 17 | `/ruta-aprendizaje/fases/` | `.../fases/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ❌ |
| 18 | `/ruta-aprendizaje/leccion/[id]/[step]/` | `.../leccion/.../page.tsx` | ➖ | 🔒 | ❌ | ❌ fullscreen | ➖ LessonContentView | ✅ lección | ➖ | ➖ markdown puede emitir h1 |
| 19 | `/ruta-al-500/` | `(dashboard)/ruta-al-500/page.tsx` | ✅ | 🔒 | ⚠️ **conflicto** `/ruta-al-500/` | ✅ | ✅ | ➖ | ➖ | ✅ RouteTo500Page |
| 20 | `/fases/` | `(dashboard)/fases/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ❌ |
| 21 | `/clasificatoria/` | `(dashboard)/clasificatoria/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ❌ (solo h2) |
| 22 | `/logros/` | `(dashboard)/logros/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ❌ |
| 23 | `/tienda/` | `(dashboard)/tienda/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ✅ StorePageHeader |
| 24 | `/perfil/` | `(dashboard)/perfil/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ✅ ProfileHeroCard |
| 25 | `/configuracion/` | `(dashboard)/configuracion/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ✅ UserSettingsPage |
| 26 | `/practica/[area]/` | `(dashboard)/practica/[area]/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ✅ práctica | ➖ | ❌ (header sin h1) |
| 27 | `/examen-completo/` | `(dashboard)/examen-completo/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ✅ examen | ➖ | ❌ |
| 28 | `/dev/icons/` | `(dashboard)/dev/icons/page.tsx` | ➖ | 🔒 | ❌ | ✅ | ✅ | ➖ | ➖ | ✅ dev gallery |

**Rutas especiales (no en tabla de páginas):**

| Ruta | Archivo | Metadata | Skip | main |
|------|---------|----------|------|------|
| Global | `src/app/layout.tsx` | ✅ root | ❌ | ❌ (hijos) |
| 404 | `not-found.tsx` | ✅ noindex | ❌ | ✅ sin skip |
| Error | `error.tsx` | ❌ | ❌ | ❌ `role="alert"` |
| Error crítico | `global-error.tsx` | ❌ | ❌ | ❌ |

### Metadata exports (20 archivos con `export const metadata` / `generateMetadata`)

- Root: `layout.tsx`, `page.tsx`, `not-found.tsx`
- Content: lectura, importancia, consejos, informacion
- Legales: privacidad, terminos
- Auth: layout, login, signup, forgot-password, reset-password, onboarding; callback layout
- Dashboard: layout (`noindex`), ruta-al-500
- Otros: evaluacion-nivel, perfil/public (`generateMetadata`)

### `loading.tsx` (4)

- `src/app/(dashboard)/loading.tsx`
- `src/app/(dashboard)/practica/[area]/loading.tsx`
- `src/app/(dashboard)/examen-completo/loading.tsx`
- `src/app/(dashboard)/ruta-aprendizaje/leccion/[lessonId]/loading.tsx`

### `error.tsx` (1)

- Solo `src/app/error.tsx`; dashboard usa `ErrorBoundary` en layout.

---

## 2. Mapa de overlays `fixed inset-0` × `useDialogA11y`

| Componente | Archivo | Tipo | `useDialogA11y` | `role="dialog"` |
|------------|---------|------|-----------------|-----------------|
| ShopItemModal | `features/store/components/ShopItemModal.tsx` | Modal | ✅ | ✅ |
| ExamConfigModal | `features/exam/components/ExamConfigModal.tsx` | Modal | ✅ | ✅ |
| AchievementUnlockModal | `features/achievements/components/AchievementUnlockModal.tsx` | Modal | ✅ | ✅ |
| LessonQuizModal | `features/learning/roadmap/lessonQuiz/LessonQuizModal.tsx` | Modal | ✅ | ✅ |
| LessonPreview | `features/learning/roadmap/LessonPreview.tsx` | Modal | ✅ | ✅ |
| PdfViewerModal | `features/tips/components/PdfViewerModal.tsx` | Modal | ✅ | ✅ |
| ChatPanel | `features/learning/shell/ChatAssistant/ChatPanel.tsx` | Panel | ✅ | ✅ |
| ReportUserDialog | `features/user/components/ReportUserDialog.tsx` | Modal | ✅ | ✅ |
| SettingsDeleteModal | `features/user/components/settings/SettingsDeleteModal.tsx` | Modal | ✅ | ✅ |
| AreasModal | `features/learning/shell/SecondaryHeader/AreasModal.tsx` | Dropdown | ✅ | ✅ |
| StreakModal | `features/learning/shell/SecondaryHeader/StreakModal.tsx` | Dropdown | ✅ | ✅ |
| SectionsModal | `features/learning/shell/SecondaryHeader/SectionsModal.tsx` | Dropdown | ✅ | ✅ |
| CoinsModal | `features/learning/shell/SecondaryHeader/CoinsModal.tsx` | Dropdown | ✅ | ✅ |
| MobileNav menú | `components/DashboardHeader/MobileNav.tsx` | Menú | ✅ | ✅ |
| **PracticeMobileAnswerSheet** | `features/exam/components/practice/PracticeMobileAnswerSheet.tsx` | Overlay móvil | ❌ | ❌ |
| **PracticeExamHeader dropdown** | `features/exam/components/practice/PracticeExamHeader.tsx` | Dropdown inline | ❌ | ❌ |
| ModalOverlay | `shared/components/ModalOverlay.tsx` | Backdrop | N/A | N/A |
| LessonContentView | `features/learning/roadmap/LessonContentView.tsx` | Fullscreen ruta | N/A | N/A |

**Decorativos** (`pointer-events-none`, sin interacción modal): HomePage, auth layout, StorePage, LoginPage, etc.

---

## 3. Inventario de formularios

| Formulario | Archivo | `<label htmlFor>` | `aria-invalid` | `role="alert"` errores |
|------------|---------|-------------------|----------------|------------------------|
| Login | `features/auth/pages/login/LoginForm.tsx` | ✅ | ✅ | ✅ |
| Signup | `features/auth/pages/signup/SignupForm.tsx` | ✅ | ✅ | ✅ + `aria-live` reglas |
| Forgot password | `features/auth/pages/ForgotPasswordPage.tsx` | ✅ | ➖ | ❌ |
| Reset password | `features/auth/pages/reset-password/ResetPasswordForm.tsx` | ✅ | ➖ | ❌ |
| Settings perfil | `features/user/components/settings/SettingsProfilePanel.tsx` | ✅ | ❌ | ➖ toast |
| Settings soporte | `features/user/components/settings/SettingsSupportPanel.tsx` | ✅ | ➖ | ➖ |
| Report user | `features/user/components/report/ReportUserDialogBody.tsx` | ✅ | ➖ | ✅ |
| Donation card | `features/home/components/DonationSection/DonationCardForm.tsx` | ✅ | ➖ | ➖ |
| Exam config | `features/exam/components/ExamConfigModal.tsx` | ✅ | ➖ | N/A |
| Chat input | `features/learning/shell/ChatAssistant/ChatInputArea.tsx` | ❌ placeholder only | ➖ | N/A |

---

## 4. Razones XP/monedas — servidor vs API

### Razones legítimas generadas en servidor (código)

| Prefijo / patrón | Origen | Ejemplo |
|------------------|--------|---------|
| `lesson_quiz_{lessonId}` | `lessonQuizGradingServer.ts` | `lesson_quiz_matematicas-1` |
| `practice_{timestamp}` | `activityXp.ts` | `practice_1718123456789` |
| `exam_full_{timestamp}` | `activityXp.ts` | `exam_full_1718123456789` |
| `achievement_{id}` | `achievementProgressRewards.ts` | `achievement_practice_1` |
| `demo_migration` | excluido de liga semanal | constante |
| `league_*` | excluido de liga semanal | — |

### Validación en `/api/gamification/award`

- `validateReason()`: solo longitud 1–64 caracteres.
- **No hay allowlist** de prefijos ni coincidencia con acciones del servidor.
- Límite: `MAX_AWARD = 500` por request; rate limit 60 req/min por `userId:IP`.
- Idempotencia por `reason` duplicado en historial (`hasHistoryReason`).

**Brecha:** un cliente autenticado puede enviar `reason` únicos arbitrarios (`farm_1`, `farm_2`, …) y acumular economía.

### Cliente que invoca la API

- `gamificationPersistence.ts` → `awardXpViaApi` / `awardCoinsViaApi`
- Consumido por: práctica, examen, logros, actividad de liga, tienda (`spend_coins`)

---

## 5. API routes (8)

| Ruta | Auth | Rate limit |
|------|------|------------|
| `/api/gamification/award` | JWT | 60/min |
| `/api/exam/questions` | JWT o demo (+ middleware) | Sí |
| `/api/exam/grade` | JWT o demo | Sí |
| `/api/learning/quiz/grade` | JWT | Sí |
| `/api/chat` | Opcional | Sí |
| `/api/demo/session` | Público | Sí |
| `/api/profile/public/[userId]` | Público | Sí |
| `/api/r2/infographic/[id]` | Público | Sí |

---

## 6. Resumen de huecos detectados en inventario

| ID | Ámbito | Severidad | Hallazgo |
|----|--------|-----------|----------|
| INV-01 | SEO | Alta | Home: 2× `<h1>` en DOM |
| INV-02 | SEO | Alta | `/lectura/` sin `<h1>` |
| INV-03 | SEO | Media | `/ruta-al-500/` canonical + noindex contradictorio |
| INV-04 | a11y | Alta | `PracticeMobileAnswerSheet` sin diálogo accesible |
| INV-05 | a11y | Media | `error.tsx` / `not-found` sin skip link |
| INV-06 | Seguridad | Crítica | API award sin allowlist de `reason` |
| INV-07 | UX/a11y | Alta | Dashboard: 10+ rutas sin `<h1>` (impacto a11y, no SEO) |
| INV-08 | Infra | Media | `supabase/` vacío en repo — migraciones no versionadas |

---

## 7. Próximo paso

Fase 1: herramientas automatizadas (`pnpm audit`, Lighthouse, inspección bundle) → `01-herramientas.md`.
