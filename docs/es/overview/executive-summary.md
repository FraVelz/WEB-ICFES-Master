# 🎯 RESUMEN EJECUTIVO - WEB-ICFES Master

## 📌 Stack Tecnológico

| Tecnología       | Uso                                     |
| ---------------- | --------------------------------------- |
| **Next.js 15**   | Framework React con App Router          |
| **Supabase**     | Backend: Auth, PostgreSQL, persistencia |
| **Tailwind CSS** | Estilos y diseño                        |
| **pnpm**         | Gestor de paquetes                      |

---

## 📚 Documentación Principal

- **Índice general:** `_docs/DOCUMENTATION.md`
- **Instalación:** `_docs/setup/installation.md`
- **Configuración:** `_docs/setup/configuration.md`

---

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- pnpm

### Setup Inicial

```bash
git clone <url-repo>
cd WEB-ICFES-Master
pnpm install
cp .env.example .env.local   # Configurar variables
pnpm dev                     # Servidor de desarrollo
```

---

## 🗂️ Estructura del Proyecto

```txt
WEB-ICFES-Master/
├── src/
│   ├── app/              # Rutas Next.js (App Router)
│   ├── features/         # Módulos de negocio
│   ├── shared/           # Componentes compartidos
│   ├── services/         # Capa de datos (Supabase, adaptadores)
│   └── config/           # Supabase, constantes
├── package.json
├── next.config.ts
└── _docs/
```

---

## 📞 Comandos Rápidos

```bash
# Desarrollo
pnpm dev                   # Servidor local
pnpm build                 # Build de producción
pnpm start                 # Preview de producción
```

---

## ⚠️ Importante

- **Variables de entorno:** Configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
