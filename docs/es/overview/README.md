# Documentación del Proyecto WEB-ICFES

Bienvenido a la documentación técnica del proyecto. Esta documentación está organizada para facilitar la incorporación de nuevos desarrolladores y servir como referencia técnica.

## 📚 Estructura de la Documentación

### 1. Visión General (`/overview`)

- **[Resumen Ejecutivo](executive-summary.md)**: Visión de alto nivel para managers y nuevos integrantes.
- **[Estructura del Proyecto](project-structure.md)**: Explicación de la arquitectura de carpetas y módulos.

### 2. Configuración (`/setup`)

- **[Instalación](../setup/installation.md)**: Guía paso a paso para configurar el entorno local.
- **[Configuración](../setup/configuration.md)**: Variables de entorno y archivos de configuración.
- **[Tecnologías](../setup/TECNOLOGIAS.md)**: Stack completo del proyecto.
- **[Rutas](../setup/rutas.md)**: URLs y rutas de la aplicación.
- **[Scripts](../setup/SCRIPTS.md)**: Comandos de package.json.
- **[Cheatsheet](../setup/cheatsheet.md)**: Comandos rápidos y snippets de uso frecuente.

### 3. Frontend (`/frontend`)

- **[Arquitectura](../frontend/architecture.md)**: Detalles de la arquitectura Feature-Based con Next.js.
- **[Guía de Componentes](../frontend/components-guide.md)**: Uso de Hooks y creación de componentes.
- **[Guía de Estilos](../frontend/styles-guide.md)**: Sistema de diseño y Tailwind.

### 4. Backend & Servicios (`/backend`)

- **[API de Servicios](../backend/services-api.md)**: Arquitectura Supabase, servicios y capa de datos.

### 5. Datos (`/data`)

- **[Esquema de Contenido](../data/content-schema.md)**: Estructura JSON de preguntas y lecciones.
- **[Estructura de Aprendizaje](../data/learning-structure-guide.md)**: Tabla `learning_content` en Supabase.
- **[Estructura de Quizzes](../data/learning-quiz-structure.md)**: Quizzes en lecciones.

### 6. Integraciones (`/integrations`)

- **[Pagos](../integrations/payments.md)**: Integración de pasarela de pagos, guardado en Supabase.

### 7. Onboarding (`/onboarding`)

- **[Guía de Avatares](../onboarding/GUIA_AVATARES_ONBOARDING.md)**: Personalización de avatares.
- **[Implementación](../onboarding/ONBOARDING_IMPLEMENTATION.md)**: Flujo completo del onboarding.

---

## 🚀 Inicio Rápido

1. Lee el **[Resumen Ejecutivo](executive-summary.md)** para entender el contexto.
2. Sigue la **[Guía de Instalación](../setup/installation.md)**.
3. Consulta la **[Estructura del Proyecto](project-structure.md)** para navegar el código.
