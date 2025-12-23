#  Estructura de Datos para Preguntas ICFES

Guía completa sobre cómo estructurar los datos de preguntas con contenido avanzado.

---

##  Estructura Base de una Pregunta

```javascript
{
  // ID único (requerido)
  id: "unique-question-id",
  
  // Área de conocimiento (requerido)
  area: "mathematics", // "mathematics", "lenguaje", "science", "social"
  
  // Nivel de dificultad (recomendado)
  difficulty: "medium", // "easy", "medium", "hard"
  
  // Bloques de contenido (requerido)
  contentBlocks: [
    // Ver tipos de bloques abajo
  ],
  
  // Opciones de respuesta (requerido)
  options: [
    { letter: "A", text: "Opción 1" },
    { letter: "B", text: "Opción 2" },
    { letter: "C", text: "Opción 3" },
    { letter: "D", text: "Opción 4" }
  ],
  
  // Respuesta correcta (requerido)
  correctAnswer: "A",
  
  // Explicación de la respuesta (requerido)
  explanation: "Esta es la respuesta correcta porque..."
}
```

---

##  Tipos de Content Blocks

### 1. **Text Block**
```javascript
{
  type: "text",
  content: "Este es el texto de la pregunta o instrucción"
}
```

---

### 2. **Image Block**
```javascript
{
  type: "image",
  content: {
    src: "/images/mathematics/geometry/triangle.png",      //  requerido
    alt: "Descripción de la imagen",                        //  requerido
    caption: "Figura 1: Descripción detallada",            // opcional
    maxWidth: "500px"                                       // opcional (default: 100%)
  }
}
```

**Estructura recomendada de carpetas para imágenes:**
```
public/
 images/
    mathematics/
       algebra/
       geometry/
       calculus/
       statistics/
    science/
       biology/
       physics/
       chemistry/
       ecology/
    lenguaje/
       literature/
       grammar/
       comprehension/
    social/
        history/
        geography/
        economy/
        culture/
```

---

### 3. **Table Block**
```javascript
{
  type: "table",
  content: {
    headers: [
      "Encabezado 1",
      "Encabezado 2",
      "Encabezado 3"
    ],                                              //  requerido
    rows: [
      ["Dato 1", "Dato 2", "Dato 3"],
      ["Dato 4", "Dato 5", "Dato 6"],
      ["Dato 7", "Dato 8", "Dato 9"]
    ],                                              //  requerido
    caption: "Pie de tabla descriptivo"            // opcional
  }
}
```

---

### 4. **Formula Block**
```javascript
{
  type: "formula",
  content: {
    formula: "E = mc^2",                           //  requerido (LaTeX)
    description: "Equivalencia masa-energía",      // opcional
    inline: false                                  // opcional (default: false)
  }
}
```

**Ejemplos de fórmulas LaTeX:**
```javascript
// Fracciones
"\\frac{a}{b}"                    // a/b

// Raíces
"\\sqrt{x}"                       // √x
"\\sqrt[3]{x}"                    // ∛x

// Potencias y subíndices
"x^2"                             // x²
"x_{n+1}"                         // x subscrito n+1
"a^{2n}"                          // a a la 2n

// Ecuaciones
"\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"  // Fórmula cuadrática

// Integrales y derivadas
"\\int_0^{\\infty} x^2 dx"       // Integral
"\\frac{dy}{dx}"                 // Derivada
```

---

### 5. **Chart Block**
```javascript
{
  type: "chart",
  content: {
    type: "bar",                      // "bar", "line", "pie" ( requerido)
    title: "Título del gráfico",      // opcional
    labels: ["Q1", "Q2", "Q3", "Q4"], //  requerido
    datasets: [
      {
        label: "Serie 1",
        data: [100, 150, 120, 200]
      },
      {
        label: "Serie 2",             // opcional (múltiples series)
        data: [80, 120, 100, 180]
      }
    ],                                //  requerido
    description: "Descripción de datos" // opcional
  }
}
```

---

### 6. **Code Block**
```javascript
{
  type: "code",
  content: {
    language: "python",                          //  requerido
    code: `def factorial(n):
  if n <= 1:
    return 1
  return n * factorial(n-1)`,                    //  requerido
    title: "Función factorial recursiva",        // opcional
    showLineNumbers: true                        // opcional (default: true)
  }
}
```

**Lenguajes soportados:**
- `pseudocode`
- `python`
- `javascript`
- `java`
- `c`
- `cpp`
- `sql`
- `html`
- `css`

---

### 7. **Quote Block**
```javascript
{
  type: "quote",
  content: {
    text: "El texto de la cita o fragmento",      //  requerido
    author: "Nombre del autor",                  // opcional
    source: "Fuente del texto",                  // opcional
    type: "quote"                                // "quote" o "excerpt"
  }
}
```

---

### 8. **Timeline Block**
```javascript
{
  type: "timeline",
  content: {
    title: "Título de la línea de tiempo",       // opcional
    orientation: "vertical",                     // "vertical" o "horizontal"
    events: [
      { year: "1810", event: "Evento 1" },
      { year: "1819", event: "Evento 2" },
      { year: "1821", event: "Evento 3" }
    ]                                            //  requerido
  }
}
```

---

### 9. **Map Block**
```javascript
{
  type: "map",
  content: {
    title: "Título del mapa",                    // opcional
    imageSrc: "/images/social/map.png",          // requerido (imagen o SVG)
    regions: [
      {
        name: "Región 1",
        highlight: true,
        info: "Información adicional"
      },
      {
        name: "Región 2",
        highlight: false,
        info: "Más información"
      }
    ],                                           // opcional
    description: "Descripción del mapa"          // opcional
  }
}
```

---

##  Ejemplos Completos

### Ejemplo 1: Pregunta Simple (Solo Texto)

```javascript
{
  id: "lang-001",
  area: "lenguaje",
  difficulty: "easy",
  contentBlocks: [
    {
      type: "text",
      content: "¿Cuál es la definición de sustantivo?"
    }
  ],
  options: [
    { letter: "A", text: "Palabra que expresa una acción" },
    { letter: "B", text: "Palabra que nombra personas, cosas o ideas" },
    { letter: "C", text: "Palabra que describe cualidades" },
    { letter: "D", text: "Palabra que conecta otras palabras" }
  ],
  correctAnswer: "B",
  explanation: "Un sustantivo es una palabra que nombra o designa personas, cosas o ideas."
}
```

---

### Ejemplo 2: Pregunta con Tabla

```javascript
{
  id: "math-001",
  area: "mathematics",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "Analiza la siguiente tabla de datos:"
    },
    {
      type: "table",
      content: {
        headers: ["x", "f(x) = 2x + 1"],
        rows: [
          ["1", "3"],
          ["2", "5"],
          ["3", "7"],
          ["4", "9"]
        ],
        caption: "Tabla de valores de una función lineal"
      }
    },
    {
      type: "text",
      content: "¿Cuál es la pendiente de esta función?"
    }
  ],
  options: [
    { letter: "A", text: "1" },
    { letter: "B", text: "2" },
    { letter: "C", text: "3" },
    { letter: "D", text: "4" }
  ],
  correctAnswer: "B",
  explanation: "La pendiente es el coeficiente de x en la función f(x) = 2x + 1, que es 2."
}
```

---

### Ejemplo 3: Pregunta con Imagen y Fórmula

```javascript
{
  id: "sci-001",
  area: "science",
  difficulty: "hard",
  contentBlocks: [
    {
      type: "text",
      content: "Observa el siguiente diagrama de un circuito eléctrico:"
    },
    {
      type: "image",
      content: {
        src: "/images/science/physics/circuit.png",
        alt: "Circuito con resistencias en serie",
        caption: "Figura 1: Circuito con tres resistencias de 10Ω cada una"
      }
    },
    {
      type: "text",
      content: "Para resistencias en serie, la resistencia total se calcula como:"
    },
    {
      type: "formula",
      content: {
        formula: "R_{total} = R_1 + R_2 + R_3",
        description: "Suma de resistencias en serie"
      }
    },
    {
      type: "text",
      content: "¿Cuál es la resistencia total del circuito?"
    }
  ],
  options: [
    { letter: "A", text: "10 Ω" },
    { letter: "B", text: "20 Ω" },
    { letter: "C", text: "30 Ω" },
    { letter: "D", text: "3.33 Ω" }
  ],
  correctAnswer: "C",
  explanation: "R_total = 10 + 10 + 10 = 30 Ω"
}
```

---

### Ejemplo 4: Pregunta con Múltiples Elementos

```javascript
{
  id: "soc-001",
  area: "social",
  difficulty: "hard",
  contentBlocks: [
    {
      type: "text",
      content: "Lee el siguiente fragmento histórico:"
    },
    {
      type: "quote",
      content: {
        text: "La batalla de Boyacá fue decisiva para asegurar la independencia de la Nueva Granada. Simón Bolívar logró una victoria definitiva que marcó el fin de la dominación española.",
        source: "Historia de Colombia - Siglo XIX",
        type: "excerpt"
      }
    },
    {
      type: "text",
      content: "Observa la línea de tiempo del proceso independentista:"
    },
    {
      type: "timeline",
      content: {
        orientation: "vertical",
        events: [
          { year: "1810", event: "Grito de Independencia" },
          { year: "1813", event: "Declaración de Independencia" },
          { year: "1819", event: "Batalla de Boyacá" }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuál fue la importancia de la Batalla de Boyacá?"
    }
  ],
  options: [
    { letter: "A", text: "Fue la primera batalla de independencia" },
    { letter: "B", text: "Aseguró definitivamente la independencia del territorio" },
    { letter: "C", text: "Fue un enfrentamiento perdido por Bolívar" },
    { letter: "D", text: "Marcó el inicio de la invasión española" }
  ],
  correctAnswer: "B",
  explanation: "La Batalla de Boyacá fue decisiva para asegurar la independencia, terminando con la dominación española en Nueva Granada."
}
```

---

##  Plantilla para Nueva Pregunta

Copia esta plantilla cuando crees una nueva pregunta:

```javascript
{
  id: "area-XXX",           // Cambiar según el área (math, lang, sci, soc)
  area: "mathematics",       // Cambiar según corresponda
  difficulty: "medium",      // easy, medium, hard
  contentBlocks: [
    {
      type: "text",
      content: "Texto de introducción"
    },
    // Agregar más bloques según necesites
  ],
  options: [
    { letter: "A", text: "Opción A" },
    { letter: "B", text: "Opción B" },
    { letter: "C", text: "Opción C" },
    { letter: "D", text: "Opción D" }
  ],
  correctAnswer: "A",
  explanation: "Explicación de por qué esta es la respuesta correcta..."
}
```

---

##  Mejores Prácticas para Imágenes

### Tamaño y Formato
- **Formato recomendado:** PNG, JPG, WebP
- **Tamaño máximo:** 500 KB
- **Resolución:** Mínimo 300px de ancho, máximo 1000px
- **Compresión:** Usar herramientas como TinyPNG o ImageOptim

### Nombres de Archivos
```
geometry-triangle-001.png          Descriptivo
right-angle-diagram.png            Claro
circuit-series-resistors.png       Específico

img1.png                           No descriptivo
photo.png                          Vago
abc.png                            Innecesario
```

### Estructura en Carpetas
```
public/images/
 mathematics/
    algebra/
       equation-linear-001.png
       quadratic-formula.png
    geometry/
       triangle-right-001.png
       circle-area.png
    statistics/
        bar-chart-example.png
        histogram-distribution.png
```

---

##  Checklist Antes de Guardar una Pregunta

- [ ] ID único y descriptivo
- [ ] Área correcta asignada
- [ ] Dificultad apropiada
- [ ] ContentBlocks bien estructurados
- [ ] 4 opciones de respuesta (A, B, C, D)
- [ ] Respuesta correcta coincide con las opciones
- [ ] Explicación clara y educativa
- [ ] Imágenes optimizadas (si aplica)
- [ ] Fórmulas LaTeX validadas (si aplica)
- [ ] Tablas con datos precisos
- [ ] Sin errores ortográficos
- [ ] Probado en el navegador

---

##  Ubicaciones de Archivos Clave

 Archivo  Ubicación  Propósito 
------------------------------
 Estructura de datos  `src/core/data/questions.js`  Definir preguntas 
 Componentes  `src/shared/components/organisms/QuestionContent/`  Renderizar contenido 
 Imágenes  `public/images/`  Almacenar archivos de imagen 
 Ejemplos  `EJEMPLOS_PREGUNTAS_AVANZADAS.js`  Referencia de uso 
 Guía  `GUIA_CONTENIDO_PREGUNTAS.md`  Documentación 

---

##  Cómo Agregar una Nueva Pregunta

### Paso 1: Crea la pregunta
```javascript
// En EJEMPLOS_PREGUNTAS_AVANZADAS.js o tu archivo local
const MY_NEW_QUESTION = { ... };
```

### Paso 2: Prueba en el navegador
Abre PracticePage y selecciona el área correspondiente

### Paso 3: Agrega a questions.js
```javascript
// En src/core/data/questions.js
export const MATHEMATICS_QUESTIONS = [
  ...existingQuestions,
  MY_NEW_QUESTION
];
```

### Paso 4: Verifica
- [ ] Pregunta se muestra correctamente
- [ ] Opciones se seleccionan
- [ ] Respuesta se valida
- [ ] Explicación se muestra

---

**Última actualización:** 11 de diciembre de 2025
**Versión:** 1.0
