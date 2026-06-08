# Hoja de referencia rápida (cheatsheet)

## Comandos de terminal

### Desarrollo

| Acción                     | Comando          |
| -------------------------- | ---------------- |
| Iniciar servidor local     | `pnpm dev`       |
| Limpiar `.next` y arrancar | `pnpm dev:clean` |
| Compilar proyecto          | `pnpm build`     |
| Tests                      | `pnpm test`      |
| Vista previa de producción | `pnpm start`     |

### Despliegue web

La plataforma concreta depende del entorno (por ejemplo Vercel, Netlify u otro proveedor).

---

## Fragmentos de código

### Hooks de servicios

**useUserData:**

```javascript
import { useUserData } from '@/features/user/hooks/useUserData';

const { user, loading, updateProfile, refresh } = useUserData();
```

**useProgress** (preferir import directo):

```javascript
import { useProgress } from '@/features/user/hooks/useProgress';

const { progress, areaStats, resetProgress, refresh } = useProgress();
```

**useGamification:**

```javascript
import { useGamification } from '@/hooks/gamification';

const { achievements, totalXP, level, coins, refreshData } = useGamification(userId);
```

**useExam:**

```javascript
import { useExam } from '@/features/exam/hooks/useExam';

const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

### Supabase configurado

```typescript
import { isSupabaseConfigured } from '@/services/persistence';

console.log(isSupabaseConfigured());
```

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
