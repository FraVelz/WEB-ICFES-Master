# Quick reference cheatsheet

## Terminal commands

### Development

| Action              | Command          |
| ------------------- | ---------------- |
| Start local server  | `pnpm dev`       |
| Clear `.next` & run | `pnpm dev:clean` |
| Build project       | `pnpm build`     |
| Tests               | `pnpm test`      |
| Production preview  | `pnpm start`     |

### Web deployment

The hosting target depends on your environment (e.g. Vercel, Netlify, or another provider).

---

## Code snippets

### Service hooks

**useUserData:**

```javascript
import { useUserData } from '@/features/user/hooks/useUserData';

const { user, loading, updateProfile, refresh } = useUserData();
```

**useProgress:**

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

### Supabase configured

```typescript
import { isSupabaseConfigured } from '@/services/persistence';

console.log(isSupabaseConfigured());
```

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
