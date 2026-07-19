# Runbook — incidente simulacro / práctica (B2-3)

1 página. Prod health: `GET /api/health`. Sentry tags: `feature:exam-runner`, `phase:load|submit`.

---

## 1. Síntoma: no puede enviar (submit)

**Checks**

| #   | Acción                                                                             |
| --- | ---------------------------------------------------------------------------------- |
| 1   | Sentry → Issues filtrar `feature:exam-runner` + `phase:submit` (últimos 15–60 min) |
| 2   | Vercel → Runtime Logs / Functions en ventana del incidente                         |
| 3   | `curl -sS https://<prod>/api/health` → `status: ok`                                |
| 4   | Cobertura banco: `GET /api/exam/coverage` (¿área vacía vs bug de grade?)           |

**Mitigar**

1. Si spike Sentry submit: rollback del último deploy del runner (`usePracticeExamGrading` / `api/exam/grade`).
2. Si health down: revisar Vercel outage / redeploy previous Production.
3. Si banco vacío en un área: no inventar preguntas; comunicar empty state y priorizar seed (ver defer editorial B2-4).
4. Piloto activo: banner in-app o mensaje por canal de soporte.

**Comunicar:** alias del piloto + “práctica temporalmente degradada; progreso local puede restaurarse tras refresh si hay autosave”.

---

## 2. Síntoma: sesión perdida tras refresh

**Checks**

| #   | Acción                                                                                   |
| --- | ---------------------------------------------------------------------------------------- |
| 1   | Confirmar práctica por área (D1) — no simulacro global 200Q (sigue beta sin resume full) |
| 2   | `localStorage` key `icfes_practice_session_v1:*` presente en DevTools                    |
| 3   | Regresión reciente en `practiceSessionStorage` / `usePracticeExam`                       |

**Mitigar:** hotfix restore; si corrupto, limpiar key y pedir reinicio de práctica. Documentar en `docs/incidents/`.

---

## 3. Síntoma: carga de preguntas falla (load)

**Checks:** Sentry `phase:load`; Supabase status; RLS/`published` en vista pública de preguntas.

**Mitigar:** verificar `NEXT_PUBLIC_SUPABASE_*`; si tabla caída, modo mantenimiento + mensaje honest (“banco temporalmente no disponible”).

---

## 4. Postmortem (5 líneas)

Crear `docs/incidents/YYYY-MM-DD-corto.md`:

1. Qué vio el usuario
2. Detección (Sentry / health / reporte)
3. Mitigación
4. Causa raíz (1 frase)
5. Follow-up (ticket)

---

## Enlaces

- Alertas: [`alerts.md`](./alerts.md)
- Piloto: [`piloto-checklist.md`](./piloto-checklist.md)
- ADR práctica: `docs/es/decisions/star-mode-practice-by-area.md`
