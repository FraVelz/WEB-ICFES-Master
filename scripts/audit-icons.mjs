#!/usr/bin/env node
/**
 * Audits icon registry consistency for WEB-ICFES-Master.
 * - Registry keys vs ICON_SOURCES
 * - Icon names used in src vs registry
 * - Lucide stroke icons wrongly marked with fill="currentColor"
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function extractObjectKeys(tsContent, exportName) {
  const marker = `export const ${exportName}`;
  const start = tsContent.indexOf(marker);
  if (start === -1) return [];
  const braceStart = tsContent.indexOf('{', start);
  let depth = 0;
  let end = braceStart;
  for (let i = braceStart; i < tsContent.length; i++) {
    if (tsContent[i] === '{') depth++;
    if (tsContent[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = tsContent.slice(braceStart + 1, end);
  const keys = [];
  for (const m of block.matchAll(/^\s+(?:'([^']+)'|([a-zA-Z0-9-]+))\s*:/gm)) {
    keys.push(m[1] ?? m[2]);
  }
  return keys;
}

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const iconSourcesContent = read('src/shared/components/Icon/iconSources.ts');
const sourceKeys = extractObjectKeys(iconSourcesContent, 'ICON_SOURCES');
const sourceSet = new Set(sourceKeys);

const mapA = extractObjectKeys(read('src/shared/components/Icon/iconMapPartA.ts'), 'ICONS_PART_A');
const mapB = extractObjectKeys(read('src/shared/components/Icon/iconMapPartB.ts'), 'ICONS_PART_B');
const registryKeys = [...new Set([...mapA, ...mapB])];
const registrySet = new Set(registryKeys);

const usedNames = new Set();
const srcFiles = walkDir(srcDir);
const iconPropRe = /icon:\s*['"]([a-z0-9-]+)['"]/g;
const iconNameRe = /<Icon\s+[^>]*name=\{?['"]([a-z0-9-]+)['"]\}?/g;

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = iconPropRe.exec(content))) usedNames.add(m[1]);
  while ((m = iconNameRe.exec(content))) usedNames.add(m[1]);
}

const errors = [];
const warnings = [];

for (const key of registryKeys) {
  if (!sourceSet.has(key)) warnings.push(`Registry key "${key}" missing in ICON_SOURCES`);
}
for (const key of sourceKeys) {
  if (!registrySet.has(key)) errors.push(`ICON_SOURCES key "${key}" missing in ICONS registry`);
}
for (const name of usedNames) {
  if (!registrySet.has(name)) errors.push(`Used icon "${name}" not in ICONS registry`);
}

/** Detect corrupted SVG `d` from unsafe string concatenation across lines. */
function auditPathJoins(content, fileLabel) {
  const issues = [];
  const exportRe = /export const (\w+)/g;
  let exportMatch;
  while ((exportMatch = exportRe.exec(content))) {
    const exportName = exportMatch[1];
    const start = exportMatch.index;
    const next = content.indexOf('export const ', start + 1);
    const chunk = content.slice(start, next === -1 ? content.length : next);
    if (!chunk.includes("' +")) continue;

    const parts = [...chunk.matchAll(/'([^']*)'/g)]
      .map((m) => m[1])
      .filter((p) => /[MmLlHhVvCcSsQqTtAaZz]/.test(p) || /^\d/.test(p) || p.includes('l-') || p.includes('v'));
    if (parts.length < 2) continue;

    const joined = parts.join('');
    if (/\d[a-zA-Z]/.test(joined)) {
      issues.push(`${fileLabel} ${exportName}: concatenated \`d\` likely corrupt (digit+letter merge in path data)`);
    }
  }
  return issues;
}

const lucideKeys = sourceKeys.filter(
  (k) => iconSourcesContent.includes(`'${k}': 'lucide:`) || iconSourcesContent.includes(`${k}: 'lucide:`)
);
const iconPathsDir = path.join(root, 'src/shared/components/Icon/iconPaths');
for (const file of fs.readdirSync(iconPathsDir)) {
  if (!file.endsWith('.tsx')) continue;
  const content = fs.readFileSync(path.join(iconPathsDir, file), 'utf8');
  for (const issue of auditPathJoins(content, file)) {
    errors.push(issue);
  }
  for (const key of lucideKeys) {
    const exportName = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Icon';
    const camelKey = key.includes('-')
      ? key
          .split('-')
          .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
          .join('')
      : key;
    const exportCandidates = [`${camelKey}Icon`, `${key.replace(/-/g, '')}Icon`];
    const hasExport = exportCandidates.some((e) => content.includes(`export const ${e}`));
    if (!hasExport) continue;
    const exportConst = exportCandidates.find((e) => content.includes(`export const ${e}`));
    const exportStart = content.indexOf(`export const ${exportConst}`);
    const nextExport = content.indexOf('export const ', exportStart + 1);
    const chunk = content.slice(exportStart, nextExport === -1 ? content.length : nextExport);
    if (/fill="currentColor"/.test(chunk)) {
      warnings.push(`Lucide icon "${key}" (${exportConst}) has fill="currentColor" — likely broken stroke paths`);
    }
  }
}

console.log('Icon audit');
console.log('----------');
console.log(`ICON_SOURCES: ${sourceKeys.length} keys`);
console.log(`ICONS registry: ${registryKeys.length} keys`);
console.log(`Used in src: ${usedNames.size} unique names`);
console.log('');

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  console.log('');
}

if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  process.exit(1);
}

console.log('✓ No blocking errors');
if (warnings.length) process.exit(0);
console.log('✓ No warnings');
