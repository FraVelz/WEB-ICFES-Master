# Estructura del Proyecto

Este documento describe la organización de archivos y la arquitectura "Feature-Based" del proyecto.

## Vista General

```txt
src/
├── app/                   # Next.js App Router (rutas, layouts)
│   ├── (auth)/           # Rutas de autenticación (login, signup, onboarding)
│   ├── (dashboard)/      # Rutas del dashboard (examen, lecciones, logros)
│   └── api/              # API Routes (ej: chat)
├── features/             # Módulos principales de negocio
├── shared/               # Componentes y utilidades reutilizables
├── services/             # Capa de datos (Supabase, adaptadores)
├── config/               # Configuración (Supabase, constantes)
├── components/           # Componentes globales (Providers, etc.)
├── hooks/                # Hooks globales
├── styles/               # Estilos globales (Tailwind)
└── ...
```

## Arquitectura Feature-Based (`src/features/`)

Cada carpeta dentro de `features/` representa un dominio de negocio y contiene todo lo necesario para funcionar de forma aislada.

### Estructura de una Feature

```txt
features/nombre-feature/
├── components/         # Componentes exclusivos de esta feature
├── pages/              # Vistas (si se usan fuera de app/)
├── hooks/              # Lógica de estado local
├── services/           # Servicios específicos
├── utils/              # Funciones auxiliares
└── index.js            # Barril de exportación
```

### Features Actuales

- **exam/**: Lógica de exámenes, simulacros y resultados.
- **learning/**: Material de estudio, lecciones y roadmap.
- **progress/**: Estadísticas y seguimiento del usuario.
- **home/**: Página de inicio y dashboard.
- **auth/**: Login, registro, onboarding.
- **user/**: Perfil, configuración.
- **logros/**: Gamificación, logros, desafíos.
- **store/**: Tienda, planes, suscripciones.

## Componentes Compartidos (`src/shared/`)

- **atoms/**: Elementos indivisibles (Botones, Badges, Textos).
- **molecules/**: Combinaciones simples (Tarjetas, Inputs con label).
- **organisms/**: Estructuras complejas (Headers, PaymentModal, QuestionContent).

## Servicios (`src/services/`)

Capa de abstracción para la comunicación con Supabase y lógica de negocio.
Ver [Documentación de Servicios](../backend/services-api.md).

## Rutas Next.js (`src/app/`)

| Ruta                      | Descripción            |
| ------------------------- | ---------------------- |
| `/`                       | Página de inicio       |
| `/login`, `/signup`       | Autenticación          |
| `/onboarding`             | Flujo de onboarding    |
| `/practica/[area]`        | Práctica por área      |
| `/examen-completo`        | Examen completo        |
| `/ruta-aprendizaje`       | Roadmap de aprendizaje |
| `/lessons/[area]/[topic]` | Lecciones por tema     |
| `/logros`                 | Centro de logros       |
| `/perfil`                 | Perfil de usuario      |
| `/configuracion`          | Configuración          |
