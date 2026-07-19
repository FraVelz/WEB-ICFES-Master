# CI — `pnpm audit` high+ gate (B2-6)

## Gate

| Campo   | Valor                                                     |
| ------- | --------------------------------------------------------- |
| Script  | `pnpm run audit` → `node scripts/audit-high.mjs`          |
| Nivel   | **high** + **critical** (prod tree only)                  |
| CI step | `.github/workflows/ci.yml` → “Audit dependencies (high+)” |

## Por qué no `pnpm audit` directo

El registry npm retiró `/-/npm/v1/security/audits{,/quick}` (HTTP **410**, 2026-07-15).  
`pnpm@9` (packageManager del repo) sigue llamando ese endpoint → `ERR_PNPM_AUDIT_BAD_RESPONSE`.

El script usa el endpoint de reemplazo:

`POST https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`

con las versiones de `pnpm list --prod --depth Infinity`.

## Verificar

```bash
pnpm run audit
# → [audit-high] OK — no high/critical advisories in prod tree
```

Legacy (falla con 410 hasta upgrade de pnpm): `pnpm run audit:pnpm`.
