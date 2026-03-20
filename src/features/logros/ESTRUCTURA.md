# Estructura de Logros - Organización Modular

## Árbol de Directorios

```
/src/features/logros/
 index.tsx                          # Componente principal
 utils/
    badgeUtils.js                 # Utilidades de categorización
 constants/
     badges.js                      # Re-exports principales
     categoriesConfig.js            # Configuración de categorías
     index.ts                       # Consolidador de logros
     badgesByCategory.js            # Re-exports por categoría
     categories/                    # Módulos individuales por categoría
         index.ts                   # Index de categorías
         firstSteps.js              # 4 logros
         streaks.js                 # 4 logros
         academic.js                # 6 logros
         excellence.js              # 4 logros
         plans.js                   # 13 logros
         collaboration.js           # 5 logros
         challenges.js              # 5 logros
         improvement.js             # 4 logros
         knowledge.js               # 6 logros
         milestones.js              # 8 logros
         gamification.js            # 8 logros
         rigor.js                   # 6 logros
         strategy.js                # 5 logros
```

## Flujo de Importaciones

```
badges.js (re-exports)
    ↓
    → badgesByCategory.js (agrupa por categoría)
           ↓
           → categories/index.ts
               → firstSteps.js
               → streaks.js
               → academic.js
               → excellence.js
               → plans.js
               → collaboration.js
               → challenges.js
               → improvement.js
               → knowledge.js
               → milestones.js
               → gamification.js
               → rigor.js
               → strategy.js

    → categoriesConfig.js (configuración de categorías)

    → index.ts (consolida todo)
        → LOGROS_DISPONIBLES (todos los logros combinados)
        → BADGE_CATEGORIES (todas las categorías)
```

## Estadísticas

| Categoría              | Logros   | Archivo          |
| ---------------------- | -------- | ---------------- |
| Primeros Pasos         | 4        | firstSteps.js    |
| Rachas                 | 4        | streaks.js       |
| Logros Académicos      | 6        | academic.js      |
| Excelencia             | 4        | excellence.js    |
| Planes y Suscripciones | 13       | plans.js         |
| Colaboración           | 5        | collaboration.js |
| Desafíos Especiales    | 5        | challenges.js    |
| Mejora Continua        | 4        | improvement.js   |
| Conocimiento Profundo  | 6        | knowledge.js     |
| Hitos Especiales       | 8        | milestones.js    |
| Gamificación Avanzada  | 8        | gamification.js  |
| Rigor Académico        | 6        | rigor.js         |
| Estrategia y Táctica   | 5        | strategy.js      |
| **TOTAL**              | **100+** | **13 archivos**  |

## Ventajas de la Nueva Estructura

**Modularidad**: Cada categoría en su propio archivo
**Escalabilidad**: Fácil agregar nuevos logros a cualquier categoría
**Mantenibilidad**: Cada archivo es pequeño y enfocado (~40-60 líneas)
**Reutilización**: Los módulos pueden importarse independientemente
**Claridad**: La estructura refleja la organización de categorías
**Performance**: Los imports se pueden optimizar según necesidad

## Cómo Usar

### Importar todos los logros:

```javascript
import {
  LOGROS_DISPONIBLES,
  BADGE_CATEGORIES,
} from '@/features/logros/constants';
```

### Importar una categoría específica:

```javascript
import { FIRST_STEPS_BADGES } from '@/features/logros/constants/categories/firstSteps';
```

### Importar múltiples categorías:

```javascript
import {
  ACADEMIC_BADGES,
  EXCELLENCE_BADGES,
} from '@/features/logros/constants/categories';
```

## Agregar Nuevo Logro

1. Abre el archivo de categoría correspon.js
2. Agrega el nuevo logro al objeto exportado
3. Asegúrate de que el ícono esté importado
4. El logro estará disponible automáticamente en todo el sistema

Ejemplo:

```javascript
// En categories/firstSteps.js
NEW_ACHIEVEMENT: {
  id: 'NEW_ACHIEVEMENT',
  name: 'Mi Nuevo Logro',
  icon: faPlay,
  description: 'Descripción del logro',
  requirement: 'Requisito para desbloquear',
  category: 'primeros_pasos'
}
```

## Dependencias Entre Archivos

- `index.tsx` → importa desde `./constants` → usa `LOGROS_DISPONIBLES` y `BADGE_CATEGORIES`
- `constants/index.ts` → consolida todos los exports
- `constants/badgesByCategory.js` → re-exporta desde `categories/`
- `constants/categoriesConfig.js` → define estilos y configuración
- `categories/*.js` → cada archivo define un conjunto de logros

## Notas Importantes

- Todos los iconos usan FontAwesome Free Solid
- Cada logro debe tener un `id` único
- La `category` debe coincidir con la clave en `BADGE_CATEGORIES`
- Los archivos de categoría no tienen dependencias internas
- Los imports se propagan hacia arriba a través de `index.ts`
