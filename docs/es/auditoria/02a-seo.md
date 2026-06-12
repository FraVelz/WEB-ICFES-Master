# Fase 2a — SEO

**Proyecto:** WEB-ICFES-Master  
**Fecha:** 2026-06-12  
**Método:** Revisión estática de código + Lighthouse móvil (Fase 1)

---

## Tabla de hallazgos

| ID | Severidad | Archivo / URL | Descripción | Estado |
|----|-----------|---------------|-------------|--------|
| SEO-01 | **Alta** | `/` — `HomePage.tsx`, `HomePageMobile.tsx`, `HeroSection.tsx` | Dos `<h1>` siempre en DOM (móvil sr-only + desktop visible) | Abierto |
| SEO-02 | **Alta** | `/lectura/` — `LecturaPage.tsx` | Sin `<h1>`; solo párrafos en header | Abierto |
| SEO-03 | **Media** | `/ruta-al-500/` — `page.tsx` + layout dashboard | `canonical` indexable pero `noindex` + `robots disallow` | Abierto |
| SEO-04 | **Media** | `sitemap.ts` | `lastModified: new Date()` en todas las URLs | Abierto |
| SEO-05 | **Media** | `HomeStructuredData.tsx` | `Organization.logo` usa screenshot, no logo de marca | Abierto |
| SEO-06 | **Media** | `.env.example` / prod | `NEXT_PUBLIC_SITE_URL` debe ser `https://icfesmaster.com` en producción | Verificar deploy |
| SEO-07 | **Media** | `robots.ts` | Falta `/dev/` en `disallow` (resto dashboard sí) | Abierto |
| SEO-08 | **Baja** | Content/legales | `openGraph.type: 'article'` sin `publishedTime`/`authors` | Abierto |
| SEO-09 | **Baja** | Global | Sin `twitter:site` / `twitter:creator` | Abierto |
| SEO-10 | **Baja** | Global | Sin verificación Search Console en metadata | Abierto |
| SEO-11 | **Baja** | Global | Una sola OG image (`ogImage.ts`) para todo el sitio | Abierto |
| SEO-12 | **Baja** | `HomeStructuredData.tsx` | Sin `sameAs`, sin `potentialSearchAction` | Abierto |
| SEO-13 | **Baja** | Dashboard (noindex) | 10+ rutas sin `<h1>` (tienda/config excepción) | Abierto |
| SEO-14 | **Info** | Lighthouse | Home SEO 92, content ~91, login 54 (noindex) | Medido |

---

## Infraestructura técnica

### Correcto

- `metadataBase` + `getSiteUrl()` en `layout.tsx`
- `trailingSlash: true` alineado con canonicals y sitemap
- `sitemap.ts`: 7 URLs públicas indexables
- `robots.ts`: bloquea auth, dashboard, API, perfiles
- Redirect 301 `/aprendizaje` → `/ruta-aprendizaje`
- `manifest.ts`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.png`
- `<html lang="es">`, OG `locale: es_CO`

### Pendiente

- [ ] Usar `CONTENT_LAST_UPDATED` (`ogImage.ts`) en sitemap
- [ ] Añadir `/dev/` a robots disallow
- [ ] Iconos PWA 192×512 en manifest
- [ ] `metadata.verification` para Search Console

---

## Metadata por ruta

### Públicas indexables (OK base)

| Ruta | Title | Canonical | JSON-LD |
|------|-------|-----------|---------|
| `/` | template root | ✅ | Organization, WebSite, FAQPage |
| `/lectura/` | ✅ | ✅ | WebPage + Breadcrumb |
| `/importancia/` | ✅ | ✅ | WebPage + Breadcrumb |
| `/consejos/` | ✅ | ✅ | WebPage + Breadcrumb |
| `/informacion/` | ✅ | ✅ | WebPage + Breadcrumb |
| `/privacidad/` | ✅ | ✅ | Legal |
| `/terminos/` | ✅ | ✅ | Legal |

### Privadas (OK)

- Layout `(dashboard)`: `noindex, nofollow`
- Layout `(auth)`: `noindex, nofollow`
- `evaluacion-nivel`, `not-found`, `auth/callback`: `noindex`
- `perfil/public`: `generateMetadata` dinámico + `noindex` siempre

---

## Headings

```
Home:     h1 (sr-only) + h1 (visible)  → CORREGIR a 1
Lectura:  (sin h1)                     → AÑADIR
Content:  h1 → h2 → h3                 → OK
Legales:  h1 → h2 → h3                 → OK
404:      h1="404", h2 mensaje         → Aceptable
```

---

## Imágenes y enlaces

- Sin `alt=""` vacíos en `src/`
- Alts genéricos (`Profile`, `Mascota`) — impacto menor SEO (rutas noindex)
- Enlazado interno content: lectura → secciones vía `LecturaSectionCard` — OK

---

## Rendimiento SEO (Lighthouse móvil)

| Métrica | Home | Lectura |
|---------|------|---------|
| Performance | 89 | 93 |
| SEO | 92 | 91 |

LCP en home afectado por blobs animados y GSAP — optimización opcional.

---

## Prioridad de corrección SEO

1. Un solo `h1` en home
2. `h1` en `LecturaPage`
3. Quitar canonical de `/ruta-al-500/` o sacar de dashboard si debe indexarse
4. Fechas reales en sitemap + logo JSON-LD
5. Pulido: Twitter por página, OG por ruta, Search Console
