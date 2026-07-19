# B2-4 — Admin editorial mínimo (deferred)

**Decisión:** **no** implementar CRUD crear/editar/preview/publicar pregunta en `WEB-ICFES-Master` en Oleada 2.

## Por qué no bloquea el piloto

1. Cobertura del banco ya es visible (`GET /api/exam/coverage` + UI B1-2).
2. El piloto (B2-1) mide **uso real** de práctica, no el throughput editorial.
3. Existe panel hermano `WEB-ICFES-Admin` para contenido de aprendizaje; las preguntas de examen se gestionan hoy vía Supabase (tabla/`published`) sin CTA muerto en el cliente.
4. Meter un admin editorial completo en este repo sería **feature packing** (antipatrón Plan 12) y cruza D1–D3 sin desbloquear media hired.

## Interim (humano / ops)

| Necesidad                       | Path                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| Publicar / despublicar pregunta | Supabase Table Editor o SQL sobre la vista/tabla de preguntas (`published`) |
| Lecciones                       | `WEB-ICFES-Admin` → `/dashboard/contenido/`                                 |
| Contar cobertura                | `GET /api/exam/coverage`                                                    |

## Cuándo reabrir

Oleada 3 / guía `02` semanas 9–12: admin editorial con audit log publicar/archivar + versionado `question.version` (tickets B3-\*).

Ver también: [`gold-bank.md`](./gold-bank.md) (N gold/área) y [`leaderboard-anti-abuse.md`](./leaderboard-anti-abuse.md).

## Estado

| Campo       | Valor                                                       |
| ----------- | ----------------------------------------------------------- |
| Ticket B2-4 | **skipped** (condicionado “si bloquea piloto” → no bloquea) |
| Fecha       | 2026-07-15                                                  |
