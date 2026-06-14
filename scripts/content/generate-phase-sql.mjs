#!/usr/bin/env node
/**
 * Genera catálogos JSON y SQL INSERT para learning_content fases 2 y 3.
 * Uso: node scripts/content/generate-phase-sql.mjs [--phase=2|3|all]
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildAllPhaseCatalogs } from './phase-lesson-catalog.mjs';

const OUT = path.join(import.meta.dirname, 'output');

function sqlEscape(value) {
  return String(value).replace(/'/g, "''");
}

function lessonToInsert(lesson) {
  const contentJson = JSON.stringify(lesson.content).replace(/'/g, "''");
  return `INSERT INTO learning_content (id, area, phase, order_index, published, content)
VALUES ('${sqlEscape(lesson.id)}', '${sqlEscape(lesson.area)}', ${lesson.phase}, ${lesson.order_index}, ${lesson.published}, '${contentJson}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  area = EXCLUDED.area,
  phase = EXCLUDED.phase,
  order_index = EXCLUDED.order_index,
  published = EXCLUDED.published,
  content = EXCLUDED.content;`;
}

function examToInsert(item, orderOffset = 0) {
  const optionsJson = JSON.stringify(item.options).replace(/'/g, "''");
  return `INSERT INTO exam_questions (id, area, text, options, correct_answer, explanation, difficulty, published, order_index, phase)
VALUES ('${sqlEscape(item.id)}', '${sqlEscape(item.area)}', '${sqlEscape(item.text)}', '${optionsJson}'::jsonb, '${sqlEscape(item.correct_answer)}', '${sqlEscape(item.explanation ?? '')}', '${sqlEscape(item.difficulty)}', true, ${item.order_index + orderOffset}, ${item.phase ?? 2})
ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation,
  difficulty = EXCLUDED.difficulty,
  phase = EXCLUDED.phase,
  published = EXCLUDED.published,
  order_index = EXCLUDED.order_index;`;
}

function writePhase(phase) {
  const catalog = buildAllPhaseCatalogs(phase);
  fs.mkdirSync(OUT, { recursive: true });

  for (const [areaSlug, lessons] of Object.entries(catalog)) {
    const jsonPath = path.join(OUT, `phase${phase}-${areaSlug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(lessons, null, 2));

    const sqlStatements = lessons.map(lessonToInsert);
    const chunkSize = 10;
    for (let i = 0; i < sqlStatements.length; i += chunkSize) {
      const chunk = sqlStatements.slice(i, i + chunkSize).join('\n');
      const batch = Math.floor(i / chunkSize) + 1;
      fs.writeFileSync(path.join(OUT, `phase${phase}-${areaSlug}-batch${batch}.sql`), `BEGIN;\n${chunk}\nCOMMIT;\n`);
    }
  }

  const allLessons = Object.values(catalog).flat();
  fs.writeFileSync(path.join(OUT, `phase${phase}-catalog-summary.json`), JSON.stringify({
    phase,
    total: allLessons.length,
    byArea: Object.fromEntries(Object.entries(catalog).map(([k, v]) => [k, v.length])),
  }, null, 2));

  console.log(`Phase ${phase}: ${allLessons.length} lessons written to ${OUT}`);
}

function writeExamQuestionsFromPeriodicas() {
  const periodicasPath = path.join(OUT, 'periodicas-exam-questions.json');
  if (!fs.existsSync(periodicasPath)) return;

  const data = JSON.parse(fs.readFileSync(periodicasPath, 'utf8'));
  const all = [...(data.ciencias_naturales ?? []), ...(data.lectura_critica ?? [])];
  const sql = all.map((item) => examToInsert(item)).join('\n');
  fs.writeFileSync(path.join(OUT, 'exam-questions-periodicas.sql'), `BEGIN;\n${sql}\nCOMMIT;\n`);
  console.log(`Exam questions from periodicas: ${all.length}`);
}

function generateSyntheticExamQuestions(phase) {
  const areas = ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales', 'ingles'];
  const difficulty = phase === 2 ? 'intermedio' : 'avanzado';
  const statements = [];

  for (const area of areas) {
    const count = phase === 2 ? 25 : 25;
    for (let i = 1; i <= count; i += 1) {
      const item = {
        id: `syn-p${phase}-${area}-${String(i).padStart(2, '0')}`,
        area,
        text: `**Contexto ${i}:** Analiza la situación y elige la mejor respuesta (${difficulty}).`,
        options: [
          { id: 'a', text: 'Respuesta sin evidencia', letter: 'A' },
          { id: 'b', text: 'Respuesta coherente con el contexto', letter: 'B' },
          { id: 'c', text: 'Respuesta parcial', letter: 'C' },
          { id: 'd', text: 'Respuesta contradictoria', letter: 'D' },
        ],
        correct_answer: 'b',
        explanation: 'Integra la información del contexto antes de concluir.',
        difficulty,
        phase,
        order_index: 100 + i,
      };
      statements.push(examToInsert(item));
    }
  }

  fs.writeFileSync(path.join(OUT, `exam-questions-phase${phase}-synthetic.sql`), `BEGIN;\n${statements.join('\n')}\nCOMMIT;\n`);
  console.log(`Synthetic exam questions phase ${phase}: ${statements.length}`);
}

const arg = process.argv.find((a) => a.startsWith('--phase='));
const phaseArg = arg?.split('=')[1] ?? 'all';

if (phaseArg === 'all' || phaseArg === '2') writePhase(2);
if (phaseArg === 'all' || phaseArg === '3') writePhase(3);
if (phaseArg === 'all' || phaseArg === 'exam') {
  writeExamQuestionsFromPeriodicas();
  generateSyntheticExamQuestions(2);
  generateSyntheticExamQuestions(3);
}

if (phaseArg === 'all') {
  writeExamQuestionsFromPeriodicas();
  generateSyntheticExamQuestions(2);
  generateSyntheticExamQuestions(3);
}
