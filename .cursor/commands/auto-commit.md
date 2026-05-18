# Autocommit (Conventional Commits alineado al repo)

Usar cuando el usuario pida **hacer commit** del trabajo actual y quiera mensajes **coherentes con el historial del proyecto**, priorizando **Conventional Commits** y evitando el estilo antiguo de varios prefijos encadenados en una sola línea.

## Cuándo ejecutar

- El usuario invoca este comando o pide explícitamente **commit** / **autocommit**.
- **No** crear commits si el usuario no lo pidió (regla general del proyecto).

## Antes de commitear (siempre)

En paralelo cuando tenga sentido:

1. `git status` — archivos modificados y sin seguimiento.
2. `git diff` — qué cambió (staged y unstaged).
3. `git log -15 --oneline` — tono y tipos usados recientemente.

**No** incluir en el commit archivos que parezcan secretos (`.env`, credenciales, etc.).

## Formas de mensaje (elegir una)

### A) Formato lista — **preferido** si el commit toca **varias áreas** del repo

Cada línea del mensaje (asunto + cuerpo) sigue **exactamente**:

`<type>(<scope>): <acción en imperativo, inglés, sin punto final>`

- **`type`:** `feat`, `fix`, `docs`, `refactor`, `chore`, `build`, etc.
- **`scope`:** zona afectada en una sola palabra o con guiones: `readme`, `overview`, `setup`, `frontend`, `backend`, `data`, `integrations`, `cursor`, `scripts`, `auth`, `learning`, …
- **Primera línea:** la que resume mejor el conjunto; es la que muestra `git log --oneline`.
- **Líneas siguientes:** una por **bloque lógico** del diff (misma plantilla). Línea en blanco opcional entre la primera y el resto (Git separa asunto y cuerpo).
- **Sin** párrafos narrativos largos entre líneas; cada línea debe ser autónoma.

Ejemplo:

```text
docs(readme): simplify bilingual README and document Tailwind CSS 4

docs(setup): align installation and scripts documentation ES/EN
docs(backend): describe persistence layer instead of removed adapter
chore(cursor): add agent command specs for docs and commits
```

**Scope con `type` `docs`:** aquí **sí** se usa `docs(overview): …`, `docs(setup): …`: el scope indica **qué parte** de la documentación cambió, no duplica el tipo.

### B) Formato clásico — un commit **pequeño** o un solo tema

Una línea de asunto; cuerpo opcional en **frases completas** (inglés) si hace falta contexto; pies `BREAKING CHANGE:` si aplica.

```text
<type>(<scope opcional>): <descripción breve en imperativo>

Optional body explaining why this change was needed, in full sentences.

BREAKING CHANGE: only if consumers must migrate.
```

Si el `type` ya es `docs` y todo el cambio es genérico, puede usarse **sin** scope: `docs: fix broken links in overview`.

---

## Tipos (`type`) — priorizar

| Tipo        | Uso en este repo |
| ----------- | ---------------- |
| `feat`      | Nueva capacidad o comportamiento visible para el usuario. |
| `fix`       | Corrección de bug o regresión. |
| `docs`      | Documentación (`README`, `docs/`, comandos bajo `.cursor/commands/`, etc.). |
| `style`     | Formato, Prettier; sin cambiar lógica. |
| `refactor`  | Reestructuración sin cambiar comportamiento observable. |
| `perf`      | Rendimiento. |
| `test`      | Tests. |
| `build`     | Build, dependencias. |
| `ci`        | CI. |
| `chore`     | Mantenimiento (scripts auxiliares, `.gitignore`, etc.). |

**Evitar** tipos no estándar (`delete:`, `update:` como tipo único). Preferir `refactor:` / `chore:` con descripción clara.

## Descripción y estilo

- **Inglés** en asunto y cuerpo del commit.
- Imperativo: *add*, *fix*, *update*, *remove*, no *added* / *fixes*.
- **~72 caracteres** en la primera línea cuando sea razonable.
- No encadenar `feat: ... feat: ...` en una sola línea (patrón antiguo del repo).

## Ejemplos rápidos (formato clásico)

```text
feat(learning): add lesson preview modal on roadmap
fix(logros): restore streak modal state after navigation
refactor(services): remove unused re-exports from barrel
chore: bump typescript dev dependency
```

## Cómo crear el commit

1. Añadir solo lo necesario: `git add -p` o rutas concretas.
2. Mensaje con **heredoc**:

**Formato lista (varios cambios):**

```bash
git commit -m "$(cat <<'EOF'
docs(readme): tighten main README sections ES/EN

docs(overview): fix index links to setup guides
chore(cursor): document list-style commit messages in auto-commit
EOF
)"
```

**Formato clásico (un tema + cuerpo):**

```bash
git commit -m "$(cat <<'EOF'
feat(auth): clarify signup validation messages

Align client errors with API responses and improve screen reader labels.
EOF
)"
```

3. `git status` para verificar.
4. Si un **hook** rechaza el commit: corregir y **nuevo** commit; no usar `--no-verify` salvo petición explícita del usuario.
5. **No** añadir al mensaje ningún pie `Co-authored-by:` (en particular no firmar como coautor a Cursor ni a la IA). El commit debe reflejar solo el resumen acordado arriba.
6. Si el entorno **insertó** igualmente `Co-authored-by: Cursor ...` y el commit **aún no se ha empujado**, enmendar el último commit repitiendo el mismo texto **sin** esa línea final (no usar `--no-verify` salvo petición explícita del usuario).

## Romper compatibilidad (`BREAKING CHANGE`)

```text
feat(api)!: rename query param from areaId to subjectId

BREAKING CHANGE: clients must send `subjectId` instead of `areaId`.
```

## Resumen para el agente

- Diff + log antes de redactar.
- Commits que tocan **muchas carpetas** → **formato lista** (`type(scope): acción` por línea).
- Commits **atómicos** → formato clásico o una sola línea lista.
- Mensaje del commit en **inglés**; respuesta al usuario en **español** salvo que pida otro idioma.
- **Sin** `Co-authored-by:` en el mensaje; si aparece tras el commit local, enmendar y eliminarlo (commit no publicado).
