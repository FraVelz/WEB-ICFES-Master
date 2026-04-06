/**
 * Refactoriza className="..." con más de maxLen caracteres usando cn().
 * Omite template literals con ${ } (se listan al final).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');
const MAX_LEN = 120;
const CHUNK = 90;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith('.tsx')) files.push(p);
  }
  return files;
}

function splitClasses(s) {
  const parts = s.trim().split(/\s+/);
  const lines = [];
  let buf = [];
  let len = 0;
  for (const p of parts) {
    const add = p.length + (buf.length ? 1 : 0);
    if (buf.length && len + add > CHUNK) {
      lines.push(buf.join(' '));
      buf = [p];
      len = p.length;
    } else {
      buf.push(p);
      len += add;
    }
  }
  if (buf.length) lines.push(buf.join(' '));
  return lines;
}

function addCnImport(src) {
  if (src.includes('@/utils/cn') || src.includes('@/utils/cn')) return src;
  const lines = src.split('\n');
  let i = 0;
  if (lines[0]?.startsWith("'use client'") || lines[0]?.startsWith('"use client"')) {
    i = 1;
    while (i < lines.length && lines[i].trim() === '') i++;
  }
  lines.splice(i, 0, "import { cn } from '@/utils/cn';");
  return lines.join('\n');
}

function processContent(filePath, src) {
  const alerts = [];
  const skipTemplate = [];

  // Detectar className={` ... ${ ... } ... `} o líneas largas con ${
  const templateRegex = /className=\{`[^`]*\$\{[^}]+\}[^`]*`\}/gs;
  let m;
  const tmpl = src.matchAll(/className=\{`([^`]*)\$\{([^}]*)\}([^`]*)`\}/g);
  for (const x of src.matchAll(/className=\{`([^`]*)\$\{[^}]+\}[^`]*`\}/g)) {
    const full = x[0];
    if (full.length > MAX_LEN) skipTemplate.push({ file: filePath, preview: full.slice(0, 80) + '...' });
  }

  // className="...."  (solo comillas dobles, sin ${ dentro)
  const re = /className="([^"]+)"/g;
  let out = src;
  let changed = false;

  out = out.replace(re, (full, inner) => {
    if (inner.length <= MAX_LEN) return full;
    if (inner.includes('${')) {
      alerts.push({ type: 'expr-in-string', file: filePath });
      return full;
    }
    const chunks = splitClasses(inner);
    if (chunks.length <= 1) return full;
    changed = true;
    const body = chunks.map((c) => `    '${c.replace(/'/g, "\\'")}'`).join(',\n');
    return `className={cn(\n${body},\n  )}`;
  });

  // className={'....'}  una sola string
  const re2 = /className=\{\s*'([^']+)'\s*\}/g;
  out = out.replace(re2, (full, inner) => {
    if (inner.length <= MAX_LEN) return full;
    const chunks = splitClasses(inner);
    if (chunks.length <= 1) return full;
    changed = true;
    const body = chunks.map((c) => `    '${c.replace(/'/g, "\\'")}'`).join(',\n');
    return `className={cn(\n${body},\n  )}`;
  });

  if (changed && out !== src) {
    out = addCnImport(out);
  }

  return { out, changed: out !== src, alerts, skipTemplate };
}

const files = walk(SRC);
const allAlerts = [];
let totalFiles = 0;

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const { out, changed, skipTemplate } = processContent(f, src);
  if (skipTemplate.length) allAlerts.push(...skipTemplate.map((s) => ({ ...s, file: f })));
  if (changed) {
    fs.writeFileSync(f, out);
    totalFiles++;
  }
}

console.log(`Archivos modificados: ${totalFiles}`);
if (allAlerts.length) {
  console.log('\n--- Revisar manual (className template largo con ${ }): ---');
  for (const a of allAlerts.slice(0, 40)) {
    console.log(a.file, '\n ', a.preview);
  }
  if (allAlerts.length > 40) console.log(`... y ${allAlerts.length - 40} más`);
}
