# Documentación del Proyecto - ICFES Master

Este documento resume la documentación completa del proyecto.

---

## Documentación Principal

### 1. README.md
Descripción general del proyecto, características, estructura y cómo ejecutar.

**Contiene:**
- Descripción del proyecto
- Características principales
- Contenido de preguntas
- Estructura del proyecto (Feature-Based)
- Cómo ejecutar localmente
- Despliegue en GitHub Pages
- Próximas mejoras

**Para:** Nuevos contribuidores, visión general del proyecto

---

### 2. CONTENIDO_PREGUNTAS_GUIA.md
Guía completa de los 10 componentes de contenido para crear preguntas avanzadas.

**Contiene:**
- Descripción de cada componente (TextContent, ImageContent, TableContent, etc.)
- Ejemplos de uso
- Propiedades de cada componente
- Estructura de datos
- Mejores prácticas
- Checklist de verificación

**Para:** Desarrolladores que necesitan crear preguntas complejas

---

### 3. REFERENCIA_RAPIDA.md
Referencia rápida con plantillas y ejemplos de código listos para copiar.

**Contiene:**
- Matriz de componentes
- Plantillas rápidas (simple y compleja)
- Ejemplos de código por tipo
- Ubicaciones importantes
- Checklist rápido

**Para:** Consulta rápida mientras se trabaja

---

### 4. ESTRUCTURA_DATOS_PREGUNTAS.md
Estructura técnica detallada de cómo organizar datos de preguntas.

**Contiene:**
- Estructura base de pregunta
- Tipos de content blocks
- Ejemplos completos
- Mejores prácticas de imágenes
- Plantillas para nuevas preguntas

**Para:** Entendimiento profundo de la arquitectura

---

### 5. EJEMPLOS_PREGUNTAS_AVANZADAS.js
Archivo con 8 preguntas de ejemplo totalmente funcionales.

**Contiene:**
- Pregunta matemática con imagen y fórmula
- Pregunta de ciencias con tabla
- Pregunta de lenguaje con cita
- Pregunta de sociales con línea de tiempo
- Pregunta matemática con gráfica
- Pregunta de lógica con código
- Pregunta de sociales con mapa
- Pregunta multielemento

**Para:** Referencia de implementación real

---

### 6. SISTEMA_CONTENIDO_AVANZADO.md
Resumen ejecutivo del sistema de contenido.

**Contiene:**
- Resumen del trabajo realizado
- Archivos creados
- Cómo usar el sistema
- Tipos de contenido soportados
- Flujo de trabajo recomendado
- Estadísticas del sistema

**Para:** Visión general del sistema completo

---

### 7. VISUALIZACION_SISTEMA.md
Diagramas y visualizaciones del sistema.

**Contiene:**
- Estructura de carpetas visual
- Flujo de integración
- Matriz de componentes
- Ejemplos de uso antes/después
- Estadísticas

**Para:** Comprender el sistema visualmente

---

## Documentación Adicional

### GITHUB_PAGES_SETUP.md
Cómo configurar GitHub Pages para despliegue.

### GITHUB_PAGES_DEPLOY.md
Pasos para desplegar la aplicación.

### ESTRUCTURA_ARCHIVOS.md
Guía de navegación del proyecto.

### REORGANIZACION_COMPLETADA.md
Histórico de la reorganización del código.

---

## Estructura de Archivos del Proyecto

```
src/
 features/               # Características por dominio
 shared/                 # Componentes compartidos
    components/organisms/QuestionContent/  # 10 componentes
 core/                   # Datos y constantes
 hooks/                  # Hooks personalizados
 App.jsx                 # Componente principal

public/
 images/                 # Archivos de imagen
```

---

## Componentes de Contenido Disponibles

1. **TextContent** - Texto simple
2. **ImageContent** - Imágenes
3. **TableContent** - Tablas
4. **FormulaContent** - Fórmulas matemáticas
5. **ChartContent** - Gráficas
6. **TimelineContent** - Líneas de tiempo
7. **CodeContent** - Código/pseudocódigo
8. **MapContent** - Mapas/diagramas
9. **QuoteContent** - Citas/fragmentos
10. **CompositeContent** - Múltiples elementos

---

## Flujo de Trabajo: Crear una Nueva Pregunta

1. **Lee la documentación**
   - Consulta REFERENCIA_RAPIDA.md (5 min)
   - Si necesitas más detalles: CONTENIDO_PREGUNTAS_GUIA.md

2. **Prepara el contenido**
   - Reúne texto, imágenes, datos
   - Optimiza imágenes (máx 500KB)
   - Valida fórmulas si aplica

3. **Usa una plantilla**
   - Copia de REFERENCIA_RAPIDA.md
   - Personaliza con tu contenido

4. **Estructura los bloques de contenido**
   - Combina TextContent, ImageContent, etc.
   - Valida la estructura JSON

5. **Prueba en el navegador**
   ```bash
   npm run dev
   # Abre http://localhost:5174
   # Selecciona el área y verifica
   ```

6. **Agrega a src/core/data/questions.js**

7. **Commit a Git**
   ```bash
   git add .
   git commit -m "Agregar pregunta: [titulo]"
   git push
   ```

---

## Comandos Útiles

Desarrollo local:
```bash
npm run dev
```

Build de producción:
```bash
npm run build
```

Preview del build:
```bash
npm run preview
```

Linting:
```bash
npm run lint
```

---

## Recursos Externos

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vite.dev
- LaTeX: https://www.latex-tutorial.com/symbols/

---

## Estadísticas del Proyecto

- Componentes de contenido: 10
- Archivos de documentación: 7+
- Líneas de código: 600+
- Líneas de documentación: 1,500+
- Ejemplos funcionales: 8

---

## Siguiente Paso Recomendado

1. Lee README.md para entender el proyecto
2. Lee REFERENCIA_RAPIDA.md para aprender las plantillas
3. Consulta EJEMPLOS_PREGUNTAS_AVANZADAS.js para ver ejemplos reales
4. Crea tu primera pregunta siguiendo el flujo de trabajo
5. Prueba en el navegador

---

## Soporte

- Preguntas técnicas: Revisa la documentación relevante
- Ejemplos: Consulta EJEMPLOS_PREGUNTAS_AVANZADAS.js
- Problemas: Revisa ESTRUCTURA_ARCHIVOS.md o crea un issue en GitHub

---

Proyecto: ICFES Master
Última actualización: 11 de diciembre de 2025
Versión: 1.0
Mantenedor: Fravelz
