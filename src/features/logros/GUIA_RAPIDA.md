# Guía Rápida - Sistema de Logros

## Tabla de Contenidos

- [Estructura](#estructura)
- [Importaciones](#importaciones)
- [Agregar Logros](#agregar-logros)
- [Modificar Categorías](#modificar-categorías)

## Estructura

```
logros/
 index.jsx                  # Componente principal
 utils/badgeUtils.js        # Funciones de utilidad
 constants/
    badges.js              # Re-exports principales
    index.js               # Consolidador
    badgesByCategory.js    # Agrupa por categoría
    categoriesConfig.js    # Config de categorías
    categories/
        firstSteps.js      # Primeros Pasos
        streaks.js         # Rachas
        academic.js        # Logros Académicos
        excellence.js      # Excelencia
        plans.js           # Planes
        collaboration.js   # Colaboración
        challenges.js      # Desafíos
        improvement.js     # Mejora Continua
        knowledge.js       # Conocimiento
        milestones.js      # Hitos
        gamification.js    # Gamificación
        rigor.js           # Rigor
        strategy.js        # Estrategia
        index.js           # Index
 ESTRUCTURA.md              # Esta documentación
```

## Importaciones

### Opción 1: Todo en uno (recomendado)

```javascript
import {
  LOGROS_DISPONIBLES,
  BADGE_CATEGORIES,
} from '@/features/logros/constants';

// Usar:
const allBadges = LOGROS_DISPONIBLES;
const categories = BADGE_CATEGORIES;
```

### Opción 2: Categoría específica

```javascript
import { ACADEMIC_BADGES } from '@/features/logros/constants/categories/academic';

// Usar:
const academicBadges = ACADEMIC_BADGES;
```

### Opción 3: Múltiples categorías

```javascript
import {
  ACADEMIC_BADGES,
  EXCELLENCE_BADGES,
} from '@/features/logros/constants/categories';

// Usar:
const badges = { ...ACADEMIC_BADGES, ...EXCELLENCE_BADGES };
```

## Agregar Logros

### 1. En categoría existente

Abre el archivo de categoría (ej: `constants/categories/academic.js`):

```javascript
import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const ACADEMIC_BADGES = {
  // ... logros existentes ...

  // Nuevo logro
  MY_NEW_BADGE: {
    id: 'MY_NEW_BADGE',
    name: 'Mi Nuevo Logro',
    icon: faPlay,
    description: 'Descripción del logro',
    requirement: 'Requisito para desbloquear',
    category: 'logros',
  },
};
```

### 2. En nueva categoría

1. Crea archivo: `constants/categories/myCategory.js`

```javascript
import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const MY_CATEGORY_BADGES = {
  FIRST_ACHIEVEMENT: {
    id: 'FIRST_ACHIEVEMENT',
    name: 'Mi Primer Logro',
    icon: faPlay,
    description: 'Descripción',
    requirement: 'Requisito',
    category: 'mi_categoria',
  },
};
```

2. Agrega export en `categories/index.js`:

```javascript
export { MY_CATEGORY_BADGES } from './myCategory';
```

3. Agrega categoría en `categoriesConfig.js`:

```javascript
export const BADGE_CATEGORIES_CONFIG = {
  // ... categorías existentes ...

  mi_categoria: {
    title: 'Mi Categoría',
    icon: faPlay,
    color: 'from-blue-500 to-cyan-500',
  },
};
```

## Modificar Categorías

### Cambiar nombre de categoría

En `constants/categoriesConfig.js`:

```javascript
const categoryKey = {
  // Cambiar el nombre de la clave si es necesario
  title: 'Mi Nuevo Título', // ← Cambiar aquí el título visible
  icon: faTrophy, // ← Cambiar ícono si lo deseas
  color: 'from-blue-500 to-cyan-500', // ← Cambiar colores si lo deseas
};
```

### Cambiar ícono

1. Abre el archivo de categoría
2. Importa el nuevo ícono de FontAwesome:

```javascript
import { faNewIcon } from '@fortawesome/free-solid-svg-icons';
```

3. Actualiza el logro:

```javascript
BADGE_ID: {
  ...
  icon: faNewIcon,  // ← Actualizado
  ...
}
```

### Cambiar colores

En `constants/categoriesConfig.js`:

```javascript
nombreCategoria: {
  title: 'Título',
  icon: faIcon,
  color: 'from-red-500 to-pink-500'  // ← Cambiar gradiente
}
```

## Colores Disponibles (Tailwind)

Usa gradientes de Tailwind en formato `from-COLOR-500 to-COLOR-500`:

- `from-blue-500 to-cyan-500` (Azul)
- `from-red-500 to-pink-500` (Rojo)
- `from-green-500 to-emerald-500` (Verde)
- `from-purple-500 to-pink-500` (Púrpura)
- `from-yellow-500 to-amber-500` (Amarillo)
- `from-orange-500 to-red-500` (Naranja)
- `from-indigo-500 to-violet-500` (Índigo)
- `from-teal-500 to-cyan-500` (Teal)
- `from-pink-500 to-rose-500` (Rosa)
- `from-slate-500 to-gray-500` (Gris)

## Iconos FontAwesome (Solid)

Algunos iconos disponibles:

- `faPlay` - Reproducir
- `faBook` - Libro
- `faTrophy` - Trofeo
- `faStar` - Estrella
- `faCrown` - Corona
- `faFire` - Fuego
- `faBolt` - Rayo
- `faRocket` - Cohete
- `faHeart` - Corazón
- `faAward` - Premio
- etc.

Para más: https://fontawesome.com/search?o=r&m=free&s=solid

## Checklist para Agregar Logro

- [ ] Archivo de categoría existe
- [ ] ID único en el sistema
- [ ] Nombre descriptivo
- [ ] Ícono importado correctamente
- [ ] Descripción clara
- [ ] Requisito específico
- [ ] Categoría correcta
- [ ] Exportado en `categories/index.js` (si es nueva categoría)
- [ ] Categoría en `categoriesConfig.js` (si es nueva)

## Verificación

```bash
# Ver errores de compilación
npm run lint

# Ver estructura de archivos
find src/features/logros -type f -name "*.js"

# Contar total de logros
grep -r "id: '" src/features/logros/constants/categories --include="*.js" | wc -l
```

## Soporte

Para dudas o problemas:

1. Revisa `ESTRUCTURA.md` para detalles técnicos
2. Verifica que los imports sean correctos
3. Asegúrate que los ícones existan en FontAwesome Free Solid
4. Comprueba que el `id` y `category` sean válidos
