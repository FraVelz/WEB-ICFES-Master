#!/usr/bin/env node
/**
 * Parsea pruebas periódicas (lectura + ciencias) y normaliza ítems para exam_questions.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const PERIODICAS = path.join(ROOT, 'materiales-icfes/pruebas/periodicas');

function parseCienciasNaturales(text) {
  const items = [];
  const blocks = text.split(/^=(\d+)/m).filter(Boolean);

  for (let i = 0; i < blocks.length; i += 2) {
    const itemNum = blocks[i]?.trim();
    const body = blocks[i + 1]?.trim();
    if (!itemNum || !body) continue;

    const enunciadoMatch = body.match(/Enunciado\s*([\s\S]*?)(?=Respuesta correcta|$)/i);
    const contextoMatch = body.match(/Contexto\s*([\s\S]*?)(?=Enunciado|Respuesta correcta|$)/i);
    const answerMatch = body.match(/Respuesta correcta\s*([\s\S]*?)(?=Justificación|$)/i);
    const justification = body.split(/Justificación/i)[1] ?? '';

    const options = [];
    const optionMatches = justification.matchAll(/(?:^|\n)([A-E])\.\s*([^\n]+)/g);
    for (const match of optionMatches) {
      options.push({ id: match[1].toLowerCase(), text: match[2].trim(), letter: match[1] });
    }

    const correctLetter = justification.match(/RESPUESTA CORRECTA:\s*\n*\s*([A-E])\./i)?.[1]?.toLowerCase();
    const context = [contextoMatch?.[1]?.trim(), enunciadoMatch?.[1]?.trim()].filter(Boolean).join('\n\n');
    const answerText = answerMatch?.[1]?.trim();

    if (!context && !answerText) continue;

    items.push({
      id: `cn-periodica-${itemNum}`,
      area: 'ciencias_naturales',
      text: context || enunciadoMatch?.[1]?.trim() || '',
      options: options.length >= 4 ? options.slice(0, 4) : [
        { id: 'a', text: 'Opción A', letter: 'A' },
        { id: 'b', text: answerText || 'Opción B', letter: 'B' },
        { id: 'c', text: 'Opción C', letter: 'C' },
        { id: 'd', text: 'Opción D', letter: 'D' },
      ],
      correct_answer: correctLetter || 'b',
      explanation: justification.slice(0, 500),
      difficulty: Number(itemNum) >= 100 ? 'intermedio' : 'avanzado',
      phase: Number(itemNum) >= 100 ? 2 : 3,
      order_index: Number(itemNum),
    });
  }

  return items;
}

function parseLecturaCritica(text) {
  const items = [];
  const blocks = text.split(/\n---\n/).map((b) => b.trim()).filter(Boolean);
  const seen = new Set();

  for (const block of blocks) {
    const contextMatch = block.match(/^Contexto\s*([\s\S]*?)(?=Enunciado|$)/i);
    const enunciadoMatch = block.match(/Enunciado\s*([\s\S]*?)(?=Respuesta correcta|$)/i);
    const answerMatch = block.match(/Respuesta correcta\s*([\s\S]*?)(?=Justificación|$)/i);
    const justification = block.split(/Justificación/i)[1] ?? '';

    const context = contextMatch?.[1]?.trim() ?? '';
    const question = enunciadoMatch?.[1]?.trim() ?? '';
    const answerText = answerMatch?.[1]?.trim() ?? '';
    if (!question) continue;

    const key = `${question.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const options = [];
    const optionMatches = justification.matchAll(/•\s*Opción ([A-D])\.\s*([^\n•]+)/g);
    for (const match of optionMatches) {
      options.push({ id: match[1].toLowerCase(), text: match[2].trim(), letter: match[1] });
    }

    const correctLetter =
      justification.match(/opción correcta es la ([A-D])/i)?.[1]?.toLowerCase() ||
      (answerText && options.find((o) => o.text === answerText)?.id) ||
      'c';

    const isCritical = /reflexionar|evaluar|validez|crític/i.test(justification + question);
    const difficulty = isCritical ? 'avanzado' : 'intermedio';
    const phase = isCritical ? 3 : 2;

    items.push({
      id: `lc-periodica-${items.length + 1}`,
      area: 'lectura_critica',
      text: `${context}\n\n**Pregunta:** ${question}`,
      options: options.length >= 4 ? options.slice(0, 4) : [
        { id: 'a', text: 'Opción A', letter: 'A' },
        { id: 'b', text: 'Opción B', letter: 'B' },
        { id: 'c', text: answerText || 'Opción C', letter: 'C' },
        { id: 'd', text: 'Opción D', letter: 'D' },
      ],
      correct_answer: correctLetter,
      explanation: justification.slice(0, 600),
      difficulty,
      phase,
      order_index: items.length + 1,
    });
  }

  return items;
}

function main() {
  const cnPath = path.join(PERIODICAS, 'ciencias-naturales/ciencias-naturales');
  const lcPath = path.join(PERIODICAS, 'lectura-critica/lectura-critica');

  const cn = fs.existsSync(cnPath) ? parseCienciasNaturales(fs.readFileSync(cnPath, 'utf8')) : [];
  const lc = fs.existsSync(lcPath) ? parseLecturaCritica(fs.readFileSync(lcPath, 'utf8')) : [];

  const outDir = path.join(import.meta.dirname, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const payload = { ciencias_naturales: cn, lectura_critica: lc, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(outDir, 'periodicas-exam-questions.json'), JSON.stringify(payload, null, 2));
  console.log(`Parsed ${cn.length} ciencias + ${lc.length} lectura items → output/periodicas-exam-questions.json`);
}

main();
