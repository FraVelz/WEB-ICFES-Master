# Quick reference cheatsheet

## Terminal commands

### Development

| Action              | Command           |
| ------------------- | ----------------- |
| Start local server  | `pnpm dev`        |
| Clear `.next` & run | `pnpm dev:clean`  |
| Build project       | `pnpm build`      |
| Production preview  | `pnpm start`      |

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
import { useGamification } from '@/features/logros/hooks/useGamification';

const { achievements, totalXP, level, coins, refreshData } = useGamification(userId);
```

**useExam:**

```javascript
import { useExam } from '@/features/exam/hooks/useExam';

const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

### API configuration

```typescript
import API_CONFIG from '@/services/api.config';

// Current mode: supabase | localStorage (see `NEXT_PUBLIC_API_MODE`)
console.log(API_CONFIG.MODE);
```

---
*AI-generated file. Last updated: Monday, May 18, 2026.*
