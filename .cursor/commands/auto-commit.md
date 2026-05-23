# Autocommit — WEB-ICFES-Master (Next.js + Supabase)

Usar cuando el usuario pida **hacer commit** del trabajo actual. Mensajes **Conventional Commits**, coherentes con
`git log` de este repo. **No** hacer `git push` salvo petición explícita.

## Cuándo ejecutar

- Invocación de **`/auto-commit`** o petición explícita de **commit** / **autocommit**.
- **No** commitear si el usuario no lo pidió.

## Antes de commitear

1. `git status` — staged y unstaged.
2. `git diff` — qué entra en el commit.
3. `git log -15 --oneline` — tono reciente.

**No** incluir `.env`, credenciales Supabase ni `.next/` salvo petición explícita.

## Ámbitos (`scope`) habituales en este repo

`home`, `demo`, `learning`, `exam`, `auth`, `logros`, `store`, `user`, `theme`, `dashboard`, `services`, `persistence`,
`readme`, `docs`, `cursor`, `ci`, `deps`.

Rutas de referencia: `src/app/(dashboard)/`, `src/features/`, `src/services/`, `src/storage/`, `docs/es|en/`,
`README.md` / `README.en.md`, `.cursor/`.

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

## Reglas

- Mensaje en **inglés**; respuesta al chat en **español**.
- Cumplir `.cursor/rules/git-commits.mdc` (sin coautoría IA).
- Hook rechazado → nuevo commit; sin `--no-verify` salvo petición explícita.
- Enmendar si aparece `Co-authored-by: Cursor` (commit no publicado).

## Comandos relacionados

- Un archivo o README: **`/update-docs`**.
- Barrido masivo en `docs/es` + `docs/en`: **`/update-global-ia-docs`**.
