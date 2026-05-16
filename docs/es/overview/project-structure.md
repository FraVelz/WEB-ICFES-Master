# Estructura del proyecto

Este documento describe la organización de archivos y la arquitectura por características (*feature-based*) del proyecto.

## Vista general

```txt
src/
├── app/                   # Next.js App Router (rutas, layouts)
│   ├── (auth)/           # Autenticación (login, registro, onboarding)
│   ├── (dashboard)/      # Dashboard (examen, lecciones, logros, etc.)
│   └── api/              # API Routes (p. ej. chat)
├── features/             # Módulos principales de negocio
├── shared/               # Componentes y utilidades reutilizables
├── services/             # Capa de datos (Supabase, adaptadores)
├── config/               # Configuración (Supabase, constantes)
├── components/           # Componentes globales (proveedores, etc.)
├── context/              # Contextos de React
├── hooks/                # Hooks globales
├── lib/                  # Utilidades del cliente
├── store/                # Store Redux y tipos relacionados
├── styles/               # Estilos globales (Tailwind)
├── types/                # Tipos TypeScript globales
├── utils/                # Utilidades en raíz (p. ej. `cn`)
└── ...
```

## Arquitectura por características (`src/features/`)

Cada carpeta dentro de `features/` representa un dominio de negocio y agrupa lo necesario para funcionar de forma aislada.

### Estructura de una feature

```txt
features/nombre-feature/
├── components/         # Componentes exclusivos de esta feature
├── pages/              # Vistas (si se usan fuera de `app/`)
├── hooks/              # Lógica de estado local
├── services/           # Servicios específicos
├── utils/              # Funciones auxiliares
└── index.ts            # Barril de exportación
```

### Features actuales

- **exam/**: Lógica de exámenes, simulacros y resultados.
- **learning/**: Material de estudio, lecciones y *roadmap*.
- **progress/**: Estadísticas y seguimiento del usuario.
- **home/**: Página de inicio y *dashboard*.
- **auth/**: Inicio de sesión, registro, *onboarding*.
- **user/**: Perfil y configuración de cuenta.
- **logros/**: Gamificación, logros y desafíos.
- **store/**: Tienda, planes y suscripciones.
- **legal/**: Referencia a contenido legal (p. ej. términos y privacidad en `src/app`).

## Componentes compartidos (`src/shared/`)

- **atoms/**: Elementos indivisibles (botones, *badges*, textos).
- **molecules/**: Combinaciones simples (tarjetas, campos con etiqueta).
- **organisms/**: Estructuras complejas (*headers*, *PaymentModal*, *QuestionContent*).

## Servicios (`src/services/`)

Capa de abstracción para la comunicación con Supabase y la lógica de negocio compartida.
Ver [documentación de servicios](../backend/services-api.md).

## Rutas Next.js (`src/app/`)

| Ruta                       | Descripción              |
| -------------------------- | ------------------------ |
| `/`                        | Página de inicio         |
| `/login`, `/signup`        | Autenticación            |
| `/onboarding`              | Flujo de *onboarding*    |
| `/practica/[area]`         | Práctica por área        |
| `/examen-completo`         | Examen completo          |
| `/clasificatoria`          | Clasificatoria / ranking |
| `/ruta-aprendizaje`        | *Roadmap* de aprendizaje |
| `/lessons/[area]/[topic]`  | Lecciones por tema       |
| `/desafios-diarios`        | Desafíos diarios         |
| `/logros`                  | Centro de logros         |
| `/perfil`                  | Perfil de usuario        |
| `/configuracion`           | Configuración            |
| `/terminos`                | Términos de uso          |
| `/privacidad`              | Política de privacidad   |

---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
