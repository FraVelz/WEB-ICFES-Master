#  Guía de Contenido para Preguntas ICFES

Esta guía explica cómo crear preguntas complejas con diferentes tipos de contenido (imágenes, tablas, fórmulas, etc.) para el proyecto Pruebas ICFES.

---

##  Ubicación de Componentes

Todos los componentes de contenido están en:
```
src/shared/components/organisms/QuestionContent/
```

---

##  Componentes Disponibles

### 1. **TextContent** - Texto Simple

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

**Ejemplo en pregunta:**
```javascript
{
  id: "q1",
  text: "¿Cuál es la capital de Colombia?",
  contentBlocks: [
    { type: "text", content: "¿Cuál es la capital de Colombia?" }
  ],
  options: [...],
  correctAnswer: "A"
}
```

---

### 2. **ImageContent** - Imágenes

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

**Estructura de carpetas para imágenes:**
```
public/
  images/
    mathematics/
      geometry/
      algebra/
    science/
      biology/
      physics/
    lenguaje/
    social/
```

**Ejemplo en pregunta:**
```javascript
{
  id: "q2",
  contentBlocks: [
    {
      type: "text",
      content: "Observa la siguiente imagen de un triángulo rectángulo:"
    },
    {
      type: "image",
      content: {
        src: "/images/mathematics/geometry/triangle.png",
        alt: "Triángulo rectángulo",
        caption: "Figura 1: Triángulo rectángulo con ángulo de 90°"
      }
    },
    {
      type: "text",
      content: "¿Cuál es el valor de la hipotenusa?"
    }
  ],
  options: [...],
  correctAnswer: "B"
}
```

---

### 3. **TableContent** - Tablas

Para preguntas que presentan datos en tablas.

**Ubicación:** `TableContent.jsx`

**Uso:**
```jsx
import { TableContent } from '@/shared/components/organisms/QuestionContent';

<TableContent
  headers={["País", "Población", "Capital"]}
  rows={[
    ["Colombia", "50 millones", "Bogotá"],
    ["Perú", "33 millones", "Lima"],
    ["Venezuela", "28 millones", "Caracas"]
  ]}
  caption="Población de países andinos (2023)"
/>
```

**Props:**
- `headers` (array, requerido): Array de encabezados
- `rows` (array, requerido): Array de filas, cada fila es un array
- `caption` (string, opcional): Pie de tabla

**Ejemplo en pregunta:**
```javascript
{
  id: "q3",
  contentBlocks: [
    {
      type: "text",
      content: "Observa la siguiente tabla de datos:"
    },
    {
      type: "table",
      content: {
        headers: ["Año", "Exportaciones (USD)", "Importaciones (USD)"],
        rows: [
          ["2020", "$2.5B", "$1.8B"],
          ["2021", "$3.2B", "$2.1B"],
          ["2022", "$4.1B", "$3.3B"]
        ],
        caption: "Comercio exterior de Colombia"
      }
    },
    {
      type: "text",
      content: "¿Cuál fue el balance comercial en 2021?"
    }
  ],
  options: [...],
  correctAnswer: "A"
}
```

---

### 4. **FormulaContent** - Fórmulas Matemáticas

Para mostrar ecuaciones y fórmulas matemáticas usando LaTeX.

**Ubicación:** `FormulaContent.jsx`

**Nota:** Para usar completamente, instala KaTeX:
```bash
npm install katex react-katex
```

**Uso:**
```jsx
import { FormulaContent } from '@/shared/components/organisms/QuestionContent';

// Fórmula en bloque
<FormulaContent 
  formula="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
  description="Fórmula cuadrática"
/>

// Fórmula inline
<FormulaContent 
  formula="E = mc^2"
  inline={true}
/>
```

**Props:**
- `formula` (string, requerido): La fórmula en notación LaTeX
- `inline` (boolean, default: false): Si es inline o en bloque
- `description` (string, opcional): Descripción de la fórmula

**Recursos LaTeX:**
- [LaTeX Math Symbols](https://www.latex-tutorial.com/symbols/)
- Fracciones: `\frac{numerador}{denominador}`
- Raíces: `\sqrt{x}` o `\sqrt[n]{x}`
- Potencias: `x^n` o `x^{2n}`
- Subíndices: `x_n` o `x_{n+1}`

**Ejemplo en pregunta:**
```javascript
{
  id: "q4",
  contentBlocks: [
    {
      type: "text",
      content: "La distancia d entre dos puntos se calcula con:"
    },
    {
      type: "formula",
      content: {
        formula: "d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
        description: "Fórmula de distancia entre dos puntos"
      }
    },
    {
      type: "text",
      content: "Si P1(1,2) y P2(4,6), ¿cuál es la distancia?"
    }
  ],
  options: [...],
  correctAnswer: "C"
}
```

---

### 5. **ChartContent** - Gráficas

Para mostrar gráficos de barras, líneas, etc.

**Ubicación:** `ChartContent.jsx`

**Nota:** Para gráficas interactivas avanzadas, instala Chart.js:
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
    {
      label: "PIB (Billones USD)",
      data: [2.5, 2.8, 3.1, 3.4]
    }
  ]}
  description="Datos del 2023"
/>
```

**Props:**
- `type` (string): "bar", "line", "pie"
- `labels` (array, requerido): Etiquetas del eje X
- `datasets` (array, requerido): Array de series de datos
- `title` (string, opcional): Título del gráfico
- `description` (string, opcional): Descripción

**Ejemplo en pregunta:**
```javascript
{
  id: "q5",
  contentBlocks: [
    {
      type: "text",
      content: "Analiza el siguiente gráfico de ventas:"
    },
    {
      type: "chart",
      content: {
        type: "bar",
        title: "Ventas mensuales",
        labels: ["Enero", "Febrero", "Marzo", "Abril"],
        datasets: [
          { label: "Unidades vendidas", data: [120, 150, 180, 200] }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuál es el promedio de ventas?"
    }
  ],
  options: [...],
  correctAnswer: "B"
}
```

---

### 6. **TimelineContent** - Líneas de Tiempo

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
    { year: "1819", event: "Batalla de Boyacá" },
    { year: "1991", event: "Nueva Constitución Política" }
  ]}
/>
```

**Props:**
- `events` (array, requerido): Array de eventos con `year` y `event`
- `title` (string, opcional): Título de la línea de tiempo
- `orientation` (string, default: "vertical"): "vertical" o "horizontal"

**Estructura de evento:**
```javascript
{
  year: "1819",
  event: "Batalla de Boyacá - Independencia asegurada"
}
```

**Ejemplo en pregunta:**
```javascript
{
  id: "q6",
  contentBlocks: [
    {
      type: "text",
      content: "Observa la siguiente línea de tiempo:"
    },
    {
      type: "timeline",
      content: {
        title: "Independencia en América Latina",
        orientation: "vertical",
        events: [
          { year: "1776", event: "Independencia de EE.UU." },
          { year: "1810", event: "Independencia de México" },
          { year: "1821", event: "Independencia de Perú" }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuántos años pasaron entre la independencia de México y Perú?"
    }
  ],
  options: [...],
  correctAnswer: "A"
}
```

---

### 7. **CodeContent** - Código/Pseudocódigo

Para mostrar código de programación o pseudocódigo.

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
  title="Función factorial recursiva"
  showLineNumbers={true}
/>
```

**Props:**
- `language` (string, default: "pseudocode"): "python", "javascript", "java", "pseudocode", "sql", etc.
- `code` (string, requerido): El código a mostrar
- `title` (string, opcional): Título del código
- `showLineNumbers` (boolean, default: true): Mostrar números de línea

**Ejemplo en pregunta:**
```javascript
{
  id: "q7",
  contentBlocks: [
    {
      type: "text",
      content: "Analiza el siguiente algoritmo:"
    },
    {
      type: "code",
      content: {
        language: "pseudocode",
        code: `FUNCIÓN fibonacci(n)
  SI n <= 1
    RETORNA n
  RETORNA fibonacci(n-1) + fibonacci(n-2)
FIN`,
        title: "Serie de Fibonacci"
      }
    },
    {
      type: "text",
      content: "¿Cuál es el resultado de fibonacci(5)?"
    }
  ],
  options: [...],
  correctAnswer: "C"
}
```

---

### 8. **MapContent** - Mapas/Diagramas Geográficos

Para mostrar mapas políticos, geográficos o diagramas con regiones.

**Ubicación:** `MapContent.jsx`

**Uso:**
```jsx
import { MapContent } from '@/shared/components/organisms/QuestionContent';

<MapContent
  title="División política de Sudamérica"
  imageSrc="/images/south-america-map.png"
  regions={[
    { name: "Colombia", highlight: true, info: "Capital: Bogotá" },
    { name: "Perú", highlight: true, info: "Capital: Lima" },
    { name: "Brasil", highlight: false, info: "Capital: Brasilia" }
  ]}
  description="Países andinos destacados en púrpura"
/>
```

**Props:**
- `title` (string, opcional): Título del mapa
- `imageSrc` (string, opcional): Ruta de la imagen del mapa
- `svgContent` (string, opcional): Contenido SVG directamente
- `regions` (array, opcional): Array de regiones con propiedades
- `description` (string, opcional): Descripción del mapa

**Estructura de región:**
```javascript
{
  name: "Colombia",        // Nombre de la región
  highlight: true,         // Si debe estar resaltada
  info: "Capital: Bogotá"  // Información adicional
}
```

**Ejemplo en pregunta:**
```javascript
{
  id: "q8",
  contentBlocks: [
    {
      type: "text",
      content: "Observa el siguiente mapa de biomas de Colombia:"
    },
    {
      type: "map",
      content: {
        title: "Biomas de Colombia",
        imageSrc: "/images/colombia-biomes.png",
        regions: [
          { name: "Amazonía", highlight: true, info: "Bosque tropical" },
          { name: "Andes", highlight: true, info: "Montañas" },
          { name: "Caribe", highlight: false, info: "Costa" }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuál es el bioma más grande de Colombia?"
    }
  ],
  options: [...],
  correctAnswer: "A"
}
```

---

### 9. **QuoteContent** - Citas/Fragmentos

Para mostrar citas textuales o fragmentos de documentos.

**Ubicación:** `QuoteContent.jsx`

**Uso:**
```jsx
import { QuoteContent } from '@/shared/components/organisms/QuestionContent';

// Cita
<QuoteContent
  text="La educación es el arma más poderosa que puedes usar para cambiar el mundo"
  author="Nelson Mandela"
  type="quote"
/>

// Fragmento de texto
<QuoteContent
  text="La República de Colombia es un Estado social de derecho..."
  source="Constitución Política de Colombia, Artículo 1"
  type="excerpt"
/>
```

**Props:**
- `text` (string, requerido): El texto de la cita
- `author` (string, opcional): Autor de la cita
- `source` (string, opcional): Fuente del texto
- `type` (string, default: "quote"): "quote" o "excerpt"

**Ejemplo en pregunta:**
```javascript
{
  id: "q9",
  contentBlocks: [
    {
      type: "text",
      content: "Lee el siguiente fragmento de la Constitución:"
    },
    {
      type: "quote",
      content: {
        text: "La educación es un derecho de la persona y un servicio público que tiene una función social.",
        source: "Constitución Política de Colombia, Artículo 67",
        type: "excerpt"
      }
    },
    {
      type: "text",
      content: "¿A qué aspecto de la educación se refiere este artículo?"
    }
  ],
  options: [...],
  correctAnswer: "B"
}
```

---

### 10. **CompositeContent** - Contenido Combinado

Componente que combina varios tipos de contenido en una sola pregunta.

**Ubicación:** `CompositeContent.jsx`

**Uso:**
```jsx
import { CompositeContent } from '@/shared/components/organisms/QuestionContent';

const blocks = [
  { type: "text", content: "Lee el siguiente caso:" },
  { type: "quote", content: { text: "...", source: "..." } },
  { type: "table", content: { headers: [...], rows: [...] } },
  { type: "image", content: { src: "...", alt: "..." } },
  { type: "text", content: "¿Cuál es la respuesta?" }
];

<CompositeContent blocks={blocks} />
```

**Props:**
- `blocks` (array, requerido): Array de bloques de contenido

---

##  Estructura de Preguntas Compleja

Aquí está la estructura completa recomendada para preguntas avanzadas:

```javascript
const advancedQuestion = {
  id: "q-complex-001",
  area: "science",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "Lee el siguiente caso y analiza los datos presentados:"
    },
    {
      type: "quote",
      content: {
        text: "El cambio climático es una de las mayores amenazas...",
        source: "ONU - Reporte de Cambio Climático 2023",
        type: "excerpt"
      }
    },
    {
      type: "text",
      content: "Observa la siguiente tabla de datos:"
    },
    {
      type: "table",
      content: {
        headers: ["Año", "Temperatura (°C)", "CO2 (ppm)"],
        rows: [
          ["2000", "14.2", "369"],
          ["2010", "14.5", "390"],
          ["2020", "14.9", "414"]
        ],
        caption: "Datos de cambio climático"
      }
    },
    {
      type: "image",
      content: {
        src: "/images/climate-chart.png",
        alt: "Gráfica de temperatura",
        caption: "Fig. 1: Cambio de temperatura global"
      }
    },
    {
      type: "formula",
      content: {
        formula: "\text{Aumento} = \frac{\Delta T}{\Delta t}",
        description: "Tasa de cambio de temperatura"
      }
    },
    {
      type: "text",
      content: "Con base en los datos, ¿cuál es la tasa aproximada de aumento de temperatura por década?"
    }
  ],
  options: [
    { letter: "A", text: "0.07°C por década" },
    { letter: "B", text: "0.35°C por década" },
    { letter: "C", text: "0.7°C por década" },
    { letter: "D", text: "1.4°C por década" }
  ],
  correctAnswer: "B",
  explanation: "Calculando el cambio de 14.2 a 14.9 en 20 años: (14.9-14.2)/2 = 0.35°C por década"
};
```

---

##  Cómo Usar en Componentes

### En PracticePage o FullExamPage:

```jsx
import { CompositeContent } from '@/shared/components/organisms/QuestionContent';

// En tu componente de renderizado de preguntas:
{questions.map((question) => (
  <div key={question.id}>
    {/* Si la pregunta tiene contentBlocks */}
    {question.contentBlocks ? (
      <CompositeContent blocks={question.contentBlocks} />
    ) : (
      <TextContent text={question.text} />
    )}
    
    {/* Opciones de respuesta */}
    {question.options.map((option) => (
      // ... renderizar opciones
    ))}
  </div>
))}
```

---

##  Archivos de Datos

### Actualizar estructura de preguntas:

**Archivo:** `src/core/data/questions.js`

```javascript
export const SCIENCE_QUESTIONS = [
  {
    id: "science-001",
    area: "science",
    contentBlocks: [
      { type: "text", content: "¿Qué es la fotosíntesis?" },
      // ...
    ],
    options: [...],
    correctAnswer: "A",
    explanation: "..."
  },
  // más preguntas
];
```

---

##  Estilos Predefinidos

Todos los componentes usan Tailwind CSS con los siguientes colores:

- **Cyan/Blue**: Para elementos principales (TextContent, AnswerOptions)
- **Orange**: Para líneas de tiempo
- **Purple**: Para mapas y diagramas
- **Green**: Para código
- **Blue**: Para citas
- **Amber**: Para fragmentos de documentos

---

##  Checklist para Agregar una Nueva Pregunta

- [ ] Elige el componente(s) necesario(s)
- [ ] Prepare el contenido (texto, imagen, tabla, etc.)
- [ ] Cree la estructura de `contentBlocks`
- [ ] Agregue opciones de respuesta
- [ ] Defina la respuesta correcta
- [ ] Escriba una explicación
- [ ] Pruebe en el navegador
- [ ] Agregue a `src/core/data/questions.js`

---

##  Mejores Prácticas

1. **Siempre incluya descripciones** en imágenes y tablas
2. **Use contentBlocks** en lugar de solo `text` para preguntas complejas
3. **Valide las fórmulas LaTeX** antes de guardar
4. **Optimice imágenes** antes de subirlas (máx 500KB)
5. **Proporcione contexto** con `<TextContent>` antes de elementos complejos
6. **Use explicaciones claras** en `explanation`

---

##  Recursos Adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [LaTeX Math Symbols](https://www.latex-tutorial.com/symbols/)
- [FontAwesome Icons](https://fontawesome.com/icons)
- [Estructura de Archivos ICFES](./ESTRUCTURA_ARCHIVOS.md)

---

**Última actualización:** 11 de diciembre de 2025
**Versión:** 1.0
