#  Sistema de Contenido Avanzado para Pruebas ICFES

**Fecha:** 11 de diciembre de 2025  
**Versión:** 1.0  
**Estado:** Completado 

---

##  Resumen

Se ha creado un sistema completo y documentado para soportar **contenido avanzado en preguntas ICFES**, incluyendo:

 **10 Componentes React reutilizables**  
 **2 Guías detalladas con ejemplos**  
 **8 Preguntas de ejemplo completas**  
 **Estructura de datos flexible**  
 **Documentación exhaustiva**

---

##  Archivos Creados

### 1. Componentes (en `/src/shared/components/organisms/QuestionContent/`)

 Componente  Descripción  Archivo 
-------------------------------
 **TextContent**  Texto simple  `TextContent.jsx` 
 **ImageContent**  Imágenes con caption  `ImageContent.jsx` 
 **TableContent**  Tablas con estilos  `TableContent.jsx` 
 **FormulaContent**  Fórmulas LaTeX  `FormulaContent.jsx` 
 **ChartContent**  Gráficas (barras, líneas, pie)  `ChartContent.jsx` 
 **TimelineContent**  Líneas de tiempo  `TimelineContent.jsx` 
 **CodeContent**  Código/pseudocódigo  `CodeContent.jsx` 
 **MapContent**  Mapas y diagramas geográficos  `MapContent.jsx` 
 **QuoteContent**  Citas y fragmentos  `QuoteContent.jsx` 
 **CompositeContent**  Combina múltiples tipos  `CompositeContent.jsx` 
 **index.js**  Exporta todos  `index.js` 

---

### 2. Documentación (en raíz del proyecto)

 Documento  Contenido  Líneas 
-----------------------------
 **GUIA_CONTENIDO_PREGUNTAS.md**  Guía completa con ejemplos de cada componente  600+ 
 **ESTRUCTURA_DATOS_PREGUNTAS.md**  Estructura detallada de datos y plantillas  500+ 
 **EJEMPLOS_PREGUNTAS_AVANZADAS.js**  8 ejemplos de preguntas reales  400+ 

---

##  Cómo Usar

### Opción 1: Pregunta Simple (Solo Texto)

```jsx
const question = {
  id: "math-001",
  contentBlocks: [
    { type: "text", content: "¿Cuál es el resultado de 2 + 2?" }
  ],
  options: [
    { letter: "A", text: "3" },
    { letter: "B", text: "4" },
    { letter: "C", text: "5" },
    { letter: "D", text: "6" }
  ],
  correctAnswer: "B",
  explanation: "2 + 2 = 4"
};
```

---

### Opción 2: Pregunta Compleja (Múltiples Elementos)

```jsx
const advancedQuestion = {
  id: "sci-001",
  area: "science",
  difficulty: "hard",
  contentBlocks: [
    { type: "text", content: "Observa el siguiente diagrama:" },
    { 
      type: "image", 
      content: { 
        src: "/images/science/circuit.png",
        alt: "Circuito eléctrico",
        caption: "Fig. 1: Circuito con resistencias en serie"
      } 
    },
    { type: "text", content: "La fórmula para resistencias en serie es:" },
    { 
      type: "formula", 
      content: { 
        formula: "R_{total} = R_1 + R_2 + R_3"
      } 
    },
    { 
      type: "table",
      content: {
        headers: ["Resistencia", "Valor (Ω)"],
        rows: [["R1", "10"], ["R2", "20"], ["R3", "30"]]
      }
    },
    { type: "text", content: "¿Cuál es la resistencia total?" }
  ],
  options: [
    { letter: "A", text: "30 Ω" },
    { letter: "B", text: "60 Ω" },
    { letter: "C", text: "6.67 Ω" },
    { letter: "D", text: "20 Ω" }
  ],
  correctAnswer: "B",
  explanation: "R_total = 10 + 20 + 30 = 60 Ω"
};
```

---

##  Tipos de Contenido Soportados

### 1⃣ Texto Simple
```javascript
{ type: "text", content: "Tu texto aquí" }
```

### 2⃣ Imágenes
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

### 3⃣ Tablas
```javascript
{
  type: "table",
  content: {
    headers: ["Col1", "Col2"],
    rows: [["a", "b"], ["c", "d"]],
    caption: "Título"
  }
}
```

### 4⃣ Fórmulas Matemáticas
```javascript
{
  type: "formula",
  content: {
    formula: "E = mc^2",
    description: "Fórmula de Einstein"
  }
}
```

### 5⃣ Gráficas
```javascript
{
  type: "chart",
  content: {
    type: "bar",
    labels: ["Q1", "Q2"],
    datasets: [{ label: "Ventas", data: [100, 150] }],
    title: "Ventas por trimestre"
  }
}
```

### 6⃣ Líneas de Tiempo
```javascript
{
  type: "timeline",
  content: {
    events: [
      { year: "1810", event: "Evento 1" },
      { year: "1819", event: "Evento 2" }
    ],
    title: "Historia"
  }
}
```

### 7⃣ Código
```javascript
{
  type: "code",
  content: {
    language: "python",
    code: "print('Hello World')",
    title: "Ejemplo"
  }
}
```

### 8⃣ Mapas
```javascript
{
  type: "map",
  content: {
    imageSrc: "/images/map.png",
    regions: [
      { name: "Región 1", highlight: true }
    ],
    title: "Mapa político"
  }
}
```

### 9⃣ Citas
```javascript
{
  type: "quote",
  content: {
    text: "La cita aquí",
    author: "Nombre",
    type: "quote"
  }
}
```

###  Múltiples Elementos
```javascript
const blocks = [
  { type: "text", content: "..." },
  { type: "image", content: { ... } },
  { type: "table", content: { ... } },
  { type: "formula", content: { ... } }
];

<CompositeContent blocks={blocks} />
```

---

##  Documentación Disponible

### Para Principiantes
 Comienza con **`GUIA_CONTENIDO_PREGUNTAS.md`**
- Explicación de cada componente
- Ejemplos paso a paso
- Casos de uso comunes

### Para Desarrolladores
 Consulta **`ESTRUCTURA_DATOS_PREGUNTAS.md`**
- Estructura técnica completa
- Plantillas para nuevas preguntas
- Mejores prácticas

### Para Referencia Rápida
 Mira **`EJEMPLOS_PREGUNTAS_AVANZADAS.js`**
- 8 preguntas completas y funcionales
- Todos los tipos de contenido
- Listo para copiar y adaptar

---

##  Dónde Agregar Nuevas Preguntas

### Opción 1: En el archivo de preguntas global
```
src/core/data/questions.js
```

Estructura:
```javascript
export const MATHEMATICS_QUESTIONS = [
  existingQuestion1,
  existingQuestion2,
  { id: "new-question", ... }  // Añade aquí
];
```

### Opción 2: En archivos separados por área (recomendado)
```
src/core/data/
 questions/
    mathematics.js
    science.js
    language.js
    social.js
```

---

##  Flujo de Trabajo Recomendado

### 1. Diseña la Pregunta
- Define qué elementos necesitas (imagen, tabla, fórmula, etc.)
- Prepara el contenido

### 2. Consulta la Documentación
- Si es pregunta simple → GUIA_CONTENIDO_PREGUNTAS.md sección 1
- Si es pregunta compleja → ESTRUCTURA_DATOS_PREGUNTAS.md
- Busca ejemplos similares en EJEMPLOS_PREGUNTAS_AVANZADAS.js

### 3. Prepara los Archivos
- Optimiza imágenes (si aplica)
- Valida fórmulas LaTeX
- Verifica datos de tablas

### 4. Crea la Estructura
- Copia la plantilla del documento
- Llena con tus datos
- Valida la estructura JSON

### 5. Prueba
```bash
npm run dev  # Inicia servidor local
# Abre http://localhost:5174
# Selecciona el área y verifica la pregunta
```

### 6. Optimiza
- Ajusta estilos si es necesario
- Perfecciona la explicación
- Verifica en diferentes tamaños de pantalla

### 7. Commit a Git
```bash
git add .
git commit -m "Agregar nueva pregunta: [titulo]"
git push
```

---

##  Instalaciones Opcionales Recomendadas

Para aprovechar al máximo todos los componentes:

```bash
# Para fórmulas matemáticas mejoradas
npm install katex react-katex

# Para gráficas interactivas avanzadas
npm install chart.js react-chartjs-2

# Para ícones adicionales
npm install @fortawesome/free-solid-svg-icons
```

---

##  Estadísticas del Sistema

 Métrica  Valor 
----------------
 Componentes creados  10 
 Archivos de documentación  3 
 Ejemplos de preguntas  8 
 Tipos de contenido  10 
 Líneas de código (componentes)  600+ 
 Líneas de documentación  1,100+ 
 Tiempo de implementación  Estimado 4-6 horas 

---

##  Características Destacadas

 **100% Reusable** - Componentes independientes y desacoplados  
 **Documentado** - Guías completas con ejemplos  
 **Flexible** - Soporta casi cualquier tipo de contenido ICFES  
 **Escalable** - Fácil de extender con nuevos tipos  
 **Estilizado** - Tailwind CSS integrado y consistente  
 **Accesible** - HTML semántico con alt text  
 **Responsive** - Se adapta a cualquier pantalla  
 **Performante** - Componentes optimizados  

---

##  Próximos Pasos Recomendados

1. **Agregar imágenes reales**
   - Fotografías de conceptos científicos
   - Diagramas matemáticos
   - Mapas geográficos
   - Gráficos estadísticos

2. **Crear banco de preguntas**
   - Mínimo 50 preguntas por área
   - Variedad de dificultades
   - Todos los temas de ICFES

3. **Implementar Analytics**
   - Rastrear qué preguntas son más difíciles
   - Medir tiempo promedio de respuesta
   - Analizar errores comunes

4. **Agregar validaciones**
   - Verificar estructura de preguntas
   - Validar fórmulas LaTeX
   - Comprobar rutas de imágenes

5. **Optimizar imágenes**
   - WebP para mejor compresión
   - Lazy loading
   - Caché en navegador

---

##  Contribuir Nuevas Preguntas

Si quieres agregar más preguntas al sistema:

1. Sigue la estructura en `ESTRUCTURA_DATOS_PREGUNTAS.md`
2. Incluye todos los elementos: texto, opciones, respuesta, explicación
3. Valida antes de enviar
4. Crea un PR con descripción clara

---

##  Soporte

- **Documentación:** Lee los `.md` en la raíz del proyecto
- **Ejemplos:** Consulta `EJEMPLOS_PREGUNTAS_AVANZADAS.js`
- **Componentes:** Revisa `src/shared/components/organisms/QuestionContent/`
- **Dudas:** Revisa la sección FAQ en `GUIA_CONTENIDO_PREGUNTAS.md`

---

##  Licencia

Este sistema es parte del proyecto "Pruebas ICFES" y está disponible bajo licencia MIT.

---

##  ¡Listo para Empezar!

Ya tienes todo lo necesario para crear preguntas ICFES complejas y profesionales.

**Comienza ahora:**
1. Lee `GUIA_CONTENIDO_PREGUNTAS.md` (10 min)
2. Consulta un ejemplo en `EJEMPLOS_PREGUNTAS_AVANZADAS.js` (5 min)
3. Crea tu primera pregunta (15 min)
4. Prueba en el navegador (5 min)

**Total: 35 minutos para tu primera pregunta profesional** 

---

**Creado con  para estudiantes que preparan el ICFES**

*Última actualización: 11 de diciembre de 2025*
