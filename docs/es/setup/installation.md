# Instalación

Guía paso a paso para configurar el entorno local del proyecto.

---

## Requisitos

| Herramienta | Versión mínima |
| ----------- | -------------- |
| **Node.js** | 18+            |
| **pnpm**    | 8+             |

```bash
node -v   # Verificar Node
pnpm -v   # Instalar: npm install -g pnpm
```

---

## Pasos

### 1. Clonar el repositorio

```bash
git clone <url-repo>
cd WEB-ICFES-Master
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea `.env.local` en la raíz del proyecto:

```bash
# Supabase (obligatorio para modo producción)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Modo de datos: 'supabase' | 'localStorage'
NEXT_PUBLIC_API_MODE=supabase

# OpenAI (opcional, para chat asistente)
OPENAI_API_KEY=sk-...
```

Para desarrollo sin backend, usa `NEXT_PUBLIC_API_MODE=localStorage`.

### 4. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Verificación

- `pnpm build` debe completar sin errores
- Con `NEXT_PUBLIC_API_MODE=localStorage` la app funciona sin Supabase
- Con `NEXT_PUBLIC_API_MODE=supabase` necesitas un proyecto Supabase configurado
