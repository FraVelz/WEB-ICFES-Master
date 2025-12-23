# Guía de Contenido para Preguntas ICFES

Esta guía explica cómo crear preguntas complejas con diferentes tipos de contenido (imágenes, tablas, fórmulas, etc.) para el proyecto Pruebas ICFES.

---

## Ubicación de Componentes

Todos los componentes de contenido están en:
```
src/shared/components/organisms/QuestionContent/
```

---

## Componentes Disponibles

### 1. TextContent - Texto Simple

Para preguntas que solo tienen texto.

**Ubicación:** `TextContent.jsx`

**Uso:**
```jsx
import { TextContent } from '@/shared/components/organisms/QuestionContent';

<TextContent text="¿Cuál es la capital de Colombia?" />
```

**Props:**
- `text` (string, requerido): El texto a mostrar
- `className` (string, opcional): Clases Tailwind adicionales

---

### 2. ImageContent - Imágenes

Para preguntas que incluyen imágenes, gráficas, diagramas, etc.

**Ubicación:** `ImageContent.jsx`

**Uso:**
```jsx
import { ImageContent } from '@/shared/components/organisms/QuestionContent';

<ImageContent 
  src="/images/map-colombia.png"
  alt="Mapa político de Colombia"
  caption="Mapa de las regiones de Colombia"
  maxWidth="500px"
/>
```

**Props:**
- `src` (string, requerido): Ruta de la imagen
- `alt` (string, requerido): Texto alternativo
- `caption` (string, opcional): Pie de imagen
- `maxWidth` (string, default: "100%"): Ancho máximo

**Estructura de carpetas recomendada:**
```
public/images/
 mathematics/
    geometry/
    algebra/
    statistics/
 science/
    biology/
    physics/
    chemistry/
 language/
    literature/
 social/
     history/
     geography/
```

---

### 3. TableContent - Tablas

Para preguntas que presentan datos en tablas.

**Ubicación:** `TableContent.jsx`

**Uso:**
```jsx
import { TableContent } from '@/shared/components/organisms/QuestionContent';

<TableContent
  headers={["País", "Población", "Capital"]}
  rows={[
    ["Colombia", "50 millones", "Bogotá"],
    ["Perú", "33 millones", "Lima"]
  ]}
  caption="Población de países andinos (2023)"
/>
```

**Props:**
- `headers` (array, requerido): Array de encabezados
- `rows` (array, requerido): Array de filas
- `caption` (string, opcional): Pie de tabla

---

### 4. FormulaContent - Fórmulas Matemáticas

Para mostrar ecuaciones y fórmulas usando LaTeX.

**Ubicación:** `FormulaContent.jsx`

**Instalación recomendada:**
```bash
npm install katex react-katex
```

**Uso:**
```jsx
import { FormulaContent } from '@/shared/components/organisms/QuestionContent';

<FormulaContent 
  formula="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
  description="Fórmula cuadrática"
/>
```

**Props:**
- `formula` (string, requerido): Fórmula en notación LaTeX
- `inline` (boolean, default: false): Si es inline o en bloque
- `description` (string, opcional): Descripción

**Ejemplos de sintaxis LaTeX:**
```
Fracciones:  \frac{a}{b}
Raíces:      \sqrt{x}
Potencias:   x^2
Subíndices:  x_{n+1}
```

---

### 5. ChartContent - Gráficas

Para mostrar gráficos de datos.

**Ubicación:** `ChartContent.jsx`

**Instalación para avanzado:**
```bash
npm install chart.js react-chartjs-2
```

**Uso:**
```jsx
import { ChartContent } from '@/shared/components/organisms/QuestionContent';

<ChartContent
  type="bar"
  title="Crecimiento económico por trimestre"
  labels={["Q1", "Q2", "Q3", "Q4"]}
  datasets={[
    { label: "PIB (Billones USD)", data: [2.5, 2.8, 3.1, 3.4] }
  ]}
/>
```

**Props:**
- `type` (string): "bar", "line", o "pie"
- `labels` (array, requerido): Etiquetas del eje X
- `datasets` (array, requerido): Series de datos
- `title` (string, opcional): Título del gráfico

---

### 6. TimelineContent - Líneas de Tiempo

Para mostrar eventos históricos en orden cronológico.

**Ubicación:** `TimelineContent.jsx`

**Uso:**
```jsx
import { TimelineContent } from '@/shared/components/organisms/QuestionContent';

<TimelineContent
  title="Historia de Colombia"
  orientation="vertical"
  events={[
    { year: "1492", event: "Llegada de Colón a América" },
    { year: "1810", event: "Grito de Independencia" },
    { year: "1819", event: "Batalla de Boyacá" }
  ]}
/>
```

**Props:**
- `events` (array, requerido): Eventos con `year` y `event`
- `title` (string, opcional): Título
- `orientation` (string): "vertical" u "horizontal"

---

### 7. CodeContent - Código/Pseudocódigo

Para mostrar código de programación.

**Ubicación:** `CodeContent.jsx`

**Uso:**
```jsx
import { CodeContent } from '@/shared/components/organisms/QuestionContent';

<CodeContent
  language="python"
  code={`def factorial(n):
  if n == 0:
    return 1
  return n * factorial(n-1)`}
  title="Función factorial"
  showLineNumbers={true}
/>
```

**Props:**
- `language` (string): Lenguaje (python, javascript, java, pseudocode, sql, etc.)
- `code` (string, requerido): Código a mostrar
- `title` (string, opcional): Título
- `showLineNumbers` (boolean, default: true): Mostrar números de línea

---

### 8. MapContent - Mapas/Diagramas Geográficos

Para mostrar mapas políticos o geográficos.

**Ubicación:** `MapContent.jsx`

**Uso:**
```jsx
import { MapContent } from '@/shared/components/organisms/QuestionContent';

<MapContent
  title="División política de Sudamérica"
  imageSrc="/images/south-america-map.png"
  regions={[
    { name: "Colombia", highlight: true, info: "Capital: Bogotá" },
    { name: "Perú", highlight: true, info: "Capital: Lima" }
  ]}
/>
```

**Props:**
- `title` (string, opcional): Título del mapa
- `imageSrc` (string, opcional): Ruta de la imagen
- `regions` (array, opcional): Regiones para destacar
- `description` (string, opcional): Descripción

---

### 9. QuoteContent - Citas/Fragmentos

Para mostrar citas textuales o fragmentos de documentos.

**Ubicación:** `QuoteContent.jsx`

**Uso:**
```jsx
import { QuoteContent } from '@/shared/components/organisms/QuestionContent';

<QuoteContent
  text="La educación es un derecho de la persona..."
  source="Constitución Política de Colombia, Artículo 67"
  type="excerpt"
/>
```

**Props:**
- `text` (string, requerido): Texto de la cita
- `author` (string, opcional): Autor de la cita
- `source` (string, opcional): Fuente del texto
- `type` (string): "quote" o "excerpt"

---

### 10. CompositeContent - Contenido Combinado

Para combinar múltiples tipos de contenido en una pregunta.

**Ubicación:** `CompositeContent.jsx`

**Uso:**
```jsx
import { CompositeContent } from '@/shared/components/organisms/QuestionContent';

const blocks = [
  { type: "text", content: "Texto inicial" },
  { type: "image", content: { src: "...", alt: "..." } },
  { type: "table", content: { headers: [...], rows: [...] } },
  { type: "text", content: "Pregunta final" }
];

<CompositeContent blocks={blocks} />
```

---

## Estructura de Pregunta Completa

```javascript
const question = {
  id: "unique-id",
  area: "mathematics",           // mathematics, lenguaje, science, social
  difficulty: "medium",           // easy, medium, hard
  contentBlocks: [
    { type: "text", content: "Texto de introducción" },
    { type: "image", content: { src: "...", alt: "..." } },
    { type: "table", content: { headers: [...], rows: [...] } },
    { type: "formula", content: { formula: "..." } },
    { type: "text", content: "Pregunta final" }
  ],
  options: [
    { letter: "A", text: "Opción A" },
    { letter: "B", text: "Opción B" },
    { letter: "C", text: "Opción C" },
    { letter: "D", text: "Opción D" }
  ],
  correctAnswer: "A",
  explanation: "Explicación clara de por qué esta es la respuesta correcta..."
};
```

---

## Cómo Integrar en Componentes

En PracticePage o FullExamPage:

```jsx
import { CompositeContent } from '@/shared/components/organisms/QuestionContent';

{questions.map((question) => (
  <div key={question.id}>
    {question.contentBlocks ? (
      <CompositeContent blocks={question.contentBlocks} />
    ) : (
      <TextContent text={question.text} />
    )}
    
    {question.options.map((option) => (
      // Renderizar opciones de respuesta
    ))}
  </div>
))}
```

---

## Dónde Agregar Preguntas

**Archivo:** `src/core/data/questions.js`

```javascript
export const MATHEMATICS_QUESTIONS = [
  ...existingQuestions,
  { id: "new-question", ... }
];
```

---

## Mejores Prácticas

1. Siempre incluya descripciones en imágenes y tablas
2. Use contentBlocks para preguntas complejas
3. Valide fórmulas LaTeX antes de guardar
4. Optimice imágenes (máximo 500KB)
5. Proporcione contexto claro antes de elementos complejos
6. Escriba explicaciones detalladas y educativas
7. Pruebe la pregunta en el navegador antes de guardar

---

## Verificación Antes de Guardar

- ID único y descriptivo
- Área correcta asignada
- Dificultad apropiada
- ContentBlocks bien estructurados
- 4 opciones de respuesta (A, B, C, D)
- Respuesta correcta coincide con opciones
- Explicación clara
- Imágenes optimizadas
- Sin errores ortográficos
- Probado en navegador

---

Última actualización: 11 de diciembre de 2025
Versión: 1.0
