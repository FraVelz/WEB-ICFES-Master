# Guía Rápida: Centro Unificado de Logros

## 🎯 TL;DR - Lo Más Importante

**¿Qué cambió?**
- Se unificaron gamificación y logros en 1 componente: `UnifiedAchievementsHub`
- La página de logros ahora es más moderna y funcional
- Mejor diseño, más tabs, más información

**¿Dónde está?**
```jsx
// Componente:
import { UnifiedAchievementsHub } from '@/features/logros/components';

// Página completa:
import LogrosPage from '@/features/logros';

// O la página explícita:
import { UnifiedAchievementsPage } from '@/features/logros/pages';
```

## 🔧 Implementación en 30 segundos

### En tu router (App.jsx):

```jsx
import LogrosPage from '@/features/logros';

export default function App() {
  return (
    <Routes>
      {/* ... otras rutas ... */}
      <Route path="/logros" element={<LogrosPage />} />
    </Routes>
  );
}
```

**¡Listo!** La página ya está completa con:
- Hero header con progreso XP
- 4 estadísticas principales
- 5 tabs navegables
- Grid de insignias
- Modal detallado de cada badge

## 📊 Qué hay en cada Tab

| Tab | Contenido |
|-----|-----------|
| 🎯 **Resumen** | Logros recientes, próximo nivel, porcentaje completado |
| 🏅 **Insignias** | Grid de todos los badges con rareza |
| 📈 **Niveles** | Progresión 1-100 con XP necesario |
| 🎪 **Desafíos** | Desafíos diarios con recompensas |
| 📊 **Estadísticas** | Métricas de actividad y logros |

## 🎨 Personalización Rápida

### Cambiar colores principales

En `UnifiedAchievementsHub.jsx`:

```jsx
// Busca esta sección:
const rarityConfig = {
  común: { color: 'from-gray-600 to-gray-400', /* ... */ },
  raro: { color: 'from-blue-600 to-blue-400', /* ... */ },
  // ... modifica los colores aquí
};
```

### Cambiar número de tabs

```jsx
// En la sección de TABS, modifica este array:
{[
  { id: 'overview', label: 'Resumen', icon: faChart },
  { id: 'badges', label: 'Insignias', icon: faMedal },
  // Añade más aquí
].map(tab => (
  // ...
))}
```

## 🔌 Conectar Datos Reales

El componente espera estos props:

```jsx
<UnifiedAchievementsHub
  badges={myBadgesArray}                // Ej: ['first-step', 'fire-streak']
  level={15}                            // 1-100
  totalXP={12500}                       // Número de XP
  xpForNextLevel={15000}                // XP para siguiente nivel
  currentStreak={5}                     // Días consecutivos
  maxStreak={30}                        // Máximo histórico
  totalHours={150}                      // Horas estudiadas
  completedChallenges={8}               // Desafíos hechos
  loading={false}                       // Mostrar spinner
/>
```

## 📝 Ejemplo Completo

```jsx
import { useAuth } from '@/context/AuthContext';
import { useGamificationFirestore } from '@/hooks/useGamificationFirestore';
import { UnifiedAchievementsHub } from '@/features/logros/components';

function MyPage() {
  const { user } = useAuth();
  const { 
    badges, 
    level, 
    totalXP, 
    currentStreak, 
    loading 
  } = useGamificationFirestore(user?.uid);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <UnifiedAchievementsHub
        badges={badges}
        level={level}
        totalXP={totalXP}
        xpForNextLevel={(level * 1000) - totalXP}
        currentStreak={currentStreak}
        maxStreak={45}
        totalHours={200}
        completedChallenges={12}
        loading={loading}
      />
    </div>
  );
}
```

## ✅ Checklist de Integración

- [ ] Importar `LogrosPage` o `UnifiedAchievementsHub`
- [ ] Añadir ruta en el router
- [ ] Verificar que los datos de `useGamificationFirestore` se pasan correctamente
- [ ] Probar en móvil y desktop
- [ ] Personalizar colores si es necesario
- [ ] Actualizar links de navegación

## 🐛 Troubleshooting

**P: Dice "Cargando tus logros..." y no carga**
R: Verifica que `useGamificationFirestore(user?.uid)` retorna datos correctamente

**P: Los badges no se muestran**
R: Asegúrate de pasar el array `badges` correctamente

**P: Quiero cambiar los colores**
R: Edita `rarityConfig` en el componente o pasa estilos vía props

**P: ¿Cómo añado más tabs?**
R: Duplica uno de los tabs existentes y crea el contenido en el condicional `{activeTab === 'myTab'}`

## 📚 Documentación Completa

Ver: `/Documentacion/CENTRO_UNIFICADO_LOGROS_GAMIFICACION.md`

---

**Creado**: 15 de Diciembre, 2024
