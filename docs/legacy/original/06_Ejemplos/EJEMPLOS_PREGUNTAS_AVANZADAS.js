/**
 * EJEMPLOS DE PREGUNTAS CON CONTENIDO AVANZADO
 * 
 * Este archivo contiene ejemplos de cómo estructurar preguntas con:
 * - Imágenes
 * - Tablas
 * - Fórmulas matemáticas
 * - Líneas de tiempo
 * - Citas y fragmentos
 * - Código
 * - Mapas
 * - Gráficas
 * 
 * Para usar estos ejemplos, cópielos a src/core/data/questions.js
 */

// ============================================================================
// PREGUNTA 1: MATEMÁTICAS CON IMAGEN Y FÓRMULA
// ============================================================================

export const MATH_EXAMPLE_01 = {
  id: "math-geo-001",
  area: "mathematics",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "Observa el siguiente triángulo rectángulo:"
    },
    {
      type: "image",
      content: {
        src: "/images/mathematics/geometry/right-triangle.png",
        alt: "Triángulo rectángulo con lados 3, 4, e hipotenusa",
        caption: "Figura 1: Triángulo rectángulo con catetos de 3 y 4 unidades"
      }
    },
    {
      type: "text",
      content: "Utilizando el Teorema de Pitágoras:"
    },
    {
      type: "formula",
      content: {
        formula: "c^2 = a^2 + b^2",
        description: "Teorema de Pitágoras"
      }
    },
    {
      type: "text",
      content: "¿Cuál es la longitud de la hipotenusa?"
    }
  ],
  options: [
    { letter: "A", text: "5 unidades" },
    { letter: "B", text: "7 unidades" },
    { letter: "C", text: "6 unidades" },
    { letter: "D", text: "4 unidades" }
  ],
  correctAnswer: "A",
  explanation: "Aplicando el teorema: c² = 3² + 4² = 9 + 16 = 25, por lo tanto c = 5"
};

// ============================================================================
// PREGUNTA 2: CIENCIAS CON TABLA Y ANÁLISIS
// ============================================================================

export const SCIENCE_EXAMPLE_01 = {
  id: "science-bio-001",
  area: "science",
  difficulty: "hard",
  contentBlocks: [
    {
      type: "text",
      content: "Los siguientes datos muestran el crecimiento poblacional de bacterias en un medio de cultivo:"
    },
    {
      type: "table",
      content: {
        headers: ["Tiempo (horas)", "Población (miles)", "pH del medio"],
        rows: [
          ["0", "1", "7.0"],
          ["2", "4", "6.8"],
          ["4", "16", "6.5"],
          ["6", "64", "6.2"],
          ["8", "256", "5.9"]
        ],
        caption: "Tabla 1: Crecimiento exponencial de bacterias E. coli"
      }
    },
    {
      type: "text",
      content: "Con base en los datos, ¿cuál es el patrón de crecimiento de la población?"
    }
  ],
  options: [
    { letter: "A", text: "Crecimiento lineal constante" },
    { letter: "B", text: "Crecimiento exponencial (se cuadruplica cada 2 horas)" },
    { letter: "C", text: "Crecimiento logarítmico" },
    { letter: "D", text: "Crecimiento caótico sin patrón" }
  ],
  correctAnswer: "B",
  explanation: "La población se multiplica por 4 cada 2 horas: 1→4→16→64→256. Este es un crecimiento exponencial característico de bacterias en fase de crecimiento exponencial."
};

// ============================================================================
// PREGUNTA 3: LENGUAJE CON CITA Y ANÁLISIS
// ============================================================================

export const LANGUAGE_EXAMPLE_01 = {
  id: "lang-lit-001",
  area: "lenguaje",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "Lee el siguiente fragmento literario:"
    },
    {
      type: "quote",
      content: {
        text: "Cien años de soledad no es solamente una novela de una familia, sino la historia de un pueblo. Macondo se ve reflejado no solamente como un lugar de ficción, sino como la representación de la América Latina en general.",
        source: "Análisis de 'Cien años de soledad' de Gabriel García Márquez",
        type: "excerpt"
      }
    },
    {
      type: "text",
      content: "Según el fragmento, ¿cuál es la importancia de Macondo en la obra literaria?"
    }
  ],
  options: [
    { letter: "A", text: "Es solo un escenario imaginario sin importancia" },
    { letter: "B", text: "Representa la realidad latinoamericana a través de la ficción" },
    { letter: "C", text: "Es una crítica directa a la política colombiana" },
    { letter: "D", text: "Fue un pueblo real que desapareció" }
  ],
  correctAnswer: "B",
  explanation: "El fragmento explícitamente afirma que Macondo no es solo ficción sino 'la representación de la América Latina en general'."
};

// ============================================================================
// PREGUNTA 4: SOCIALES CON LÍNEA DE TIEMPO
// ============================================================================

export const SOCIAL_EXAMPLE_01 = {
  id: "social-hist-001",
  area: "social",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "Observa la siguiente línea de tiempo sobre la Independencia de Colombia:"
    },
    {
      type: "timeline",
      content: {
        title: "Proceso de Independencia de Colombia",
        orientation: "vertical",
        events: [
          { year: "1810", event: "Grito de Independencia (20 de julio)" },
          { year: "1813", event: "Declaración de Independencia absoluta" },
          { year: "1819", event: "Batalla de Boyacá - Independencia asegurada" },
          { year: "1821", event: "Congreso de Cúcuta y Constitución" }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuántos años transcurrieron entre el Grito de Independencia y la Batalla de Boyacá?"
    }
  ],
  options: [
    { letter: "A", text: "6 años" },
    { letter: "B", text: "9 años" },
    { letter: "C", text: "11 años" },
    { letter: "D", text: "8 años" }
  ],
  correctAnswer: "B",
  explanation: "De 1810 a 1819 hay 9 años. Este fue el período de la Guerra de Independencia que culminó con la victoria en Boyacá."
};

// ============================================================================
// PREGUNTA 5: MATEMÁTICAS CON GRÁFICA
// ============================================================================

export const MATH_EXAMPLE_02 = {
  id: "math-stat-001",
  area: "mathematics",
  difficulty: "medium",
  contentBlocks: [
    {
      type: "text",
      content: "El siguiente gráfico muestra las ventas de una tienda durante los primeros 5 meses del año:"
    },
    {
      type: "chart",
      content: {
        type: "bar",
        title: "Ventas mensuales (en millones de pesos)",
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
        datasets: [
          {
            label: "Ventas",
            data: [5, 8, 12, 10, 15]
          }
        ],
        description: "Datos de ventas del primer semestre"
      }
    },
    {
      type: "text",
      content: "¿Cuál es el promedio de ventas en estos 5 meses?"
    }
  ],
  options: [
    { letter: "A", text: "10 millones" },
    { letter: "B", text: "12 millones" },
    { letter: "C", text: "8 millones" },
    { letter: "D", text: "15 millones" }
  ],
  correctAnswer: "A",
  explanation: "Promedio = (5+8+12+10+15)/5 = 50/5 = 10 millones de pesos"
};

// ============================================================================
// PREGUNTA 6: LENGUAJE CON CÓDIGO (LÓGICA)
// ============================================================================

export const LOGIC_EXAMPLE_01 = {
  id: "logic-prog-001",
  area: "lenguaje",
  difficulty: "hard",
  contentBlocks: [
    {
      type: "text",
      content: "Analiza el siguiente pseudocódigo que calcula el factorial de un número:"
    },
    {
      type: "code",
      content: {
        language: "pseudocode",
        code: `FUNCIÓN factorial(n)
  SI n = 0 O n = 1
    RETORNA 1
  SINO
    RETORNA n * factorial(n - 1)
FIN`,
        title: "Algoritmo de Factorial Recursivo"
      }
    },
    {
      type: "text",
      content: "¿Cuál es el resultado de factorial(5)?"
    }
  ],
  options: [
    { letter: "A", text: "24" },
    { letter: "B", text: "120" },
    { letter: "C", text: "100" },
    { letter: "D", text: "130" }
  ],
  correctAnswer: "B",
  explanation: "factorial(5) = 5 × 4 × 3 × 2 × 1 = 120"
};

// ============================================================================
// PREGUNTA 7: SOCIALES CON MAPA
// ============================================================================

export const SOCIAL_EXAMPLE_02 = {
  id: "social-geo-001",
  area: "social",
  difficulty: "easy",
  contentBlocks: [
    {
      type: "text",
      content: "Observa el siguiente mapa político de Colombia:"
    },
    {
      type: "map",
      content: {
        title: "Regiones naturales de Colombia",
        imageSrc: "/images/social/colombia-regions.png",
        regions: [
          { name: "Andina", highlight: true, info: "Mayor población" },
          { name: "Caribe", highlight: false, info: "Costera" },
          { name: "Pacífica", highlight: false, info: "Muy lluviosa" },
          { name: "Amazonia", highlight: true, info: "Bosque tropical" },
          { name: "Orinoquía", highlight: false, info: "Llanuras" }
        ]
      }
    },
    {
      type: "text",
      content: "¿Cuál es la región con mayor concentración de población en Colombia?"
    }
  ],
  options: [
    { letter: "A", text: "La Región Amazónica" },
    { letter: "B", text: "La Región Caribeña" },
    { letter: "C", text: "La Región Andina" },
    { letter: "D", text: "La Región Pacífica" }
  ],
  correctAnswer: "C",
  explanation: "La Región Andina es donde se encuentran las principales ciudades y montañas, concentrando el 70% de la población colombiana."
};

// ============================================================================
// PREGUNTA 8: CIENCIAS CON MÚLTIPLES ELEMENTOS
// ============================================================================

export const SCIENCE_EXAMPLE_02 = {
  id: "science-phys-001",
  area: "science",
  difficulty: "hard",
  contentBlocks: [
    {
      type: "text",
      content: "La energía cinética de un objeto en movimiento se calcula con:"
    },
    {
      type: "formula",
      content: {
        formula: "E_c = \\frac{1}{2}mv^2",
        description: "Fórmula de energía cinética"
      }
    },
    {
      type: "text",
      content: "Si un automóvil de 1000 kg se mueve a 20 m/s, ¿cuál es su energía cinética?"
    },
    {
      type: "table",
      content: {
        headers: ["Velocidad (m/s)", "Energía Cinética (J)"],
        rows: [
          ["10", "50,000"],
          ["15", "112,500"],
          ["20", "200,000"],
          ["25", "312,500"]
        ],
        caption: "Tabla de energía cinética para diferentes velocidades"
      }
    },
    {
      type: "text",
      content: "Con base en la tabla y la fórmula, ¿cuál es el valor que falta?"
    }
  ],
  options: [
    { letter: "A", text: "100,000 J" },
    { letter: "B", text: "200,000 J" },
    { letter: "C", text: "300,000 J" },
    { letter: "D", text: "150,000 J" }
  ],
  correctAnswer: "B",
  explanation: "Ec = ½ × 1000 × 20² = ½ × 1000 × 400 = 200,000 J"
};

// ============================================================================
// Exportar todos los ejemplos
// ============================================================================

export const ICFES_EXAMPLES = {
  mathematics: [MATH_EXAMPLE_01, MATH_EXAMPLE_02],
  science: [SCIENCE_EXAMPLE_01, SCIENCE_EXAMPLE_02],
  language: [LANGUAGE_EXAMPLE_01, LOGIC_EXAMPLE_01],
  social: [SOCIAL_EXAMPLE_01, SOCIAL_EXAMPLE_02]
};
