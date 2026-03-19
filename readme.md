# Web Icfes Master

Una plataforma interactiva para practicar preguntas y aprender temas del examen de estado ICFES (Saber 11) en colombia. Diseñada con arquitectura **Feature-Based** y **Atomic Design** usando Next.js 15, React 19, Tailwind CSS 3 y Supabase.

> se buscaba abarcar muchos mas paises, aparte de colombia, pero cada pais maneja la educacion de forma diferente, las preguntas, los temas, las materias cambian, incruso, hay paises donde el examen no es obligatorio o es inexistente.

![Hero section de la plataforma ICFES - Domina el ICFES desde Cero](public/images/screenshot.png)

## Características Principales

- **3 Niveles de Aprendizaje**:
  - **Nivel Fácil**: Aprende bases con materiales estructurados y ejercicios básicos
  - **Nivel Intermedio**: Practica exámenes individuales por materia
  - **Nivel Avanzado**: Simulacro global ICFES de 200 preguntas en 3 horas
- **Práctica por Áreas**: Matemáticas, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés
- **Examen Simulado Completo**: Resuelve todas las preguntas con temporizador configurable
- **Material de Estudio Avanzado**: Acceso a recursos educativos organizados por tema
- **Seguimiento de Progreso**: Visualiza tus estadísticas y áreas de mejora
- **Desafíos Diarios y Clasificatoria**: Compite y mantén rachas de estudio
- **Autenticación**: Inicio de sesión con email/contraseña y Google (Supabase Auth)
- **Sistema de Gamificación**: 40+ logros desbloqueables por categoría (Primeros Pasos, Rachas, Logros Académicos, Excelencia, Planes)
- **Planes de Suscripción**: Gratuito, Pro, Premium y Anual con beneficios progresivos
- **Sistema de Calificación**: Retroalimentación inmediata con explicaciones detalladas
- **Interfaz Responsiva**: Funciona perfectamente en móvil, tablet y desktop
- **Contenido Multimedia**: Soporta imágenes, tablas, fórmulas, gráficas y más

## Contenido de Preguntas

- **Matemáticas**: Álgebra, Geometría, Cálculo, Estadística
- **Lenguaje**: Gramática, Vocabulario, Comprensión, Literatura
- **Ciencias Naturales**: Biología, Física, Química, Ecología
- **Ciencias Sociales**: Historia, Geografía, Economía, Política
- **Inglés**: Vocabulario, Gramática, Comprensión de Lectura

Total: 40+ preguntas con contenido avanzado (imágenes, tablas, fórmulas, gráficas)

## Sistema de Logros

### Categorías de Logros (40+ total)

1. **Primeros Pasos** (4 logros)
   - Primer Paso, Aprendiz, Perfeccionista Primerizo, Racha Inicial

2. **Rachas** (4 logros)
   - Semana de Fuego, Campeón Mensual, Leyenda de Rachas, Dedicado por un Año

3. **Logros Académicos** (8 logros)
   - Estudiante Dedicado, Maestro de Pruebas, Centinela del Conocimiento
   - Precisión, Impecable, Virtuoso

4. **Excelencia** (4 logros)
   - Excelencia, Maestro Integral, Rayo Veloz, Campeón de Consistencia

5. **Planes y Suscripciones** (16 logros)
   - Plan Gratuito: Usuario Gratuito, Explorador
   - Plan Pro: Usuario Pro, Poder Pro, Pro Avanzado
   - Plan Premium: Usuario Premium, Élite Premium, Maestría Premium, Centinela Premium
   - Plan Anual: Suscriptor Anual, Compromiso Anual, Leyenda Anual, Aprendiz de Vida

### Niveles y Experiencia

- Sistema de niveles progresivos basado en XP
- Desbloqueables según planes y actividad del usuario
- Visualización de progreso hacia el siguiente nivel

## Uso de la Plataforma

La aplicación está configurada para despliegue en GitHub Pages en el repositorio `WEB-ICFES-Master`:

- **URL de producción**: `https://fravelz.github.io/WEB-ICFES-Master/` (o Firebase Hosting)
- **Configuración**: `next.config.ts` con export estático, Tailwind y Firebase
- **Routing**: Next.js App Router con rutas agrupadas `(dashboard)` y `(auth)`
- **Deploy**: `pnpm run build` y subir `out/` o usar Vercel/Netlify

Ver documentación: `_docs/setup/` y `_docs/integrations/`

## Documentación Adicional

Carpeta: `_docs/`

### Visión General

- **overview/executive-summary.md** - Resumen ejecutivo
- **overview/project-structure.md** - Estructura y arquitectura

### Configuración

- **setup/installation.md** - Instalación paso a paso
- **setup/configuration.md** - Variables de entorno y configuración
- **setup/cheatsheet.md** - Comandos rápidos

### Frontend

- **frontend/architecture.md** - Arquitectura Feature-Based
- **frontend/components-guide.md** - Guía de componentes
- **frontend/styles-guide.md** - Guía de estilos

### Backend y Datos

- **Supabase** - Base de datos y autenticación
- **backend/services-api.md** - API de servicios
- **data/content-schema.md** - Esquema de contenido

### Integraciones

- **integrations/payments.md** - Pasarela de pagos

## Próximas Mejoras Recomendadas

- Crear sistema de reportes y analytics avanzado
- Agregar videos tutoriales integrados
- Agregar exportación de resultados a PDF
- Implementar sistema de notificaciones push
- Integrar IA para recomendaciones personalizadas
- Agregar modo offline
- Crear comunidad y foros de discusión
- Sistema de referidos con recompensas

## Requisitos para Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Contacto

Para sugerencias o reporte de errores, crea un issue en el repositorio de GitHub.

---

**Desarrollo:** Fravelz

**Licencia:** Apache License 2.0
