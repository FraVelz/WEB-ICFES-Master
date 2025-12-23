# Automatización de Ingesta de Contenido (Python + Firestore)

Este sistema permite subir masivamente lecciones y exámenes a Firestore desde archivos locales (JSON, Markdown o PDF).

## 1. Configuración Inicial

### Prerrequisitos
Necesitas Python 3.8+ instalado.

1.  **Instalar dependencias:**
    ```bash
    cd scripts
    pip install -r requirements.txt
    ```

2.  **Credenciales de Firebase:**
    *   Ve a la Consola de Firebase > Configuración del Proyecto > Cuentas de servicio.
    *   Genera una nueva clave privada.
    *   Descarga el archivo `.json` y guárdalo en la carpeta `scripts/` con el nombre `serviceAccountKey.json`.
    *   **IMPORTANTE:** Nunca subas este archivo a GitHub. Agrégalo a tu `.gitignore`.

## 2. Estructura de Carpetas

El script espera encontrar los archivos en las siguientes carpetas dentro de `scripts/`:

*   `/json`: Archivos `.json` listos para subir.
*   `/markdown`: Archivos `.md` con Frontmatter (metadatos).
*   `/pdf`: Archivos `.pdf` para conversión automática.

## 3. Cómo preparar el contenido

### Opción A: Markdown (Recomendado)
Es la forma más fácil de escribir lecciones. Usa "Frontmatter" (los guiones al principio) para definir los campos obligatorios.

**Ejemplo (`scripts/markdown/leccion1.md`):**
```markdown
---
id: "intro-algebra"
title: "Introducción al Álgebra"
area: "matematicas"
order: 1
type: "lesson"
published: true
---

# Bienvenido al Álgebra

Aquí comienza el contenido de la lección. Puedes usar **negritas**, listas e imágenes.

## Subtítulo
Más contenido...
```

### Opción B: JSON (Avanzado)
Úsalo si generas contenido desde otro sistema. Debe seguir estrictamente el esquema.

**Ejemplo (`scripts/json/data.json`):**
```json
{
  "id": "intro-algebra",
  "title": "Introducción al Álgebra",
  "area": "matematicas",
  "order": 1,
  "content": "Texto de la lección...",
  "questions": []
}
```

### Opción C: PDF (Experimental)
El script extraerá el texto y creará un borrador.
1.  Pon tu archivo en `scripts/pdf/documento.pdf`.
2.  Ejecuta el script.
3.  El script creará un archivo `documento_converted.md` en la misma carpeta.
4.  Revisa ese Markdown, ajusta el formato si es necesario y muévelo a la carpeta `/markdown` para subirlo oficialmente.

## 4. Ejecución del Script

Abre una terminal en la carpeta `scripts/` y ejecuta:

### Para subir Markdown a Matemáticas:
```bash
python ingest_content.py --format md --collection learning_matematicas
```

### Para subir JSON a Lectura Crítica:
```bash
python ingest_content.py --format json --collection learning_lectura_critica
```

### Argumentos disponibles:
*   `--format`: `json`, `md`, o `pdf`.
*   `--collection`: El nombre exacto de la colección en Firestore (ej: `learning_sociales`).
*   `--key`: (Opcional) Ruta a tu archivo de credenciales si no se llama `serviceAccountKey.json`.

## 5. Notas Técnicas (Senior)

*   **Idempotencia:** El script usa `merge=True`. Si el documento con ese `id` ya existe, actualiza los campos sin borrar lo que no se toque. Si no existe, lo crea.
*   **Batch Writes:** Se usa `batch()` de Firestore para agrupar escrituras. Esto es más eficiente y atómico (o se suben todos o falla el bloque).
*   **PDFs:** La conversión de PDF es "lossy" (con pérdida). Se recomienda usar el flujo PDF -> Markdown -> Revisión Humana -> Subida, en lugar de confiar ciegamente en la subida directa del PDF.
