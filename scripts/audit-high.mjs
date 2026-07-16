#!/usr/bin/env node
/**
 * CI gate: fail on high/critical advisories in production deps.
 *
 * Why not `pnpm audit`? npm retired `/-/npm/v1/security/audits{,/quick}` (HTTP 410
 * as of 2026-07-15). pnpm 9.x still calls that endpoint. This script uses the
 * replacement bulk advisory API and mirrors `--audit-level high --prod`.
 *
 * @see https://api-docs.npmjs.com/#tag/Audit
 */
import { execFileSync } from 'node:child_process';

const AUDIT_LEVELS = new Set(['high', 'critical']);
const BULK_URL = 'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk';

/** @typedef {{ id: number, title: string, severity: string, url: string, vulnerable_versions: string }} Advisory */

function collectProdVersions() {
  const raw = execFileSync('pnpm', ['list', '--prod', '--json', '--depth', 'Infinity'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const trees = JSON.parse(raw);
  /** @type {Record<string, Set<string>>} */
  const pkgs = Object.create(null);

  /** @param {Record<string, { version?: string, dependencies?: Record<string, unknown> }> | undefined} deps */
  function walk(deps) {
    if (!deps) return;
    for (const [name, info] of Object.entries(deps)) {
      if (info?.version) {
        if (!pkgs[name]) pkgs[name] = new Set();
        pkgs[name].add(info.version);
      }
      walk(/** @type {typeof deps} */ (info?.dependencies));
    }
  }

  for (const tree of trees) {
    walk(tree.dependencies);
  }

  return Object.fromEntries(Object.entries(pkgs).map(([name, versions]) => [name, [...versions]]));
}

async function fetchAdvisories(body) {
  const res = await fetch(BULK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bulk advisory API ${res.status}: ${text.slice(0, 400)}`);
  }
  return /** @type {Record<string, Advisory[]>} */ (await res.json());
}

function main() {
  const body = collectProdVersions();
  const packageCount = Object.keys(body).length;
  console.log(`[audit-high] scanning ${packageCount} prod packages via npm bulk advisory API`);

  return fetchAdvisories(body).then((data) => {
    /** @type {Array<{ name: string } & Advisory>} */
    const hits = [];
    for (const [name, advisories] of Object.entries(data ?? {})) {
      for (const advisory of advisories ?? []) {
        if (AUDIT_LEVELS.has(advisory.severity)) {
          hits.push({ name, ...advisory });
        }
      }
    }

    if (hits.length === 0) {
      console.log('[audit-high] OK — no high/critical advisories in prod tree');
      return;
    }

    console.error(`[audit-high] FAIL — ${hits.length} high/critical advisory(ies):\n`);
    for (const hit of hits) {
      console.error(
        `- [${hit.severity}] ${hit.name}@${hit.vulnerable_versions}\n  ${hit.title}\n  ${hit.url}`
      );
    }
    process.exitCode = 1;
  });
}

main().catch((err) => {
  console.error('[audit-high]', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
