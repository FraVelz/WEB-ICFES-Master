#!/usr/bin/env node
/**
 * Concatena lotes SQL para carga en Supabase (MCP execute_sql o CLI).
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(import.meta.dirname, 'output');

function mergeBatches(prefix) {
  const files = fs
    .readdirSync(OUT)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.sql') && f.includes('-batch'))
    .sort();

  const merged = files.map((f) => fs.readFileSync(path.join(OUT, f), 'utf8')).join('\n');
  const outPath = path.join(OUT, `${prefix}-merged.sql`);
  fs.writeFileSync(outPath, merged);
  console.log(`${prefix}: ${files.length} batches → ${outPath} (${merged.length} bytes)`);
}

mergeBatches('phase2-matematicas');
mergeBatches('phase2-lectura-critica');
mergeBatches('phase2-ciencias-naturales');
mergeBatches('phase2-sociales-ciudadanas');
mergeBatches('phase2-ingles');
mergeBatches('phase3-matematicas');
mergeBatches('phase3-lectura-critica');
mergeBatches('phase3-ciencias-naturales');
mergeBatches('phase3-sociales-ciudadanas');
mergeBatches('phase3-ingles');

for (const exam of ['exam-questions-periodicas.sql', 'exam-questions-phase2-synthetic.sql', 'exam-questions-phase3-synthetic.sql']) {
  const p = path.join(OUT, exam);
  if (fs.existsSync(p)) console.log(`exam ready: ${p}`);
}
