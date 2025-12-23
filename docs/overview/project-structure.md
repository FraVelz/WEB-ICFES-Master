# Estructura del Proyecto

Este documento describe la organización de archivos y la arquitectura "Feature-Based" del proyecto.

## Vista General

```
src/
├── features/           # Módulos principales de negocio (Exámenes, Aprendizaje, etc.)
├── shared/             # Componentes y utilidades reutilizables
├── config/             # Configuración global (Firebase, constantes)
├── context/            # Estado global (Auth, UI)
├── hooks/              # Hooks globales
├── services/           # Lógica de negocio y comunicación con backend
├── styles/             # Estilos globales (Tailwind)
└── App.jsx             # Punto de entrada
```

## Arquitectura Feature-Based (`src/features/`)

Cada carpeta dentro de `features/` representa un dominio de negocio y contiene todo lo necesario para funcionar de forma aislada.

### Estructura de una Feature
```
features/nombre-feature/
├── components/         # Componentes exclusivos de esta feature
├── pages/              # Vistas/Páginas de esta feature
├── hooks/              # Lógica de estado local
├── utils/              # Funciones auxiliares
└── index.js            # Barril de exportación pública
```

### Features Actuales
- **exam/**: Lógica de exámenes, simulacros y resultados.
- **learning/**: Material de estudio y lecciones.
- **progress/**: Estadísticas y seguimiento del usuario.
- **home/**: Página de inicio y dashboard.

## Componentes Compartidos (`src/shared/`)

Componentes atómicos diseñados para ser reutilizados en toda la aplicación.

- **atoms/**: Elementos indivisibles (Botones, Badges, Textos).
- **molecules/**: Combinaciones simples (Tarjetas, Inputs con label).
- **organisms/**: Estructuras complejas (Headers, Footers).

## Servicios (`src/services/`)

Capa de abstracción para la comunicación con Firebase y lógica de negocio pura.
Ver [Documentación de Servicios](../backend/services-api.md).
