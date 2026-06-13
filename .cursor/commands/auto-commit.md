# Autocommit — monorepo ICFES (Master, Admin, …)

Usar cuando el usuario pida **hacer commit** del trabajo actual. Mensajes **Conventional Commits**, coherentes con
`git log` del repo en el que se trabaja. **No** hacer `git push` salvo petición explícita.

Identificar el repo correcto con **`monorepo-projects.mdc`** (web del cliente → `WEB-ICFES-Master/`; admin →
`WEB-ICFES-Admin/`).

## Cuándo ejecutar

- Invocación de **`/auto-commit`** o petición explícita de **commit** / **autocommit**.
- **No** commitear si el usuario no lo pidió.

## Antes de commitear

1. `git status` — staged y unstaged.
2. `git diff` — qué entra en el commit.
3. `git log -15 --oneline` — tono reciente.
4. **Respetar borrados:** si el diff elimina líneas o archivos, **no restaurarlos** ni "arreglar" el contenido antes del commit salvo petición explícita del usuario. Un borrado suele ser intencional.

**No** incluir `.env`, credenciales Supabase ni `.next/` salvo petición explícita.

## Ámbitos (`scope`) habituales

`home`, `demo`, `learning`, `exam`, `auth`, `achievements`, `store`, `user`, `theme`, `dashboard`, `services`, `persistence`,
`readme`, `docs`, `cursor`, `ci`, `deps`.

## Formas de mensaje

### A) Formato lista — varias áreas

```text
docs(readme): simplify bilingual README and document Tailwind CSS 4

docs(setup): align installation guides ES/EN
refactor(architecture): reorganize features services and persistence
```

### B) Formato clásico — un tema

```text
fix(demo): persist demo flag and gate account routes without flash
```

## Tipos

| Tipo              | Uso aquí                                      |
| ----------------- | --------------------------------------------- |
| `feat`            | Aprendizaje, examen, tienda, gamificación     |
| `fix`             | Demo, auth, UI, accesibilidad                 |
| `docs`            | `docs/es`, `docs/en`, README, comandos Cursor |
| `refactor`        | Features, servicios, persistencia local       |
| `chore` / `build` | Deps, react-doctor, config                    |
| `ci`              | Workflows                                     |

## Commit

```bash
git commit -m "$(cat <<'EOF'
feat(theme): add semantic Tailwind tokens and animations import

docs(overview): fix index links to setup guides
chore(cursor): add component-scope and git-commits rules
EOF
)"
```

## Después de commitear — eliminar menciones de Cursor (obligatorio)

Cursor o un hook de git pueden inyectar trailers que **no** forman parte del mensaje pedido, por ejemplo:

```text
Co-authored-by: Cursor <cursoragent@cursor.com>
```

**No dar por terminado `/auto-commit`** si el commit los incluye.

### 1. Verificar siempre

```bash
git log -1 --format=%B
```

Buscar `Co-authored-by: Cursor`, `cursoragent@cursor.com` o cualquier coautoría de Cursor/IA.

### 2. Si aparece, reescribir el mensaje (commit aún sin push)

Usar `git commit-tree` si `git commit --amend` vuelve a inyectar el trailer:

```bash
MSG="$(git log -1 --format=%B | sed '/^Co-authored-by: Cursor/d')"
TREE=$(git rev-parse HEAD^{tree})
PARENT=$(git rev-parse HEAD^)
NEW=$(printf '%s\n' "$MSG" | git commit-tree "$TREE" -p "$PARENT")
git reset --hard "$NEW"
git log -1 --format=%B
```

La segunda comprobación debe mostrar **solo** el subject/body acordado (Conventional Commits), sin trailers de Cursor.

### 3. Antes de push

- Commit local limpio → OK para push si el usuario lo pidió.
- Commit con trailer de Cursor → **reescribir primero**; no subir a `main`.

Detalle completo: **`.cursor/rules/git-commits.mdc`**.

## Reglas

- Mensaje en **inglés**; respuesta al chat en **español**.
- Cumplir `.cursor/rules/git-commits.mdc` (sin coautoría IA).
- Hook rechazado → nuevo commit; sin `--no-verify` salvo petición explícita.
- **No** hacer `git push --force` salvo petición explícita del usuario.

## Comandos relacionados

- Un archivo o README: **`/update-docs`**.
- Barrido masivo en `docs/es` + `docs/en`: **`/update-global-ia-docs`**.
