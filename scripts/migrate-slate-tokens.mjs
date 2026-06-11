#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const SHADE_TOKEN = {
  950: 'surface-via',
  900: 'surface-elevated',
  800: 'surface-overlay',
  700: 'surface-border',
  600: 'surface-border',
  500: 'on-surface-muted',
  400: 'on-surface-muted',
  300: 'on-surface-muted',
  200: 'on-surface',
  100: 'on-surface',
};

function tokenFor(utility, shade) {
  if (utility === 'text' || utility === 'placeholder') {
    return SHADE_TOKEN[shade] ?? null;
  }
  if (utility === 'from' || utility === 'via' || utility === 'to') {
    if (shade >= 500) return SHADE_TOKEN[shade];
    return SHADE_TOKEN[shade] ?? null;
  }
  if (utility === 'shadow' || utility === 'scrollbar-thumb') {
    if (shade >= 700) return shade >= 900 ? 'surface-elevated' : 'surface-border';
    return 'surface-border';
  }
  if (shade >= 500) return 'on-surface-muted';
  if (shade >= 700) return 'surface-border';
  if (shade >= 800) return 'surface-overlay';
  if (shade >= 900) return 'surface-elevated';
  return 'surface-via';
}

const SLATE_RE =
  /(?<prefix>(?:hover:|dark:|focus-visible:|active:|group-hover:|group-focus-within:|enabled:|disabled:|sm:|md:|lg:|xl:|2xl:)*)?(?<utility>bg|border(?:-[trblxy])?|divide|text|from|via|to|placeholder|ring-offset|shadow|scrollbar-thumb)-slate-(?<shade>\d{3})(?<opacity>\/\d+)?/g;

function migrate(content) {
  return content.replace(SLATE_RE, (match, prefix, utility, shade, opacity) => {
    const token = tokenFor(utility.replace(/-[trblxy]$/, ''), shade);
    if (!token) return match;
    return `${prefix ?? ''}${utility}-${token}${opacity ?? ''}`;
  });
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === 'node_modules' || name === '.next') continue;
      walk(path, files);
    } else if (/\.(tsx?|css)$/.test(name)) {
      files.push(path);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(join(ROOT, 'src'))) {
  const before = readFileSync(file, 'utf8');
  const after = migrate(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
  }
}

console.log(`Done. ${changed} files updated.`);
