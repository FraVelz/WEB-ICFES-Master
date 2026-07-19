# Piloto ≥ 20 estudiantes — checklist humano (B2-1)

**Ticket:** B2-1 (Plan 12 Oleada 2)  
**Regla:** usuarios **reales**. Prohibido inventar cuentas, seed de “estudiantes piloto” o sesiones fake para cerrar el ticket.

Este archivo es el **instrumento** del piloto. El agente de código **no** marca casillas de usuarios ni rellena la tabla con datos inventados.

---

## Preflight técnico (debe estar verde antes de reclutar)

- [ ] Práctica por área: autosave + restore tras refresh
- [ ] Cobertura banco visible (`GET /api/exam/coverage`) — áreas con preguntas reales
- [ ] Submit práctica no falla en happy path; errores van a Sentry (`feature:exam-runner`)
- [ ] `GET /api/health` → `"status":"ok"`
- [ ] Alertas documentadas en [`alerts.md`](./alerts.md)
- [ ] Runbook listo: [`runbook-simulacro.md`](./runbook-simulacro.md)
- [ ] Flags: `BILLING_ENABLED=false`, `OPENAI_ENABLED` solo si hay key (D2–D3)
- [ ] Canal de soporte definido (in-app / email)

---

## Reclutamiento (humano)

Objetivo: **≥ 20 estudiantes distintos** **o** evidencia equivalente de sesiones reales + retención.

Cada fila = una persona real que:

1. Abre la app (cuenta o demo documentada).
2. Completa **≥ 1 práctica por área** (o abandona con motivo anotado).
3. Idealmente vuelve en otra sesión (retención 7d opcional).

| #   | Alias / código | Canal | Fecha 1ª sesión | Prácticas iniciadas | Completadas | % complete | Notas |
| --- | -------------- | ----- | --------------- | ------------------- | ----------- | ---------- | ----- |
| 1   |                |       |                 |                     |             |            |       |
| 2   |                |       |                 |                     |             |            |       |
| …   |                |       |                 |                     |             |            |       |
| 20  |                |       |                 |                     |             |            |       |

_Filas 21+ opcionales si el piloto crece._

---

## Métrica alternativa (si N&lt;20 personas)

Si no se alcanza N=20 personas, documentar **log de sesiones reales**:

| Evidencia                          | Formato                                                     | Dónde                                |
| ---------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Sesiones `submitted` / `abandoned` | CSV anonimizado (sin email)                                 | fuera del git público o path privado |
| % práctica completada              | `submitted / (submitted + abandoned)` en ventana del piloto | nota en este archivo al cerrar       |
| Retención                          | % con ≥2 sesiones en 7 días                                 | opcional                             |

**No** subir PII (nombres reales, emails, documentos) al repo público.

---

## Evidencia mínima para cerrar B2-1

| Evidencia                                   | Dónde                               |
| ------------------------------------------- | ----------------------------------- |
| Tabla ≥20 o CSV sesiones + % complete       | este archivo (local) / nota privada |
| Captura cobertura banco o link coverage API | opcional                            |
| Incidente durante piloto (si hubo)          | `docs/incidents/` (5 líneas)        |

**No cuenta como cierre:** cuentas de prueba del founder, scripts de carga, o “20 filas inventadas”.

---

## Estado

| Campo                                   | Valor                                     |
| --------------------------------------- | ----------------------------------------- |
| Checklist docs                          | listo (2026-07-15)                        |
| Piloto humano ≥ 20 / evidencia sesiones | **pendiente** — ejecutar fuera del agente |
| Fecha cierre real                       | _TBD_                                     |
