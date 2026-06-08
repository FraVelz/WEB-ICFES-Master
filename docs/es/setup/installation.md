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
# Supabase (obligatorio para login y datos de cuenta)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# OpenAI (opcional, para el asistente de chat)
OPENAI_API_KEY=sk-...
```

Para probar la app sin cuenta, usa el **modo demo** desde la landing (no requiere Supabase para la sesión demo).

### 4. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Verificación

- `pnpm build` debe completar sin errores
- Con Supabase configurado, login/registro y datos de cuenta persisten en PostgreSQL
- El modo demo funciona sin cuenta (progreso local en el navegador)

Para detalle de variables, ver [configuration.md](./configuration.md).

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
