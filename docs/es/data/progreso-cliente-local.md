# Progreso solo en cliente (localStorage)

Este documento describe dónde vive el progreso que **no** se sincroniza automáticamente con Supabase u otro backend.

## Módulo canónico

- Implementación: [`src/shared/utils/progressStorage.ts`](../../../src/shared/utils/progressStorage.ts)
- Entorno: **solo navegador** (`localStorage`). No usar en Server Components sin comprobar `typeof window`.

## Claves almacenadas

| Clave              | Contenido breve                                      |
| ------------------ | ---------------------------------------------------- |
| `icfes_exams`      | Intentos de examen completo (`saveFullExam`)         |
| `icfes_practice`   | Intentos de práctica por área (`savePractice`)       |
| `icfes_progress`   | Agregado derivado (porcentajes, áreas, racha, etc.)  |
| `icfes_completed_lessons` | IDs de lecciones marcadas como completadas (`LearningService` / progreso local) |

## Relación con otros datos

- **Gamificación** (logros, niveles con persistencia híbrida) puede usar [`src/services/persistence/gamificationPersistence.ts`](../../../src/services/persistence/gamificationPersistence.ts) y Supabase según configuración.
- Las rutas de aprendizaje con contenido en **Supabase** no sustituyen estas claves: el progreso de lecciones completadas en local sigue siendo independiente hasta que unifiquen persistencia.

Para cambiar comportamiento, tratar este archivo y las APIs que lo llaman como la fuente de verdad del almacenamiento local.
