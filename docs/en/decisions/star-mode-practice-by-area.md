# ADR: Star mode = practice by area

**Status:** Accepted  
**Date:** 2026-07-15  
**Decision:** D1

## Context

ICFES Master offers per-area practice and a full mock exam (~200Q / 3h). Making both modes excellent at once dilutes the flagship. The senior rubric asks for one **star mode** with autosave, visible bank coverage, domain tests, and a usable runner.

## Decision

- The **star mode** is **practice by area** (one subject, session `not_started → in_progress → submitted | abandoned`).
- Autosave + restore on refresh applies to practice by area (`practiceSessionStorage`).
- The **global mock exam** stays **beta**: no full resume; not the primary pitch.
- Bank coverage is shown per area (real counts / empty).
- Billing and OpenAI remain gated (see [billing-no-2026.md](./billing-no-2026.md)).

## Consequences

- Prioritize practice-runner quality (keyboard, timer a11y, Sentry load/submit, next-question prefetch).
- Do not market a “reliable 200Q mock with resume” until it leaves beta.
- Docs and hired demos lead with practice by area.

See also: [architecture.md](../frontend/architecture.md), [configuration.md](../setup/configuration.md).
