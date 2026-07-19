# Banco gold — N documentado (B3-3)

**Ticket:** B3-3 (Plan 12 Oleada 3)  
**Regla:** no inventar cobertura; N es un umbral honesto, no marketing.

## N (piso documentado)

| Constante              | Valor | Significado                                                                                |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------ |
| `GOLD_BANK_N_PER_AREA` | **8** | Mínimo de preguntas **gold** (revisión humana) por área ICFES en el seed estático del repo |

Objetivo guía `02` (semanas 17–24 / checklist): **50** gold/área — meta de crecimiento, **no** el piso actual.

## Conteo seed estático (revisión humana en repo)

Fuente: `src/features/exam/data/` (`makeQuestion` / `ENGLISH_QUESTIONS`, `version: 1`).

| Área (ruta)         | Gold seed | ≥ N=8 |
| ------------------- | --------- | ----- |
| matematicas         | 8         | sí    |
| lectura-critica     | 8         | sí    |
| ciencias-naturales  | 8         | sí    |
| sociales-ciudadanas | 8         | sí    |
| ingles              | 10        | sí    |

El conteo **live** de `GET /api/exam/coverage` refleja `exam_questions_public` en Supabase (puede ser 0 si el área no está sembrada en DB). El seed estático es el fallback de práctica y el piso gold documentado.

## Qué cuenta como “gold”

1. Enunciado + 4 opciones + clave + explicación revisados por un humano.
2. `version >= 1` (B3-2).
3. Publicada o en seed estático del monorepo (no generada al vuelo sin revisión).

Admin editorial CRUD (B2-4) sigue **deferred** — ver [`B2-4-admin-editorial-deferred.md`](./B2-4-admin-editorial-deferred.md). Hasta entonces, nuevas gold se añaden por PR al seed o SQL supervisado.

## Verificación

```bash
pnpm test -- src/features/exam/data/goldBankFloor.test.ts
```

El test falla si alguna área del seed queda por debajo de `GOLD_BANK_N_PER_AREA`.

## Residuales

- Aplicar migración `supabase/migrations/20260716000000_exam_question_version.sql` en Supabase.
- Tras verificar la definición live de `exam_questions_public`, proyectar `version` y ampliar los SELECT en `ExamQuestions*Service`.
- Crecer seed hacia objetivo **50**/área (guía `02`); N=8 es el piso actual, no la meta.
