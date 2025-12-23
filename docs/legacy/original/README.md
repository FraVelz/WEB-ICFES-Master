# Documentación del Proyecto - ICFES Master

Documentación técnica organizada por temáticas. Elige la carpeta que necesites.

---

## Estructura de Documentación

```
NOTAS/
 00_Inicio/                  # Comienza aquí
 01_Arquitectura/            # Estructura y diseño del proyecto
 02_Contenido/               # Preguntas y datos
 03_Servicios/               # Firebase y servicios
 04_Diseño/                  # Estilos y UI
 05_Referencias/             # Guías de referencia
 06_Ejemplos/                # Código de ejemplo
 README.md                   # Este archivo
```

---

## Guía Rápida por Carpeta

### 00_Inicio/ - Comienza Aquí
**Para: Nuevos desarrolladores y configuración inicial**

| Archivo | Descripción |
|---------|------------|
| `README.md` | Índice de toda la documentación |
| `DEVELOPMENT.md` | Cómo clonar, instalar y ejecutar |
| `QUICK_REFERENCE.md` | Comandos npm y atajos comunes |
| `REFERENCIA_RAPIDA.md` | Referencia rápida alternativa |

**Flujo recomendado:**
1. Lee `README.md` (ubicado aquí)
2. Lee `DEVELOPMENT.md` (para empezar)
3. Mantén `QUICK_REFERENCE.md` a mano

---

### 01_Arquitectura/ - Estructura del Proyecto
**Para: Entender cómo está organizado todo**

| Archivo | Descripción |
|---------|------------|
| `ESTRUCTURA_README.md` | Resumen ejecutivo de la arquitectura |
| `ESTRUCTURA_ARCHIVOS.md` | Tabla de ubicación de cada componente |
| `ESTRUCTURA_VISUAL.md` | Visualizaciones ASCII de carpetas |
| `ESTRUCTURA_NUEVA.md` | Detalles técnicos de Feature-Based |
| `ESTRUCTURA_COMPLETA.md` | Guía completa de todas las carpetas |
| `ARQUITECTURA_SERVICIOS.md` | Servicios y Firebase |
| `AUDITORIA_PAGINAS.md` | Análisis de páginas redundantes |

**Cuándo consultarla:**
- Buscas dónde está un componente
- Quieres agregar una nueva página
- Necesitas entender por qué la estructura es así
- Quieres agregar un nuevo feature

---

### 02_Contenido/ - Preguntas y Datos
**Para: Crear y entender preguntas**

| Archivo | Descripción |
|---------|------------|
| `ESTRUCTURA_DATOS_PREGUNTAS.md` | Formato JSON de preguntas |
| `CONTENIDO_PREGUNTAS_GUIA.md` | Guía paso a paso |
| `GUIA_CONTENIDO_PREGUNTAS.md` | Guía detallada alternativa |
| `SISTEMA_CONTENIDO_AVANZADO.md` | 10 tipos de contenido |

**Cuándo consultarla:**
- Vas a agregar nuevas preguntas
- Necesitas entender el formato de datos
- Quieres ver ejemplos de contenido complejo

---

### 03_Servicios/ - Firebase y Servicios
**Para: Entender la lógica de negocio**

| Archivo | Descripción |
|---------|------------|
| `CHECKLIST_FIREBASE.md` | Configuración de Firebase |
| `DOCUMENTACION.md` | Documentación general del sistema |

**Cuándo consultarla:**
- Necesitas configurar Firebase
- Quieres entender cómo funciona el backend
- Necesitas agregar un nuevo servicio

---

### 04_Diseño/ - Estilos y UI
**Para: Desarrollo visual**

| Archivo | Descripción |
|---------|------------|
| `DESIGN_IMPROVEMENTS.md` | Mejoras de diseño implementadas |
| `STYLES_GUIDE.md` | Paleta, tipografía, espaciado |
| `MEJORAS_IMPLEMENTADAS_DICIEMBRE.md` | Cambios recientes |

**Cuándo consultarla:**
- Vas a crear nuevos componentes
- Necesitas mantener consistencia visual
- Quieres ver qué colores usar

---

### 05_Referencias/ - Guías de Referencia
**Para: Búsqueda y consulta**

| Archivo | Descripción |
|---------|------------|
| `RESUMEN.md` | Resumen ejecutivo del proyecto |
| `VISUALIZACION_SISTEMA.md` | Diagramas y flujos |
| `GUIA_DOCUMENTACION.md` | Índice de documentación con matriz |

**Cuándo consultarla:**
- No sabes por dónde empezar
- Necesitas una vista general
- Buscas una guía de referencia

---

### 06_Ejemplos/ - Código de Ejemplo
**Para: Ver implementación práctica**

| Archivo | Descripción |
|---------|------------|
| `EJEMPLOS_PREGUNTAS_AVANZADAS.js` | Código de 8+ preguntas |
| `EJEMPLOS_USO.md` | Ejemplos de uso de componentes |

**Cuándo consultarla:**
- Necesitas un ejemplo de código
- Quieres ver cómo estructurar preguntas
- Buscas patrones de implementación

---

## Matriz de Decisión Rápida

### Necesito...

| Necesidad | Carpeta | Archivo |
|-----------|---------|---------|
| Empezar a desarrollar | 00_Inicio | DEVELOPMENT.md |
| Comandos y atajos | 00_Inicio | QUICK_REFERENCE.md |
| Encontrar un componente | 01_Arquitectura | ESTRUCTURA_ARCHIVOS.md |
| Ver estructura visual | 01_Arquitectura | ESTRUCTURA_VISUAL.md |
| Entender la arquitectura | 01_Arquitectura | ESTRUCTURA_NUEVA.md |
| Agregar una pregunta | 02_Contenido | CONTENIDO_PREGUNTAS_GUIA.md |
| Formato de preguntas | 02_Contenido | ESTRUCTURA_DATOS_PREGUNTAS.md |
| Ejemplos de código | 06_Ejemplos | EJEMPLOS_PREGUNTAS_AVANZADAS.js |
| Configurar Firebase | 03_Servicios | CHECKLIST_FIREBASE.md |
| Colores y estilos | 04_Diseño | STYLES_GUIDE.md |
| Resumen general | 05_Referencias | RESUMEN.md |
| No sé por dónde empezar | 05_Referencias | GUIA_DOCUMENTACION.md |

---

## Recomendaciones de Lectura

### Nuevo Desarrollador (Primera Semana)
1. `00_Inicio/README.md` - Índice general
2. `00_Inicio/DEVELOPMENT.md` - Cómo empezar
3. `01_Arquitectura/ESTRUCTURA_README.md` - Arquitectura rápida
4. `01_Arquitectura/ESTRUCTURA_ARCHIVOS.md` - Dónde está todo
5. `00_Inicio/QUICK_REFERENCE.md` - Comandos útiles

### Para Agregar Preguntas
1. `02_Contenido/CONTENIDO_PREGUNTAS_GUIA.md`
2. `02_Contenido/ESTRUCTURA_DATOS_PREGUNTAS.md`
3. `06_Ejemplos/EJEMPLOS_PREGUNTAS_AVANZADAS.js`
4. `02_Contenido/SISTEMA_CONTENIDO_AVANZADO.md` (si necesitas detalles)

### Para Desarrollo de Features
1. `01_Arquitectura/ESTRUCTURA_NUEVA.md`
2. `01_Arquitectura/ESTRUCTURA_ARCHIVOS.md`
3. `06_Ejemplos/EJEMPLOS_USO.md`
4. `04_Diseño/STYLES_GUIDE.md`

### Para Entender Todo el Sistema
1. `05_Referencias/RESUMEN.md`
2. `01_Arquitectura/ARQUITECTURA_SERVICIOS.md`
3. `05_Referencias/VISUALIZACION_SISTEMA.md`
4. `02_Contenido/SISTEMA_CONTENIDO_AVANZADO.md`

---

## Tips de Navegación

- **Empieza siempre con `00_Inicio/`**
- **Usa Ctrl+F en .md para buscar keywords**
- **Mantén ESTRUCTURA_ARCHIVOS.md abierto mientras desarrollas**
- **Los ejemplos en .js son más claros que en Markdown**
- **Consulta múltiples fuentes para mejor comprensión**
- **Revisa QUICK_REFERENCE.md para comandos rápidos**

---

**Última actualización**: 13 de diciembre de 2025
**Versión**: 2.0 - Organizado por temáticas
