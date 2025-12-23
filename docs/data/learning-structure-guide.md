# Guía de Estructura de Datos: Módulo de Aprendizaje

Esta guía documenta cómo estructurar y gestionar los datos en Firebase Firestore para el módulo de aprendizaje de la aplicación educativa. Está diseñada para que cualquier desarrollador o administrador de contenido pueda agregar, editar o eliminar lecciones correctamente.

---

## 1. Introducción

El sistema de aprendizaje funciona leyendo datos directamente de **Firestore**. El frontend (la app en React) consulta estas colecciones para generar dinámicamente la "Ruta de Aprendizaje" (Learning Path) de cada materia.

**Flujo de datos:**
1.  Creas un documento en Firestore.
2.  La app detecta la materia y carga la colección correspondiente.
3.  Las lecciones se ordenan según el campo `order`.
4.  Solo se muestran las lecciones marcadas como `published: true`.

---

## 2. Estructura de Firestore

Para mantener la base de datos organizada, separamos el contenido por **Materia** (Área).

### Convención de Nombres de Colecciones

El servicio de aprendizaje (`LearningService.js`) busca colecciones con el prefijo `learning_` seguido del ID del área con guiones bajos en lugar de guiones medios.

| Área en la App (ID) | Nombre de Colección en Firestore |
| :--- | :--- |
| `lectura-critica` | **`learning_lectura_critica`** |
| `matematicas` | **`learning_matematicas`** |
| `sociales` | **`learning_sociales`** |
| `ciencias-naturales` | **`learning_ciencias_naturales`** |
| `ingles` | **`learning_ingles`** |

> **Nota:** Es crucial respetar esta convención. Si la colección se llama `learning-matematicas` (con guion medio), la app no la encontrará.

---

## 3. Lecciones (Documentos)

Cada documento dentro de una colección `learning_...` representa una **Lección** o un **Nivel** dentro de esa materia.

### Estructura del Documento

Cada lección debe tener los siguientes campos:

| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | String | Sí | El título visible de la lección. |
| `description` | String | Sí | Breve descripción de lo que se aprenderá. |
| `order` | Number | Sí | Define la posición en la lista (1, 2, 3...). |
| `published` | Boolean | Sí | `true` para mostrar, `false` para ocultar (borrador). |
| `xp` | Number | No | Puntos de experiencia que otorga al completar (Default: 10). |
| `content` | Array | Sí | El contenido educativo (texto, imágenes, videos). |
| `quiz` | Object | No | (Opcional) El examen asociado a esta lección. |

### Ejemplo Completo de Documento (JSON)

```json
{
  "title": "Introducción a la Lectura Crítica",
  "description": "Aprende a identificar la intención del autor.",
  "order": 1,
  "published": true,
  "xp": 20,
  "content": [
    {
      "type": "text",
      "value": "La lectura crítica es la capacidad de analizar un texto..."
    },
    {
      "type": "image",
      "url": "https://ejemplo.com/imagen-explicativa.png",
      "caption": "Esquema de análisis"
    }
  ],
  "quiz": {
    "title": "Prueba de conceptos",
    "questions": [ ... ] // Ver sección Exámenes
  }
}
```

### Gestión de Lecciones (CRUD)

-   **Agregar:** Crea un nuevo documento en la colección correspondiente. Asegúrate de darle un `order` que siga la secuencia.
-   **Editar:** Modifica los campos directamente. Los cambios se reflejan la próxima vez que el usuario cargue la vista.
-   **Borrar:** Si borras un documento, desaparece de la app.
    -   *Cuidado:* Si borras la lección #2, tendrás un salto del #1 al #3. Se recomienda reordenar si es necesario, aunque la app funcionará igual.

---

## 4. Exámenes y Preguntas

Los exámenes no son una colección separada (por ahora). Viven **dentro** del documento de la lección, en el campo `quiz`. Esto mantiene el contenido y su evaluación juntos.

### Estructura del objeto `quiz`

```json
"quiz": {
  "title": "Evaluación Rápida",
  "passingScore": 3, // Cuántas preguntas correctas para aprobar
  "questions": [
    // Array de preguntas
  ]
}
```

### Estructura de una Pregunta

Seguimos una estructura simplificada basada en el esquema general de la app:

```json
{
  "id": 1,
  "text": "¿Cuál es el propósito principal de un texto argumentativo?",
  "options": [
    { "id": "a", "text": "Narrar una historia" },
    { "id": "b", "text": "Convencer al lector" },
    { "id": "c", "text": "Describir un paisaje" },
    { "id": "d", "text": "Informar sobre un hecho" }
  ],
  "correctAnswer": "b",
  "explanation": "El texto argumentativo busca persuadir o convencer..."
}
```

---

## 5. Orden y Publicación

### Campo `order` (Number)
Controla la secuencia de las lecciones.
-   La app ordena ascendentemente: 1, 2, 3, 4...
-   **Tip:** Puedes usar decimales si necesitas insertar una lección entre dos existentes sin re-numerar todo (ej: 1.5 va entre 1 y 2), aunque es mejor usar enteros.

### Campo `published` (Boolean)
Es tu interruptor de seguridad.
-   `true`: La lección es visible para todos los usuarios.
-   `false`: La lección existe en la base de datos pero la app la ignora.
-   **Uso:** Úsalo para escribir contenido ("Drafts") sin que los usuarios lo vean a medio terminar.

---

## 6. Buenas Prácticas y Errores Comunes

### ✅ Qué HACER (Do's)
*   **Usa IDs automáticos** para los documentos de las lecciones, es más fácil que inventar nombres únicos.
*   **Mantén el contenido ligero.** Si tienes textos muy largos, divídelos en varios bloques de texto en el array `content`.
*   **Revisa el JSON.** Si copias y pegas estructuras, asegúrate de no dejar comas al final de listas o llaves sin cerrar.

### ❌ Qué NO HACER (Don'ts)
*   **No cambies el nombre de las colecciones.** Si renombras `learning_matematicas` a `clases_matematicas`, la app dejará de mostrar contenido.
*   **No borres campos obligatorios.** Si borras `title` u `order`, la app podría romperse al intentar renderizar esa lección.

### Errores Comunes
1.  **La lección no aparece:**
    *   ¿Está `published: true`?
    *   ¿Estás en la colección correcta (`learning_...`)?
2.  **Las lecciones salen desordenadas:**
    *   Revisa el campo `order`. Firestore ordena números (1, 2, 10) correctamente, pero si los guardas como texto ("1", "10", "2"), el orden será alfabético ("1", "10", "2"). **Asegúrate de que `order` sea de tipo Number.**

---

## 7. Ejemplo Práctico: Agregar una Lección Nueva

Digamos que quieres agregar una lección de "Álgebra Básica" en Matemáticas.

1.  Ve a la consola de Firebase > Firestore Database.
2.  Busca la colección **`learning_matematicas`**. (Si no existe, créala).
3.  Haz clic en **"Agregar documento"**.
4.  Deja el ID del documento en "Auto-ID".
5.  Agrega los campos:
    *   `title` (string): "Álgebra: Ecuaciones Lineales"
    *   `description` (string): "Introducción a despejar X."
    *   `order` (number): 5 (asumiendo que ya hay 4 lecciones).
    *   `published` (boolean): true
    *   `content` (array):
        *   Índice 0: Mapa (Map)
            *   `type`: "text"
            *   `value`: "Una ecuación lineal es una igualdad..."
    *   `quiz` (map): (Opcional, puedes dejarlo para después).
6.  Haz clic en **Guardar**.
7.  Abre tu app y recarga. ¡La lección 5 debería aparecer en la lista de Matemáticas!
