# Estructura de Datos: Lecciones y Exámenes

Este documento detalla la estructura de datos para las lecciones en Firestore, incluyendo la nueva funcionalidad de exámenes (quizzes).

## Colecciones

Las lecciones se almacenan en colecciones separadas por área:
- `learning_lectura_critica`
- `learning_matematicas`
- `learning_sociales`
- `learning_ciencias_naturales`
- `learning_ingles`

## Estructura del Documento de Lección

Cada documento en estas colecciones debe seguir esta estructura:

```json
{
  "id": "auto-generated-id",
  "title": "Título de la Lección",
  "description": "Breve descripción del contenido.",
  "order": 1, // Número para ordenar las lecciones
  "published": true, // true para mostrar en la app
  "content": "Contenido en formato Markdown...", 
  
  // Objeto del Examen (Nuevo)
  "quiz": {
    "question": "¿Cuál es la pregunta principal del tema?",
    "options": [
      {
        "id": "a",
        "text": "Opción A (Incorrecta)"
      },
      {
        "id": "b",
        "text": "Opción B (Correcta)"
      },
      {
        "id": "c",
        "text": "Opción C (Incorrecta)"
      },
      {
        "id": "d",
        "text": "Opción D (Incorrecta)"
      }
    ],
    "correctAnswer": "b", // ID de la opción correcta
    "rewards": {
      "xp": 50,    // Puntos de experiencia a otorgar
      "coins": 20  // Monedas a otorgar
    }
  }
}
```

## Flujo de Recompensas

1.  **Validación:** El usuario selecciona una opción en el modal de examen.
2.  **Verificación:** Se compara la opción seleccionada con `correctAnswer`.
3.  **Recompensa:**
    -   Si es correcta y es la **primera vez** que completa esta lección:
        -   Se suman los XP al perfil del usuario (`gamification/current`).
        -   Se suman las Coins al perfil del usuario.
        -   Se marca la lección como completada en `users/{userId}/progress/current` (campo `completedLessons`).
    -   Si ya la completó anteriormente, se muestra el mensaje de éxito pero no se otorgan recompensas adicionales.
4.  **Feedback:** El usuario recibe retroalimentación inmediata (Correcto/Incorrecto).

## Notas para Administradores

-   Asegúrese de que `correctAnswer` coincida exactamente con el `id` de una de las opciones.
-   Los valores de `xp` y `coins` son opcionales; si no se definen, se usarán valores por defecto (10 XP, 5 Coins).
-   El campo `content` soporta Markdown completo (imágenes, listas, código, etc.).
