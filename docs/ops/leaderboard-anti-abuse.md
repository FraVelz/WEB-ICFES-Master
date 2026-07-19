# Leaderboard / XP anti-abuse básico (B3-2)

Ligas UI pueden estar pausadas (`LEAGUES_TEMPORARILY_DISABLED`), pero el XP semanal (`add_weekly_xp`) sigue alimentándose desde práctica / simulacro cuando se reactivan.

## Controles implementados

| Control                         | Dónde                                                       | Efecto                                                       |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| Timer firmado (HMAC)            | `POST /api/exam/timer` + `examTimerToken`                   | `startedAt` / `endsAt` anclados en servidor                  |
| Token obligatorio para XP       | `POST /api/exam/grade`                                      | Sin `timerToken` válido → califica, **no** otorga XP de liga |
| Tiempo mínimo plausible         | `MIN_MS_PER_QUESTION_FOR_XP` (2s × preguntas)               | Submit instantáneo no suma weekly XP                         |
| Idempotencia por intento        | `awardActivityXpServer` reason `practice_*` / `exam_full_*` | Un `attemptId` no dobla XP                                   |
| Rate limit grade                | 30/min user, 10/min demo                                    | Reduce spam de submits                                       |
| Una fila por usuario en ranking | RPC `get_my_leaderboard` / weekly XP por `user_id`          | No hay multi-entry por cuenta                                |

## Fuera de alcance (residual)

- Detección multi-cuenta / device fingerprint.
- Capas de fraude de pago o captcha.
- Admin ban de leaderboard.
