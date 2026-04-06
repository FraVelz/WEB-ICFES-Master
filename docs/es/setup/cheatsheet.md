# Hoja de Referencia Rápida (Cheatsheet)

## Comandos de Terminal

### Desarrollo

| Acción                 | Comando      |
| ---------------------- | ------------ |
| Iniciar servidor local | `pnpm dev`   |
| Compilar proyecto      | `pnpm build` |
| Preview de producción  | `pnpm start` |

### Despliegue Web

Plataforma Actual:

- CubePath

---

## Snippets de Código

### Hooks de Servicios

**useUserData:**

```javascript
import { useUserData } from '@/features/user/hooks/useUserData';

const { user, loading, updateProfile, refresh } = useUserData();
```

**useProgress:**

```javascript
import { useProgress } from '@/features/progress/hooks/useProgress';

const { progress, areaStats, resetProgress, refresh } = useProgress();
```

**useGamification:**

```javascript
import { useGamification } from '@/features/logros/hooks/useGamification';

const { achievements, totalXP, level, coins, refreshData } = useGamification(userId);
```

**useExam:**

```javascript
import { useExam } from '@/features/exam/hooks/useExam';

const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

### Configuración de API

```javascript
import API_CONFIG from '@/services/api.config';

// Modo actual: supabase | localStorage
console.log(API_CONFIG.MODE);
```
