#!/usr/bin/env node
/**
 * Regenerates iconPaths/*.tsx from ICON_SOURCES via Iconify API (icons0-compatible).
 * Fixes corrupted multi-line `d` string concatenation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const iconPathsDir = path.join(root, 'src/shared/components/Icon/iconPaths');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function extractObjectEntries(tsContent, exportName) {
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
  const entries = [];
  for (const m of block.matchAll(/^\s+(?:'([^']+)'|([a-zA-Z0-9-]+))\s*:\s*(\w+)/gm)) {
    entries.push({ key: m[1] ?? m[2], exportName: m[3] });
  }
  return entries;
}

function extractIconSources(tsContent) {
  return Object.fromEntries(extractObjectEntries(tsContent, 'ICON_SOURCES').map((e) => [e.key, null]));
}

function parseIconSources(tsContent) {
  const marker = 'export const ICON_SOURCES';
  const start = tsContent.indexOf(marker);
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
  const sources = {};
  for (const m of block.matchAll(/^\s+(?:'([^']+)'|([a-zA-Z0-9-]+))\s*:\s*'([^']+)'/gm)) {
    sources[m[1] ?? m[2]] = m[3];
  }
  return sources;
}

function getIconRenderMode(name, source) {
  if (!source) return 'stroke';
  if (source.startsWith('simple-icons:')) return 'fill';
  if (source.startsWith('lucide:')) return 'stroke';
  if (source.includes('-solid')) return 'fill';
  if (name === 'play-circle') return 'fill';
  if (name === 'camera') return 'fill';
  if (name === 'cog') return 'fill';
  return 'stroke';
}

function parseAttrs(attrString) {
  const attrs = {};
  const re = /([\w-]+)=["']([^"']*)["']/g;
  let m;
  while ((m = re.exec(attrString))) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function extractSvgElements(svg) {
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
  const elements = [];
  const tagRe = /<(path|circle|rect|line|polyline|polygon|g)\s*([^>]*?)(\/?)>/g;
  let m;
  while ((m = tagRe.exec(inner))) {
    const [, tag, attrStr, selfClose] = m;
    if (tag === 'g') continue;
    elements.push({ tag, attrs: parseAttrs(attrStr), selfClose: selfClose === '/' });
  }
  return elements;
}

async function fetchIconSvg(iconifyId) {
  const url = `https://api.iconify.design/${iconifyId.replace(':', '/')}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${iconifyId}: ${res.status}`);
  return res.text();
}

function escapeJsxString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function elementToJsx(el, mode) {
  const { tag, attrs } = el;
  if (tag === 'path') {
    const d = attrs.d;
    if (!d) return null;
    if (mode === 'fill') {
      const parts = ['fill="currentColor"', 'stroke="none"'];
      if (attrs['fill-rule'] === 'evenodd') parts.push('fillRule="evenodd"');
      if (attrs['clip-rule'] === 'evenodd') parts.push('clipRule="evenodd"');
      parts.push(`d="${escapeJsxString(d)}"`);
      return `<path ${parts.join(' ')} />`;
    }
    return `<path d="${escapeJsxString(d)}" />`;
  }
  if (tag === 'circle') {
    const { cx, cy, r } = attrs;
    if (mode === 'fill') {
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" stroke="none" />`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" />`;
  }
  if (tag === 'rect') {
    const keys = ['x', 'y', 'width', 'height', 'rx', 'ry'];
    const a = keys.filter((k) => attrs[k]).map((k) => `${k}="${attrs[k]}"`);
    if (mode === 'fill') a.push('fill="currentColor"', 'stroke="none"');
    else a.push('fill="none"');
    return `<rect ${a.join(' ')} />`;
  }
  return null;
}

function generateExportJsx(exportName, elements, mode, source) {
  const lines = elements.filter(Boolean);
  if (lines.length === 0) {
    throw new Error(`No elements for ${exportName}`);
  }
  const body = lines.length === 1 ? lines[0] : `(\n  <>\n    ${lines.join('\n    ')}\n  </>\n)`;
  const single = lines.length === 1;
  const comment = `/** ${source} (icons0) */`;
  if (single) {
    return `${comment}\nexport const ${exportName} = ${body};`;
  }
  return `${comment}\nexport const ${exportName} = ${body};`;
}

function listExportsInFile(content) {
  return [...content.matchAll(/export const (\w+)/g)].map((m) => m[1]);
}

function scanIconPathFiles() {
  const files = fs
    .readdirSync(iconPathsDir)
    .filter((f) => /^iconPaths\d+\.tsx$/.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/\d+/)[0]);
      const nb = Number(b.match(/\d+/)[0]);
      return na - nb;
    });
  return files.map((file) => {
    const content = fs.readFileSync(path.join(iconPathsDir, file), 'utf8');
    return { file, exports: listExportsInFile(content) };
  });
}

async function main() {
  const sourcesContent = read('src/shared/components/Icon/iconSources.ts');
  const iconSources = parseIconSources(sourcesContent);
  const mapA = extractObjectEntries(read('src/shared/components/Icon/iconMapPartA.ts'), 'ICONS_PART_A');
  const mapB = extractObjectEntries(read('src/shared/components/Icon/iconMapPartB.ts'), 'ICONS_PART_B');
  const exportToKey = new Map();
  for (const { key, exportName } of [...mapA, ...mapB]) {
    exportToKey.set(exportName, key);
  }

  const svgCache = new Map();
  async function getSvg(iconifyId) {
    if (!svgCache.has(iconifyId)) {
      process.stdout.write(`  fetch ${iconifyId}\n`);
      svgCache.set(iconifyId, await fetchIconSvg(iconifyId));
    }
    return svgCache.get(iconifyId);
  }

  const filePlans = scanIconPathFiles();
  let total = 0;

  for (const { file, exports } of filePlans) {
    const generated = ['/** SVG path nodes for Icon registry. Auto-synced from icons0 — do not edit by hand. */', ''];
    for (const exportName of exports) {
      const registryKey = exportToKey.get(exportName);
      if (!registryKey) {
        throw new Error(`No registry key for ${exportName}`);
      }
      const iconifyId = iconSources[registryKey];
      if (!iconifyId) {
        throw new Error(`No ICON_SOURCES for key ${registryKey}`);
      }
      const mode = getIconRenderMode(registryKey, iconifyId);
      const svg = await getSvg(iconifyId);
      const rawElements = extractSvgElements(svg);
      const jsxElements = rawElements.map((el) => elementToJsx(el, mode)).filter(Boolean);
      generated.push(generateExportJsx(exportName, jsxElements, mode, iconifyId));
      generated.push('');
      total++;
    }
    const outPath = path.join(iconPathsDir, file);
    fs.writeFileSync(outPath, `${generated.join('\n').trimEnd()}\n`);
    console.log(`Wrote ${file} (${exports.length} icons)`);
  }

  console.log(`\nSynced ${total} icon exports from ${svgCache.size} unique Iconify sources.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
