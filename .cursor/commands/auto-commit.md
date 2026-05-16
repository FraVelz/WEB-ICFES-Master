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

## Formato de mensaje (Conventional Commits)

Estructura recomendada:

```text
<type>(<optional-scope>): <descripción en imperativo, en inglés, sin punto final>

<cuerpo opcional: qué y por qué, frases completas.>

<Footers opcionales: BREAKING CHANGE:, Refs:, etc.>
```

### Tipos (`type`) — priorizar estos

| Tipo       | Uso en este repo |
|-----------|-------------------|
| `feat`    | Nueva capacidad o comportamiento visible para el usuario. |
| `fix`     | Corrección de bug o regresión. |
| `docs`    | Solo documentación (`README`, `docs/`, comentarios de archivo de doc). |
| `style`   | Formato, espacios, Prettier; sin cambiar lógica. |
| `refactor`| Reestructuración sin cambiar comportamiento observado. |
| `perf`    | Mejora de rendimiento. |
| `test`    | Tests (añadir, corregir, refinar). |
| `build`   | Empaquetado, dependencias, herramientas de build. |
| `ci`      | Pipelines, checks de CI. |
| `chore`   | Mantenimiento rutinario (scripts auxiliares, `.gitignore`, tareas internas). |

**Evitar** tipos no estándar en commits nuevos (`delete:`, `update:` como tipo único). Preferir:

- Borrado de código muerto → `refactor:` o `chore:` con descripción clara.
- Cambio solo en `tsconfig` / tooling → `chore:` o `build:`.

### Scope (`optional-scope`)

Opcional, en minúsculas y corto. Ejemplos que ya aparecen en el historial:

- `auth`, `learning`, `logros`, `exam`, `store`, `global`
- Rutas o áreas: `ruta-aprendizaje`, `dashboard`
- `docs` como scope es redundante si `type` ya es `docs`; usar solo si aclara (p. ej. `docs(es)` raramente; mejor `docs: ...` sin scope).

### Descripción (línea de asunto)

- **Inglés** (como en los commits más recientes y limpios del repo).
- Imperativo: *add*, *fix*, *update*, *remove*, no *added* / *fixes*.
- **Máximo ~72 caracteres** en la primera línea cuando sea posible.
- **Un** cambio lógico por commit cuando se pueda; no repetir varias frases `feat: ... feat: ...` en una sola línea (patrón antiguo a corregir).

### Cuerpo (opcional, recomendado si el diff no es trivial)

Volver a un estilo cercano a commits como:

`fix: clear react-doctor blockers and stabilize scan config`

con párrafo que explique *qué* y *por qué*, en frases completas.

## Ejemplos alineados al proyecto

**Solo docs EN/ES:**

```text
docs: align overview paths with docs tree
```

**Feature de UI:**

```text
feat(learning): add lesson preview modal on roadmap
```

**Bugfix:**

```text
fix(logros): restore streak modal state after navigation
```

**Refactor / limpieza:**

```text
refactor(services): remove unused re-exports from barrel
```

**Chore / config:**

```text
chore: bump typescript dev dependency
```

## Cómo crear el commit

1. Añadir solo los archivos que deben entrar: `git add -p` o rutas concretas.
2. Mensaje con **heredoc** (evitar problemas de comillas y saltos de línea):

```bash
git commit -m "$(cat <<'EOF'
feat(auth): clarify signup validation messages

Align client errors with API responses and improve screen reader labels.
EOF
)"
```

3. Tras el commit: `git status` para verificar.
4. Si un **hook** rechaza el commit: corregir el problema y **nuevo** commit; no usar `--no-verify` salvo petición explícita del usuario.

## Romper compatibilidad (`BREAKING CHANGE`)

Si el cambio exige acción en consumidores o despliegue:

```text
feat(api)!: rename query param from areaId to subjectId

BREAKING CHANGE: clients must send `subjectId` instead of `areaId`.
```

(El `!` tras el scope/tipo es opcional pero recomendado en Conventional Commits 1.0.)

## Resumen para el agente

- Leer **diff + log** antes de redactar el mensaje.
- Preferir **un tipo + un asunto claro**; cuerpo si el cambio es amplio.
- **Inglés** en asunto/cuerpo; respuesta al usuario puede seguir en español si el usuario la pide en español.
