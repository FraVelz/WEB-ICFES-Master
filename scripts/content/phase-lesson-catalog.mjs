/**
 * Catálogo de bloques y plantillas para fases 2 y 3.
 * Volumen acordado: fase 2 = 70, fase 3 = 50 por área.
 */

export const DB_AREAS = {
  'lectura-critica': 'lectura_critica',
  matematicas: 'matematicas',
  'ciencias-naturales': 'ciencias_naturales',
  'sociales-ciudadanas': 'sociales',
  ingles: 'ingles',
};

export const PHASE2_BLOCKS = {
  'lectura-critica': [
    { blockId: 'estructura-global', title: 'Estructura global', from: 1, to: 25 },
    { blockId: 'textos-discontinuos', title: 'Textos discontinuos', from: 26, to: 50 },
    { blockId: 'inferencia-avanzada', title: 'Inferencia avanzada', from: 51, to: 70 },
  ],
  matematicas: [
    { blockId: 'formulacion-ejecucion', title: 'Formulación y ejecución', from: 1, to: 25 },
    { blockId: 'estadistica-contexto', title: 'Estadística en contexto', from: 26, to: 45 },
    { blockId: 'proporcionalidad-compleja', title: 'Proporcionalidad compleja', from: 46, to: 60 },
    { blockId: 'geometria-aplicada', title: 'Geometría aplicada', from: 61, to: 70 },
  ],
  'ciencias-naturales': [
    { blockId: 'explicacion-fenomenos', title: 'Explicación de fenómenos', from: 1, to: 25 },
    { blockId: 'cts', title: 'Ciencia, tecnología y sociedad', from: 26, to: 50 },
    { blockId: 'modelos-causa-efecto', title: 'Modelos causa-efecto', from: 51, to: 70 },
  ],
  'sociales-ciudadanas': [
    { blockId: 'perspectivas', title: 'Análisis de perspectivas', from: 1, to: 25 },
    { blockId: 'pensamiento-social', title: 'Pensamiento social', from: 26, to: 50 },
    { blockId: 'constitucion-aplicada', title: 'Constitución aplicada', from: 51, to: 70 },
  ],
  ingles: [
    { blockId: 'reading-inferential', title: 'Reading inferential', from: 1, to: 25 },
    { blockId: 'grammar-context', title: 'Grammar in context', from: 26, to: 50 },
    { blockId: 'vocabulary-context', title: 'Vocabulary in context', from: 51, to: 70 },
  ],
};

export const PHASE3_BLOCKS = {
  'lectura-critica': [
    { blockId: 'nivel-critico', title: 'Nivel crítico', from: 1, to: 20 },
    { blockId: 'intencion-autor', title: 'Intención del autor', from: 21, to: 35 },
    { blockId: 'multifuente', title: 'Multifuente', from: 36, to: 50 },
  ],
  matematicas: [
    { blockId: 'argumentacion', title: 'Argumentación matemática', from: 1, to: 20 },
    { blockId: 'razonamiento-abstracto', title: 'Razonamiento abstracto', from: 21, to: 35 },
    { blockId: 'no-generico', title: 'Contenido no genérico', from: 36, to: 50 },
  ],
  'ciencias-naturales': [
    { blockId: 'indagacion', title: 'Indagación', from: 1, to: 20 },
    { blockId: 'analisis-datos', title: 'Análisis de datos', from: 21, to: 35 },
    { blockId: 'prediccion-teorica', title: 'Predicción teórica', from: 36, to: 50 },
  ],
  'sociales-ciudadanas': [
    { blockId: 'pensamiento-sistemico', title: 'Pensamiento sistémico', from: 1, to: 20 },
    { blockId: 'normas-conflictos', title: 'Normas y conflictos', from: 21, to: 35 },
    { blockId: 'multiperspectiva', title: 'Multiperspectiva compleja', from: 36, to: 50 },
  ],
  ingles: [
    { blockId: 'reading-b1', title: 'Reading B1', from: 1, to: 20 },
    { blockId: 'grammar-complex', title: 'Grammar complex', from: 21, to: 35 },
    { blockId: 'text-factual', title: 'Factual texts', from: 36, to: 50 },
  ],
};

const PHASE2_FOCUS = {
  'lectura-critica': 'Comprensión global e integración de partes del texto (ND 2–3).',
  matematicas: 'Formular y ejecutar planes en contextos reales (ND 2–3).',
  'ciencias-naturales': 'Explicar fenómenos relacionando variables (ND 2–3).',
  'sociales-ciudadanas': 'Analizar perspectivas e intereses en conflictos (ND 2–3).',
  ingles: 'Inferencia explícita en textos cortos (A2).',
};

const PHASE3_FOCUS = {
  'lectura-critica': 'Evaluar argumentos, prejuicios e intención del autor (ND 3–4).',
  matematicas: 'Validar o refutar conclusiones con ejemplos y contraejemplos (ND 3–4).',
  'ciencias-naturales': 'Indagación: diseño experimental y análisis de datos (ND 3–4).',
  'sociales-ciudadanas': 'Pensamiento sistémico en problemas sociales (ND 3–4).',
  ingles: 'Lectura B1 de textos fácticos diversos.',
};

function blockForOrder(blocks, order) {
  return blocks.find((b) => order >= b.from && order <= b.to) ?? blocks[blocks.length - 1];
}

function lessonTitle(areaSlug, block, order, phase) {
  return `${block.title} — práctica ${order}`;
}

function buildBody(areaSlug, block, order, phase) {
  const focus = phase === 2 ? PHASE2_FOCUS[areaSlug] : PHASE3_FOCUS[areaSlug];
  const nd = phase === 2 ? '2–3' : '3–4';

  let body = `# ${lessonTitle(areaSlug, block, order, phase)}\n\n`;
  body += `## Marco ICFES (ND ${nd})\n\n${focus}\n\n`;
  body += `## Contexto\n\n`;
  body += `Situación ${order}: analiza la información y relaciona al menos **dos fuentes** antes de responder el quiz.\n\n`;

  if (areaSlug === 'matematicas' && (block.blockId.includes('estadistica') || block.blockId.includes('formulacion'))) {
    body += `| Mes | Gasto (miles COP) |\n| --- | --- |\n`;
    body += `| Ene | ${400 + order * 3} |\n| Feb | ${420 + order * 2} |\n| Mar | ${410 + order} |\n\n`;
    body += `{{visual:0}}\n\n`;
  }

  if (areaSlug === 'ciencias-naturales' && block.blockId.includes('analisis')) {
    body += `Observa la tendencia del experimento:\n\n{{visual:0}}\n\n`;
  }

  body += `## Estrategia\n\n`;
  body += phase === 2
    ? `1. Identifica datos explícitos.\n2. Relaciona causa y efecto.\n3. Elige la opción con mejor evidencia.\n`
    : `1. Evalúa la validez de la conclusión.\n2. Busca contraejemplos.\n3. Justifica con evidencia del contexto.\n`;

  return body;
}

function buildVisuals(areaSlug, block, order, phase) {
  if (areaSlug === 'matematicas' && (block.blockId.includes('estadistica') || block.blockId.includes('formulacion'))) {
    return [
      {
        type: 'chart',
        chartType: order % 2 === 0 ? 'line' : 'bar',
        title: 'Gasto mensual observado',
        labels: ['Ene', 'Feb', 'Mar'],
        series: [{ name: 'Miles COP', values: [400 + order * 3, 420 + order * 2, 410 + order] }],
      },
    ];
  }
  if (areaSlug === 'ciencias-naturales' && (block.blockId.includes('analisis') || block.blockId.includes('modelos'))) {
    return [
      {
        type: 'chart',
        chartType: 'line',
        title: 'Variable medida en el tiempo',
        labels: ['0 min', '10 min', '20 min', '30 min'],
        series: [{ name: 'Valor', values: [10, 18, 26, 30 + (order % 5)] }],
      },
    ];
  }
  return [];
}

function buildQuestions(areaSlug, block, order, phase) {
  const diff = phase === 2 ? 'media' : 'alta';
  return [
    {
      id: `q_${phase}_${areaSlug}_${order}_1`,
      type: 'opcion_multiple',
      question: `Según el contexto, ¿qué conclusión está mejor sustentada?`,
      options: ['Conclusión sin evidencia', 'Conclusión coherente con el contexto', 'Conclusión contradictoria', 'Conclusión irrelevante'],
      correct_answer: 1,
      difficulty: diff,
      explanation: 'La opción correcta integra la información del contexto.',
    },
    {
      id: `q_${phase}_${areaSlug}_${order}_2`,
      type: 'opcion_multiple',
      question: phase === 2 ? '¿Qué relación causa-efecto es más plausible?' : '¿Qué contraejemplo debilita la conclusión?',
      options: ['Opción A', 'Opción B (correcta)', 'Opción C', 'Opción D'],
      correct_answer: 1,
      difficulty: diff,
      explanation: 'Revisa el contexto antes de inferir.',
    },
    {
      id: `q_${phase}_${areaSlug}_${order}_3`,
      type: 'opcion_multiple',
      question: '¿Cuál evidencia respalda mejor la respuesta?',
      options: ['Dato aislado sin contexto', 'Dato integrado con otra fuente', 'Opinión personal', 'Dato fuera del texto'],
      correct_answer: 1,
      difficulty: diff,
      explanation: 'El ICFES premia el uso de evidencia en contexto.',
    },
  ];
}

function buildLesson(areaSlug, order, phase) {
  const blocks = phase === 2 ? PHASE2_BLOCKS[areaSlug] : PHASE3_BLOCKS[areaSlug];
  const block = blockForOrder(blocks, order);
  const visuals = buildVisuals(areaSlug, block, order, phase);
  const title = lessonTitle(areaSlug, block, order, phase);

  return {
    id: `p${phase}-${areaSlug}-${String(order).padStart(3, '0')}`,
    area: DB_AREAS[areaSlug],
    areaSlug,
    phase,
    order_index: order,
    published: true,
    content: {
      title,
      summary: `${block.title} — fase ${phase}`,
      block: block.blockId,
      type: 'lesson',
      performance_level: phase === 2 ? 2 : 3,
      competency: phase === 2 ? PHASE2_FOCUS[areaSlug] : PHASE3_FOCUS[areaSlug],
      content: buildBody(areaSlug, block, order, phase),
      visuals,
      questions: buildQuestions(areaSlug, block, order, phase),
      xp: phase === 2 ? 600 : 800,
      coins: phase === 2 ? 300 : 400,
    },
  };
}

export function buildPhaseCatalog(areaSlug, phase) {
  const count = phase === 2 ? 70 : 50;
  const lessons = [];
  for (let order = 1; order <= count; order += 1) {
    lessons.push(buildLesson(areaSlug, order, phase));
  }
  return lessons;
}

export function buildAllPhaseCatalogs(phase) {
  const out = {};
  for (const areaSlug of Object.keys(DB_AREAS)) {
    out[areaSlug] = buildPhaseCatalog(areaSlug, phase);
  }
  return out;
}
