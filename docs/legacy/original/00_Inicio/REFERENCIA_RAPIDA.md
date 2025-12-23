# Referencia Rápida - Sistema de Contenido ICFES

Guía rápida de uso de componentes de contenido para preguntas ICFES.

---

## Matriz de Componentes

 Necesito  Componente  Ubicación 
-------------------------------
 Solo texto  TextContent  QuestionContent/ 
 Imagen  ImageContent  QuestionContent/ 
 Tabla de datos  TableContent  QuestionContent/ 
 Ecuación  FormulaContent  QuestionContent/ 
 Gráfica  ChartContent  QuestionContent/ 
 Cronología  TimelineContent  QuestionContent/ 
 Código  CodeContent  QuestionContent/ 
 Geografía  MapContent  QuestionContent/ 
 Cita/fragmento  QuoteContent  QuestionContent/ 
 Combinado  CompositeContent  QuestionContent/ 

---

## Plantilla Rápida - Pregunta Simple

```javascript
{
  id: "pregunta-id",
  area: "mathematics",
  difficulty: "medium",
  contentBlocks: [
    { type: "text", content: "¿Pregunta?" }
  ],
  options: [
    { letter: "A", text: "Opción 1" },
    { letter: "B", text: "Opción 2" },
    { letter: "C", text: "Opción 3" },
    { letter: "D", text: "Opción 4" }
  ],
  correctAnswer: "A",
  explanation: "Porque..."
}
```

---

## Plantilla Rápida - Pregunta Compleja

```javascript
{
  id: "pregunta-compleja",
  area: "science",
  difficulty: "hard",
  contentBlocks: [
    { 
      type: "text", 
      content: "Observa:" 
    },
    { 
      type: "image", 
      content: { 
        src: "/images/...",
        alt: "Descripción",
        caption: "Figura 1"
      } 
    },
    { 
      type: "table", 
      content: { 
        headers: ["Col1", "Col2"],
        rows: [["A", "B"]]
      } 
    },
    { 
      type: "text", 
      content: "¿Pregunta?" 
    }
  ],
  options: [
    { letter: "A", text: "Opción 1" },
    { letter: "B", text: "Opción 2" },
    { letter: "C", text: "Opción 3" },
    { letter: "D", text: "Opción 4" }
  ],
  correctAnswer: "B",
  explanation: "..."
}
```

---

## Ejemplos de Código por Tipo

### TextContent
```javascript
{ 
  type: "text", 
  content: "Tu texto aquí" 
}
```

### ImageContent
```javascript
{ 
  type: "image", 
  content: { 
    src: "/images/example.png",
    alt: "Descripción",
    caption: "Pie de imagen"
  } 
}
```

### TableContent
```javascript
{ 
  type: "table", 
  content: { 
    headers: ["Encabezado 1", "Encabezado 2"],
    rows: [
      ["Dato 1", "Dato 2"],
      ["Dato 3", "Dato 4"]
    ],
    caption: "Título de tabla"
  } 
}
```

### FormulaContent
```javascript
{ 
  type: "formula", 
  content: { 
    formula: "E = mc^2",
    description: "Fórmula de Einstein"
  } 
}
```

### ChartContent
```javascript
{ 
  type: "chart", 
  content: { 
    type: "bar",
    title: "Título",
    labels: ["Q1", "Q2"],
    datasets: [
      { label: "Series", data: [100, 150] }
    ]
  } 
}
```

### TimelineContent
```javascript
{ 
  type: "timeline", 
  content: { 
    title: "Título",
    orientation: "vertical",
    events: [
      { year: "2020", event: "Evento 1" },
      { year: "2021", event: "Evento 2" }
    ]
  } 
}
```

### CodeContent
```javascript
{ 
  type: "code", 
  content: { 
    language: "python",
    code: "print('hello')",
    title: "Ejemplo",
    showLineNumbers: true
  } 
}
```

### MapContent
```javascript
{ 
  type: "map", 
  content: { 
    title: "Título",
    imageSrc: "/images/map.png",
    regions: [
      { name: "Región 1", highlight: true }
    ]
  } 
}
```

### QuoteContent
```javascript
{ 
  type: "quote", 
  content: { 
    text: "Texto de la cita",
    author: "Nombre",
    type: "quote"
  } 
}
```

### CompositeContent
```javascript
// Array de bloques
const blocks = [
  { type: "text", content: "..." },
  { type: "image", content: { ... } },
  { type: "table", content: { ... } }
];

<CompositeContent blocks={blocks} />
```

---

## Ubicaciones Importantes

 Archivo  Ruta 
---------------
 Componentes  `src/shared/components/organisms/QuestionContent/` 
 Preguntas  `src/core/data/questions.js` 
 Imágenes  `public/images/[area]/` 
 Utilidades  `src/shared/utils/` 
 Constantes  `src/core/constants/` 

---

## Checklist Rápido

Antes de agregar pregunta:
- ID único
- Área correcta
- ContentBlocks estructurados
- 4 opciones (A, B, C, D)
- Respuesta correcta coincide
- Explicación clara
- Imágenes optimizadas

---

## Acceso Rápido a Documentación

- Guía completa: `CONTENIDO_PREGUNTAS_GUIA.md`
- Estructura técnica: `ESTRUCTURA_DATOS_PREGUNTAS.md`
- Ejemplos funcionales: `EJEMPLOS_PREGUNTAS_AVANZADAS.js`
- Descripción general: `SISTEMA_CONTENIDO_AVANZADO.md`

---

Última actualización: 11 de diciembre de 2025
