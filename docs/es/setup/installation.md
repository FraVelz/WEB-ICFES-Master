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

# OpenAI chat (optional; requires OPENAI_ENABLED=true and OPENAI_API_KEY)
OPENAI_ENABLED=false
NEXT_PUBLIC_OPENAI_ENABLED=false
OPENAI_API_KEY=sk-...

# Billing / Free-Pro-Premium (keep false in 2026)
BILLING_ENABLED=false
NEXT_PUBLIC_BILLING_ENABLED=false
```

Para probar la app sin cuenta, usa el **modo demo** desde la landing (no requiere Supabase para la sesión demo).

El asistente IA solo aparece si `OPENAI_ENABLED=true` **y** hay `OPENAI_API_KEY`. Los planes de pago no están activos en 2026 (ver [billing-no-2026.md](../decisions/billing-no-2026.md)).

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
