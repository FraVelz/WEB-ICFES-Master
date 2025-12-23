# Guía de Documentación - NOTAS/

Descripción detallada de qué contiene cada archivo de documentación y cuándo consultarlo.

---

## Documentación por Categoría

### 1. INICIACIÓN Y GUÍAS RÁPIDAS

#### README.md
**¿Qué es?** Punto de entrada a toda la documentación
**Cuándo leerlo:** Primer día de trabajo
**Contiene:**
- Índice de documentación
- Cómo navegar los archivos
- Links a secciones principales
- Estructura limpia del proyecto

#### DESARROLLO.md
**¿Qué es?** Guía práctica para desarrollo local
**Cuándo leerlo:** Cuando empiezas a desarrollar
**Contiene:**
- Cómo clonar el proyecto
- Instalación de dependencias
- Comando para iniciar (npm start)
- Estructura de archivo típica
- Uso de hooks personalizados
- Tips de desarrollo

#### QUICK_REFERENCE.md
**¿Qué es?** Referencia rápida de comandos y atajos
**Cuándo leerlo:** Mientras desarrollas
**Contiene:**
- Comandos npm más usados
- Snippets de código común
- Atajos de importación
- Troubleshooting rápido
- Recursos útiles

#### REFERENCIA_RAPIDA.md
**¿Qué es?** Alternativa a QUICK_REFERENCE con otro formato
**Cuándo leerlo:** Como complemento a QUICK_REFERENCE
**Contiene:**
- Estructura alternativa
- Patrones comunes
- Ejemplos rápidos
- Recursos y links

---

### 2. ESTRUCTURA Y ARQUITECTURA

#### ESTRUCTURA_README.md
**¿Qué es?** Resumen ejecutivo de la arquitectura
**Cuándo leerlo:** Segunda lectura (después de README.md)
**Contiene:**
- Estructura escalable implementada
- Guía de navegación
- Cómo importar con alias @/
- Features principales
- FAQ de arquitectura

#### ESTRUCTURA_ARCHIVOS.md
**¿Qué es?** Tabla completa de ubicación de componentes
**Cuándo leerlo:** Cuando buscas un componente específico
**Contiene:**
- Tabla por componente
- Ubicación exacta en carpetas
- Rutas de importación
- Ejemplos de uso
- Dónde agregar nuevos componentes

#### ESTRUCTURA_NUEVA.md
**¿Qué es?** Detalles técnicos y razones de la arquitectura
**Cuándo leerlo:** Para entender el "por qué" de la estructura
**Contiene:**
- Por qué Feature-Based Architecture
- Por qué Atomic Design
- Cómo agregar nuevas features
- Patrones recomendados
- Beneficios de la estructura
- Ejemplo completo: agregar feature "Quiz"

#### ESTRUCTURA_VISUAL.md
**¿Qué es?** Visualizaciones y diagramas de la arquitectura
**Cuándo leerlo:** Para visualizar la estructura
**Contiene:**
- Diagramas ASCII
- Visualización de carpetas
- Flujos de datos
- Ejemplos antes/después
- Estadísticas

#### ESTRUCTURA_COMPLETA.md (NUEVO)
**¿Qué es?** Guía completa de carpetas con temáticas
**Cuándo leerlo:** Para exploración profunda
**Contiene:**
- Estructura de cada carpeta
- Qué contiene cada subcarpeta
- Temáticas de cada archivo
- Tabla de búsqueda rápida
- Checklist de ubicación
- Guía de imports

---

### 3. DATOS Y PREGUNTAS

#### ESTRUCTURA_DATOS_PREGUNTAS.md
**¿Qué es?** Especificación completa del formato de preguntas
**Cuándo leerlo:** Antes de agregar preguntas
**Contiene:**
- Estructura JSON de preguntas
- Tipos de contenido (10 tipos)
- Campos requeridos y opcionales
- Ejemplos de cada tipo
- Validación

#### CONTENIDO_PREGUNTAS_GUIA.md
**¿Qué es?** Guía paso a paso para crear preguntas
**Cuándo leerlo:** Cuando vas a agregar nuevas preguntas
**Contiene:**
- Introducción a tipos de contenido
- 10 componentes de contenido detallados
- Ejemplos para cada tipo
- Mejores prácticas
- Nombres de archivos recomendados
- Estructura de carpetas para imágenes

#### GUIA_CONTENIDO_PREGUNTAS.md
**¿Qué es?** Guía alternativa más detallada
**Cuándo leerlo:** Como complemento a CONTENIDO_PREGUNTAS_GUIA.md
**Contiene:**
- Detalles técnicos de cada tipo
- Ejemplos complejos
- Parámetros específicos
- Casos especiales
- Checklist antes de guardar

#### EJEMPLOS_PREGUNTAS_AVANZADAS.js
**¿Qué es?** Código JavaScript con ejemplos reales
**Cuándo leerlo:** Para ver implementación práctica
**Contiene:**
- 8+ ejemplos de preguntas
- Preguntas con imágenes
- Preguntas con tablas
- Preguntas con fórmulas LaTeX
- Preguntas con gráficas
- Preguntas complejas multi-elemento
- Patrones completos

#### SISTEMA_CONTENIDO_AVANZADO.md
**¿Qué es?** Descripción del sistema de contenido completo
**Cuándo leerlo:** Para entender el ecosistema de contenido
**Contiene:**
- Resumen del sistema
- 10 tipos de contenido
- Cómo usarlos juntos
- Ejemplos de composición
- Validación
- Casos de uso

---

### 4. ARQUITECTURA Y SERVICIOS

#### ARQUITECTURA_SERVICIOS.md
**¿Qué es?** Descripción de servicios y Firebase
**Cuándo leerlo:** Para entender la lógica de negocio
**Contiene:**
- Diagrama de servicios
- Patrones de Firebase
- Estructura de Firestore
- Cómo agregar nuevos servicios
- Flujo de datos
- Ejemplos de uso

#### CHECKLIST_FIREBASE.md
**¿Qué es?** Checklist de configuración de Firebase
**Cuándo leerlo:** Para verificar que Firebase está correctamente configurado
**Contiene:**
- Variables de entorno necesarias
- Setup inicial
- Configuración de autenticación
- Reglas de Firestore
- Verificación de setup

---

### 5. DISEÑO Y MEJORAS

#### DESIGN_IMPROVEMENTS.md
**¿Qué es?** Registro de mejoras de diseño implementadas
**Cuándo leerlo:** Para ver qué mejoras UI/UX se han hecho
**Contiene:**
- Cambios visuales
- Optimizaciones de UX
- Paleta de colores
- Tipografía
- Componentes mejorados

#### STYLES_GUIDE.md
**¿Qué es?** Guía de estilos y diseño
**Cuándo leerlo:** Antes de crear componentes nuevos
**Contiene:**
- Paleta de colores oficial
- Tipografía
- Espaciado recomendado
- Componentes estilizados
- Responsive design patterns

#### MEJORAS_IMPLEMENTADAS_DICIEMBRE.md
**¿Qué es?** Registro de cambios recientes
**Cuándo leerlo:** Para ver qué es nuevo en diciembre
**Contiene:**
- Features nuevos
- Bug fixes
- Optimizaciones
- Refactoring realizado
- Cambios en componentes

---

### 6. AUDITORÍA Y DOCUMENTACIÓN

#### AUDITORIA_PAGINAS.md
**¿Qué es?** Análisis de páginas y componentes redundantes
**Cuándo leerlo:** Para entender qué páginas existen y cuáles son esenciales
**Contiene:**
- Listado de todas las páginas
- Detección de redundancias
- Páginas principales
- Dashboards y progreso
- Decisiones de consolidación

#### DOCUMENTACION.md
**¿Qué es?** Documentación general del sistema
**Cuándo leerlo:** Como referencia general
**Contiene:**
- Resumen del proyecto
- Documentación principal
- Estructura de archivos
- Componentes disponibles
- Flujo de trabajo
- Comandos útiles
- Estadísticas

#### RESUMEN.md
**¿Qué es?** Resumen ejecutivo del proyecto
**Cuándo leerlo:** Para entender el proyecto en general
**Contiene:**
- Qué es ICFES Master
- Características principales
- Tecnologías usadas
- Estructura de carpetas
- Estadísticas
- Próximos pasos

---

### 7. EJEMPLOS Y USO

#### EJEMPLOS_USO.md
**¿Qué es?** Ejemplos prácticos de cómo usar componentes
**Cuándo leerlo:** Cuando necesitas aprender a usar un componente
**Contiene:**
- Cómo usar componentes
- Cómo usar hooks
- Cómo usar servicios
- Snippets de código
- Patrones comunes

#### VISUALIZACION_SISTEMA.md
**¿Qué es?** Visualizaciones del sistema completo
**Cuándo leerlo:** Para ver diagramas y flujos
**Contiene:**
- Estructura visual
- Flujos de usuarios
- Diagramas de datos
- Matriz de componentes
- Ejemplos visuales

---

## Matriz de Decisión

### Necesito entender...

| Necesidad | Archivo Recomendado |
|-----------|-------------------|
| El proyecto en general | RESUMEN.md |
| Cómo empezar a desarrollar | DESARROLLO.md |
| Dónde está un componente | ESTRUCTURA_ARCHIVOS.md |
| Por qué la arquitectura es así | ESTRUCTURA_NUEVA.md |
| Cómo crear una pregunta | CONTENIDO_PREGUNTAS_GUIA.md |
| Cómo agregar una feature | ESTRUCTURA_NUEVA.md |
| Cómo configurar Firebase | CHECKLIST_FIREBASE.md |
| Qué cambios hay en diciembre | MEJORAS_IMPLEMENTADAS_DICIEMBRE.md |
| Cómo usar un componente | EJEMPLOS_USO.md |
| Los servicios y su lógica | ARQUITECTURA_SERVICIOS.md |
| Los estilos del proyecto | STYLES_GUIDE.md |
| Comandos rápidos | QUICK_REFERENCE.md |
| Estructura visual | ESTRUCTURA_VISUAL.md |

---

## Flujo de Lectura Recomendado

### Para Nuevo Desarrollador
1. Lee **README.md** (índice)
2. Lee **RESUMEN.md** (overview del proyecto)
3. Lee **DESARROLLO.md** (cómo empezar)
4. Lee **ESTRUCTURA_README.md** (guía rápida)
5. Explora **ESTRUCTURA_ARCHIVOS.md** (busca componentes)
6. Lee **QUICK_REFERENCE.md** (comandos)

### Para Agregar Preguntas
1. Lee **CONTENIDO_PREGUNTAS_GUIA.md** (primero)
2. Consulta **ESTRUCTURA_DATOS_PREGUNTAS.md** (formato)
3. Mira **EJEMPLOS_PREGUNTAS_AVANZADAS.js** (código)
4. Revisa **GUIA_CONTENIDO_PREGUNTAS.md** (si necesitas detalles)

### Para Agregar Feature
1. Lee **ESTRUCTURA_NUEVA.md** (arquitectura)
2. Consulta **ESTRUCTURA_ARCHIVOS.md** (dónde va)
3. Revisa **EJEMPLOS_USO.md** (patrones)
4. Mira **ARQUITECTURA_SERVICIOS.md** (si necesita servicios)

### Para Entender Diseño
1. Lee **STYLES_GUIDE.md** (primero)
2. Revisa **DESIGN_IMPROVEMENTS.md** (cambios)
3. Consulta **ESTRUCTURA_VISUAL.md** (visualizaciones)

---

## Tips de Navegación

- **Usa Ctrl+F** en archivos .md para buscar keywords
- **Empieza con README.md** siempre
- **Mantén ESTRUCTURA_ARCHIVOS.md** abierto mientras desarrollas
- **QUICK_REFERENCE.md** es tu mejor amigo
- **Los ejemplos en .js** son más claros que en Markdown
- **Consulta múltiples fuentes** para entender mejor

---

**Última actualización**: 13 de diciembre de 2025
**Versión**: 1.0
