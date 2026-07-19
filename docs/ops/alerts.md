# Alertas — error rate submit / uptime (B2-2)

Prod health: `GET /api/health` → `{ "status": "ok" }`.  
Sentry runner: tags `feature:exam-runner` + `phase:load|submit` (ver `src/lib/monitoring/examSentry.ts`).

---

## 1. Uptime (healthcheck)

| Campo              | Valor                                                       |
| ------------------ | ----------------------------------------------------------- |
| URL                | `https://<prod>/api/health`                                 |
| Método             | GET                                                         |
| Expect             | HTTP 200 + JSON `status === "ok"`                           |
| Intervalo sugerido | 5 min                                                       |
| Fallo              | 2 checks consecutivos fallidos → alerta                     |
| Herramienta        | Better Stack / UptimeRobot / Vercel Monitoring (cualquiera) |

**Verificar local:**

```bash
pnpm dev
curl -sS http://localhost:3000/api/health | jq .
```

---

## 2. Error rate submit (Sentry)

Crear una **Issue Alert** (o Metric Alert) en el proyecto Sentry del runner:

| Campo              | Valor                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Filter             | `feature:exam-runner` **AND** `phase:submit`                     |
| Condición sugerida | ≥ **5** eventos en **10 min** (ajustar tras baseline del piloto) |
| Acción             | Email / Slack al owner del repo                                  |
| Env                | Production (y Preview solo si hay ruido controlado)              |

Opcional segunda alerta: `phase:load` con umbral más alto (fallos de carga de banco).

**Prerrequisito:** `NEXT_PUBLIC_SENTRY_DSN` en Vercel Production. Sin DSN = captura no-op (no hay alerta posible).

**Smoke:** forzar un submit fallido en staging con DSN; confirmar issue con tags `feature` + `phase`.

---

## 3. Qué no alertar

- Errores de red del cliente sin tag `exam-runner`
- 429 de rate limit en APIs públicas (coverage)
- Fallos locales sin DSN

---

## Enlaces

- Runbook incidente: [`runbook-simulacro.md`](./runbook-simulacro.md)
- Piloto: [`piloto-checklist.md`](./piloto-checklist.md)
- Config env: `docs/es/setup/configuration.md` (`NEXT_PUBLIC_SENTRY_DSN`)
