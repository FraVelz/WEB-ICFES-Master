# Fase 2d — UI/UX

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Método:** Revisión estática + Lighthouse performance (Fase 1)

---

## Tabla de hallazgos

| ID | Severidad | Archivo | Descripción | Estado |
|----|-----------|---------|-------------|--------|
| UX-01 | **Alta** | `DashboardHeader/constants.ts` | `HIDE_MOBILE_MAIN_NAV_PATHS = []` — barra 80px en práctica/examen | Abierto |
| UX-02 | **Alta** | `PracticeActiveView.tsx`, `FullExamActiveView.tsx` | Sin `pb-20`/safe-area; controles tapados en móvil | Abierto |
| UX-03 | **Media** | `ToastProvider.tsx` | Toast solo tienda + configuración | Abierto |
| UX-04 | **Media** | `FullExamPage.tsx`, `ClasificatoriaPage.tsx` | Errores en `div` rojo sin CTA reintentar | Abierto |
| UX-05 | **Media** | `StorePage.tsx` | Error sin botón reintento | Abierto |
| UX-06 | **Media** | Perfil vs logros/tienda | Spinner genérico vs `SkeletonGrid` | Abierto |
| UX-07 | **Media** | `ProtectedPage.tsx` | Doble `LoadingState` al redirigir | Abierto |
| UX-08 | **Media** | `OnboardingPage.tsx` | Transición signup 1s sin feedback; `sessionStorage` frágil | Abierto |
| UX-09 | **Media** | `BreadcrumbNav.tsx` | Solo práctica pre-inicio y lección | Abierto |
| UX-10 | **Media** | `PracticeExamHeader.tsx` | Menú sin cerrar con Escape/overlay | Abierto |
| UX-11 | **Media** | Examen/onboarding | Colores hardcodeados fuera de tokens | Abierto |
| UX-12 | **Media** | `LessonContentView.tsx` | GSAP bloquea botones ~140–180ms | Aceptable |
| UX-13 | **Baja** | `MobileNav.tsx` | Tabs solo icono sin etiqueta visible | Abierto |
| UX-14 | **Baja** | `GoogleSignInButton.tsx` | Separador `bg-black` rompe tema claro | Abierto |
| UX-15 | **Baja** | `AuthCallbackClient.tsx` | Sin botón reintento manual OAuth | Abierto |
| UX-16 | **Baja** | Full exam vs práctica | Demo bloqueado en completo sin mensaje claro | Abierto |
| UX-17 | **Info** | Lighthouse perf | Home 89, content ~92–93 móvil | Medido |

---

## Estados globales

| Tipo | Cobertura | Calidad |
|------|-----------|---------|
| `loading.tsx` | 4 rutas dashboard | ✅ labels contextuales |
| `error.tsx` | Solo raíz | ⚠️ dashboard usa ErrorBoundary |
| `not-found.tsx` | Global | ✅ `noindex` |
| `EmptyState` | learning, práctica, tienda error, logros | ✅ con CTA donde aplica |
| `SkeletonGrid` | logros, tienda | ✅ |
| `Toast` | tienda, settings | ❌ cobertura limitada |

---

## Navegación móvil (crítico)

```
Barra inferior: siempre visible (HIDE_MOBILE_MAIN_NAV_PATHS vacío)
Examen/práctica: compite con "Finalizar" y última pregunta
Roadmap: usa pb-20 ✅
Quiz modal: pb-20 ✅
Examen activo: sin pb-20 ❌
```

**Corrección propuesta:** añadir `/practica/`, `/examen-completo/` a `HIDE_MOBILE_MAIN_NAV_PATHS` + `pb-20` en vistas activas.

---

## Feedback de acciones

| Acción | Feedback actual |
|--------|-----------------|
| Compra tienda | Toast ✅ |
| Guardar settings | Toast ✅ |
| Guardar perfil | Toast ✅ |
| Completar lección | Sin toast global |
| Error examen completo | Div rojo ❌ |
| Error clasificatoria | Div rojo ❌ |
| Error práctica | EmptyState + reintentar ✅ |

---

## Flujos críticos (revisión estática)

### Auth

- Login/signup: loading en botón, errores mapeados ✅
- Onboarding → signup: delay sin spinner ⚠️
- OAuth callback: timeout 10s ⚠️
- `LevelAssessmentGate`: redirect silencioso ⚠️

### Examen

- Timer `aria-live` ✅
- Hoja respuestas móvil funcional ⚠️ a11y
- Resultados con gradientes hardcodeados ⚠️ visual
- Práctica: breadcrumbs pre-inicio ✅

### Learning

- Ruta: empty/error/loading diferenciados ✅
- Lección fullscreen sin chrome ✅
- Chat: panel accesible, cuota visible ✅

### Economía

- Tienda: skeletons, modales, toast ✅
- Logros: skeletons, unlock modal ✅
- Clasificatoria: skeleton filas, error sin CTA ⚠️

---

## Consistencia visual

### Base sólida

- `globals.css`: tokens semánticos, overrides light mode
- `h-dvh`, `overscroll-contain` en dashboard
- `FOCUS_RING` en navegación

### Desviaciones

- Examen: `from-green-500`, `text-gray-500`, `text-red-200`
- Onboarding/assessment: `from-blue-600`, `text-white` fijo
- Errores: mezcla `red-400`, `red-200`, `red-950/30` sin componente unificado

---

## Confirmaciones destructivas

- `SettingsDeleteModal`: `useDialogA11y` ✅
- Gastar monedas / abandonar examen: revisar confirmación explícita

---

## Prioridad corrección UX

1. Nav móvil oculta en examen + padding inferior
2. Unificar errores con `EmptyState` + reintentar
3. Extender toast a lecciones y resultados
4. Skeletons en perfil/dashboard
5. Breadcrumbs, labels tabs móvil, tema claro auth
