# 🎯 RESUMEN EJECUTIVO - WEB-ICFES Master

## 📌 Stack tecnológico

| Tecnología       | Uso                                     |
| ---------------- | --------------------------------------- |
| **Next.js 15**   | Framework React con App Router          |
| **React 19**     | Biblioteca de interfaz                  |
| **Supabase**     | Backend: auth, PostgreSQL, persistencia |
| **Tailwind CSS** | Estilos y diseño                        |
| **pnpm**         | Gestor de paquetes                      |

---

## 📚 Documentación principal

- **Índice general:** [docs/es/overview/overview.md](./overview.md)
- **Instalación:** [docs/es/setup/installation.md](../setup/installation.md)
- **Configuración:** [docs/es/setup/configuration.md](../setup/configuration.md)

---

## 🚀 Inicio rápido

### Requisitos

- Node.js 18+
- pnpm

### Configuración inicial

```bash
git clone <url-repo>
cd WEB-ICFES-Master
pnpm install
cp .env.example .env.local   # Configurar variables
pnpm dev                     # Servidor de desarrollo
```

---

## 🗂️ Estructura del proyecto

```txt
WEB-ICFES-Master/
├── src/
│   ├── app/              # Rutas Next.js (App Router)
│   ├── features/         # Módulos de negocio
│   ├── shared/           # Componentes compartidos
│   ├── services/        # Capa de datos (Supabase, adaptadores)
│   └── config/          # Supabase, constantes
├── docs/                 # Documentación técnica (es/en)
├── package.json
└── next.config.ts
```

---

## 📞 Comandos rápidos

```bash
# Desarrollo
pnpm dev                   # Servidor local
pnpm build                 # Build de producción
pnpm start                 # Servidor de producción (tras el build)
```

---

## ⚠️ Importante

- **Variables de entorno:** Configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---
*Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026.*
