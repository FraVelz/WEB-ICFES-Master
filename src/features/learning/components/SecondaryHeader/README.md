# Mobile Header Duolingo - Documentación

## 📱 Descripción General

El **MobileHeader** es un componente interactivo tipo Duolingo creado para la página de Ruta de Aprendizaje. Se muestra solo en dispositivos móviles (hidden en desktop) y contiene 3 elementos principales clickeables que despliegan modales con información detallada del usuario.

## 🎯 Características

### 1. **Área Actual** (Primer Elemento)
- **Ícono**: Representa el área de estudio seleccionada
- **Funcionalidad**: Al hacer click, muestra modal con todas las áreas disponibles
- **Interactividad**: 
  - Selecciona un área diferente
  - El color del ícono cambia según el área
  - Muestra nombre abreviado del área

**Áreas disponibles:**
- 📚 Lectura Crítica (Azul)
- 🔢 Matemáticas (Verde)
- 🧪 Ciencias Naturales (Púrpura)
- 🌍 Sociales y Ciudadanas (Naranja)
- 📋 Examen Completo ICFES (Rosa)

### 2. **Racha de Días** (Segundo Elemento)
- **Ícono**: 🔥 (Fuego)
- **Funcionalidad**: Muestra información detallada de la racha del usuario
- **Modal incluye:**
  - Racha actual en días
  - Racha máxima registrada
  - Progreso hacia insignia de 7 días
  - Barra de progreso visual
  - Estadísticas: sesiones iniciadas y lecciones completadas
  - Beneficios desbloqueados (si alcanzó 7 días)
  - 🏆 Insignia visible cuando está desbloqueada

**Insignia de 7 Días - Beneficios:**
- +50% XP en lecciones
- +25% monedas virtuales
- Acceso a área premium

### 3. **Dinero Virtual** (Tercer Elemento)
- **Ícono**: 💰 (Monedas)
- **Funcionalidad**: Muestra saldo y opciones relacionadas
- **Modal incluye:**
  - Saldo actual en monedas
  - Botón "Ir a la Tienda" (redirige a `/store`)
  - Opciones futuras: Recompensas diarias y Estadísticas
  - Información sobre cómo ganar monedas

## 📂 Estructura de Archivos

```
src/features/learning/components/MobileHeader/
├── index.jsx          # Componente principal
├── index.js           # Archivo de exportación
├── AreasModal.jsx     # Modal para seleccionar áreas
├── StreakModal.jsx    # Modal para información de racha
└── CoinsModal.jsx     # Modal para dinero virtual
```

## 🚀 Uso

### Importar el componente

```jsx
import { MobileHeader } from '@/features/learning/components/MobileHeader';

// O
import { MobileHeader } from '@/features/learning/components';
```

### Implementar en una página

```jsx
export const MiPagina = () => {
  return (
    <div>
      <MobileHeader currentArea="lectura-critica" />
      {/* Resto del contenido */}
    </div>
  );
};
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `currentArea` | string | 'lectura-critica' | Área seleccionada actualmente |

## 🔧 Personalización

### Cambiar colores de áreas

Edita `/src/core/constants/areaInfo.js`:

```javascript
export const AREA_INFO = {
  'lectura-critica': { 
    name: 'Lectura Crítica', 
    color: 'from-blue-400 to-blue-600'  // Cambiar aquí
  },
  // ...
};
```

### Modificar beneficios de insignia

En `StreakModal.jsx`, línea ~115:

```jsx
<ul className="text-sm text-slate-300 space-y-1">
  <li className="flex items-center gap-2">
    <span className="text-amber-400">✓</span> +50% XP en lecciones
  </li>
  {/* Agregar o editar beneficios aquí */}
</ul>
```

### Cambiar rutas de navegación

En `CoinsModal.jsx`, modifica la función `handleGoToStore`:

```javascript
const handleGoToStore = () => {
  navigate('/store');  // Cambiar ruta aquí
  onClose();
};
```

## 📊 Datos Utilizados

El componente utiliza el hook `useGamification` para obtener:

- `currentStreak`: Días consecutivos de racha
- `maxStreak`: Racha máxima histórica
- `coins`: Monedas virtuales actuales
- `profile`: Datos del perfil incluyendo:
  - `sessionsStarted`: Sesiones iniciadas
  - `lessonsCompleted`: Lecciones completadas

## 🎨 Estilos

- Usa **Tailwind CSS** para estilos
- Colores personalizados por área
- Animaciones smooth con `transition-all`
- Gradientes lineales (`bg-linear-to-*`)
- **Solo visible en móvil** (clase `md:hidden`)

## 🔗 Integraciones

### Hooks utilizados:
- `useGamification` - Obtener datos de gamificación
- `useNavigate` - Navegación en CoinsModal
- `useState` - Manejo de estado de modales

### Iconos de FontAwesome:
- `faBook` - Área
- `faFire` - Racha
- `faCoins` - Dinero virtual
- `faTimes` - Cerrar modal
- `faMedal` - Insignia
- `faShoppingCart` - Tienda
- `faGift` - Recompensas
- `faChartLine` - Estadísticas

## 💡 Ejemplos de Extensión

### Agregar animación al desbloquear insignia

En `StreakModal.jsx`:

```jsx
{isBadgeUnlocked && (
  <div className="bg-linear-to-r... animate-pulse">
    {/* Contenido */}
  </div>
)}
```

### Conectar con ruta de área

En `MobileHeader`:

```jsx
const handleSelectArea = (areaKey) => {
  setSelectedArea(areaKey);
  navigate(`/learning/${areaKey}`); // Agregar navegación
};
```

## ⚠️ Notas Importantes

1. El header se oculta automáticamente en pantallas mayores a 768px (md)
2. Los modales se cierran automáticamente al hacer clic en un área o botón
3. La insignia de 7 días se desbloquea automáticamente cuando `currentStreak >= 7`
4. Los datos se obtienen en tiempo real del hook de gamificación
5. El componente está optimizado con `useMemo` para evitar re-renders innecesarios

## 🐛 Troubleshooting

### El header no aparece
- Verifica que esté importado correctamente
- Asegúrate de estar viendo en dispositivo móvil o ventana pequeña
- Revisa que no esté oculto por CSS

### Los modales no se abren
- Confirma que `useNavigate` está disponible (dentro de Router)
- Verifica la consola para errores
- Revisa que los hooks tengan datos disponibles

### Datos no se actualizan
- Verifica que `useGamification` esté funcionando
- Revisa la conexión con Firebase
- Comprueba que el usuario esté autenticado

## 📝 Futuras Mejoras

- [ ] Animación al desbloquear insignia
- [ ] Sistema de logros más detallado
- [ ] Historial de racha con calendario
- [ ] Tienda integrada en el modal
- [ ] Push notifications para hitos
- [ ] Comparativa con amigos

