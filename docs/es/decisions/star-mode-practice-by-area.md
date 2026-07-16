# ADR: Modo estrella = práctica por área

**Estado:** Aceptada  
**Fecha:** 2026-07-15  
**Decisión:** D1

## Contexto

ICFES Master ofrece práctica por área y simulacro integral (~200Q / 3h). Hacer impecables ambos modos a la vez diluye el flagship. La rúbrica senior pide un **modo estrella** con autosave, cobertura visible, tests de dominio y runner usable.

## Decisión

- El **modo estrella** es **práctica por área** (una materia, sesión `not_started → in_progress → submitted | abandoned`).
- Autosave + restore en refresh aplica a práctica por área (`practiceSessionStorage`).
- El **simulacro global** permanece **beta**: sin resume full; no es el pitch principal.
- Cobertura del banco se muestra por área (conteo real / empty).
- Billing y OpenAI siguen gated (ver [billing-no-2026.md](./billing-no-2026.md)).

## Consecuencias

- Priorizar calidad del runner de práctica (teclado, timer a11y, Sentry load/submit, prefetch de pregunta).
- No vender “simulacro 200Q fiable con resume” hasta que deje de ser beta.
- Documentación y guion hired demuestran práctica por área primero.

Ver también: [architecture.md](../frontend/architecture.md), [configuration.md](../setup/configuration.md).
