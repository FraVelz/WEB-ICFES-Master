# Data Structure Guide: Learning Module

This guide documents how to structure and manage data in **Supabase** for the learning module. It is designed so any developer or content administrator can add, edit, or delete lessons correctly.

> A future admin panel is planned to update database data and add content more easily via web.

---

## 1. Introduction

The learning system works by reading data from the **`learning_content`** table in Supabase. The frontend queries this table to dynamically generate the "Learning Path" for each subject.

**Data flow:**

1. Create a record in the `learning_content` table.
2. The app detects the area and loads the corresponding lessons.
3. Lessons are ordered by `order_index`.
4. Only lessons with `published: true` are displayed.

---

## 2. Supabase Structure

### `learning_content` Table

| Column      | Type  | Required | Description                                                                        |
| ----------- | ----- | -------- | ---------------------------------------------------------------------------------- |
| id          | uuid  | Yes      | Unique ID (auto-generated)                                                         |
| area        | text  | Yes      | Area: `matematicas`, `lectura_critica`, `sociales`, `ciencias_naturales`, `ingles` |
| order_index | int   | Yes      | Position in list (1, 2, 3...)                                                      |
| published   | bool  | Yes      | `true` to show, `false` to hide                                                     |
| content     | jsonb | Yes      | Content (title, summary, questions, quiz)                                           |

### Area Mapping

| Area in App (ID)   | Value in DB          |
| ------------------ | -------------------- |
| `lectura-critica`  | `lectura_critica`    |
| `matematicas`      | `matematicas`        |
| `sociales`         | `sociales`           |
| `ciencias-naturales` | `ciencias_naturales` |
| `ingles`           | `ingles`             |

---

## 3. `content` Object Structure (JSONB)

```json
{
  "title": "Introduction to Critical Reading",
  "summary": "Learn to identify the author's intent.",
  "type": "lesson",
  "questions": [],
  "quiz": {
    "title": "Concept quiz",
    "questions": [...],
    "rewards": { "xp": 50, "coins": 25 }
  }
}
```

### Content Fields

| Field     | Type   | Required | Description                                                                                         |
| --------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| title     | string | Yes      | Visible lesson title                                                                                |
| summary   | string | No       | Brief description                                                                                  |
| type      | string | No       | `lesson` by default                                                                                |
| questions | array  | No       | Content questions                                                                                  |
| quiz      | object | No       | Associated exam (see [services-api.md](../backend/services-api.md#learning-module-and-quizzes))     |

---

## 4. Lesson Management (CRUD)

- **Add:** INSERT into `learning_content` with `area`, `order_index`, `published`, `content`.
- **Edit:** UPDATE the record. Changes are reflected on reload.
- **Delete:** DELETE the record. Reorder `order_index` if needed.

---

## 5. Order and Publishing

### `order_index` Field

- Controls lesson sequence.
- Ascending order: 1, 2, 3, 4...

### `published` Field

- `true`: Lesson is visible.
- `false`: Lesson exists but the app ignores it (draft).

---

## 6. Common Errors

1. **Lesson doesn't appear:** Is `published: true`? Is `area` correct?
2. **Lessons out of order:** Ensure `order_index` is type `int`, not text.

---

## 7. Example: Add a Lesson

In Supabase Table Editor:

1. Table `learning_content` → Insert row
2. `area`: `matematicas`
3. `order_index`: 5
4. `published`: true
5. `content` (JSON):

```json
{
  "title": "Algebra: Linear Equations",
  "summary": "Introduction to solving for X.",
  "questions": [],
  "quiz": null
}
```
