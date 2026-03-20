# Guía de Estructura de Datos: Módulo de Aprendizaje

Esta guía documenta cómo estructurar y gestionar los datos en **Supabase** para el módulo de aprendizaje. Está diseñada para que cualquier desarrollador o administrador de contenido pueda agregar, editar o eliminar lecciones correctamente.

> En un futuro se piensa hacer un panel de administracion para actualizar datos de la base de datos, y agregar contenido en web mas facilmente.

---

## 1. Introducción

El sistema de aprendizaje funciona leyendo datos de la tabla **`learning_content`** en Supabase. El frontend consulta esta tabla para generar dinámicamente la "Ruta de Aprendizaje" (Learning Path) de cada materia.

**Flujo de datos:**

1. Creas un registro en la tabla `learning_content`.
2. La app detecta el área y carga las lecciones correspondientes.
3. Las lecciones se ordenan según `order_index`.
4. Solo se muestran las lecciones con `published: true`.

---

## 2. Estructura en Supabase

### Tabla `learning_content`

| Columna     | Tipo  | Obligatorio | Descripción                                                                        |
| ----------- | ----- | ----------- | ---------------------------------------------------------------------------------- |
| id          | uuid  | Sí          | ID único (auto-generado)                                                           |
| area        | text  | Sí          | Área: `matematicas`, `lectura_critica`, `sociales`, `ciencias_naturales`, `ingles` |
| order_index | int   | Sí          | Posición en la lista (1, 2, 3...)                                                  |
| published   | bool  | Sí          | `true` para mostrar, `false` para ocultar                                          |
| content     | jsonb | Sí          | Contenido (title, summary, questions, quiz)                                        |

### Mapeo de Áreas

| Área en la App (ID)  | Valor en BD          |
| -------------------- | -------------------- |
| `lectura-critica`    | `lectura_critica`    |
| `matematicas`        | `matematicas`        |
| `sociales`           | `sociales`           |
| `ciencias-naturales` | `ciencias_naturales` |
| `ingles`             | `ingles`             |

---

## 3. Estructura del objeto `content` (JSONB)

```json
{
  "title": "Introducción a la Lectura Crítica",
  "summary": "Aprende a identificar la intención del autor.",
  "type": "lesson",
  "questions": [],
  "quiz": {
    "title": "Prueba de conceptos",
    "questions": [...],
    "rewards": { "xp": 50, "coins": 25 }
  }
}
```

### Campos del content

| Campo     | Tipo   | Obligatorio | Descripción                                                                                         |
| --------- | ------ | ----------- | --------------------------------------------------------------------------------------------------- |
| title     | string | Sí          | Título visible de la lección                                                                        |
| summary   | string | No          | Breve descripción                                                                                   |
| type      | string | No          | `lesson` por defecto                                                                                |
| questions | array  | No          | Preguntas de contenido                                                                              |
| quiz      | object | No          | Examen asociado (ver [services-api.md](../backend/services-api.md#módulo-de-aprendizaje-y-quizzes)) |

---

## 4. Gestión de Lecciones (CRUD)

- **Agregar:** INSERT en `learning_content` con `area`, `order_index`, `published`, `content`.
- **Editar:** UPDATE del registro. Los cambios se reflejan al recargar.
- **Borrar:** DELETE del registro. Reordenar `order_index` si es necesario.

---

## 5. Orden y Publicación

### Campo `order_index`

- Controla la secuencia de las lecciones.
- Orden ascendente: 1, 2, 3, 4...

### Campo `published`

- `true`: La lección es visible.
- `false`: La lección existe pero la app la ignora (borrador).

---

## 6. Errores Comunes

1. **La lección no aparece:** ¿Está `published: true`? ¿El `area` es correcto?
2. **Lecciones desordenadas:** Asegúrate de que `order_index` sea tipo `int`, no texto.

---

## 7. Ejemplo: Agregar una Lección

En Supabase Table Editor:

1. Tabla `learning_content` → Insert row
2. `area`: `matematicas`
3. `order_index`: 5
4. `published`: true
5. `content` (JSON):

```json
{
  "title": "Álgebra: Ecuaciones Lineales",
  "summary": "Introducción a despejar X.",
  "questions": [],
  "quiz": null
}
```
