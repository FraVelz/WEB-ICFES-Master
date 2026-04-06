# Quick Reference Cheatsheet

## Terminal Commands

### Development

| Action             | Command      |
| ------------------ | ------------ |
| Start local server | `pnpm dev`   |
| Build project      | `pnpm build` |
| Production preview | `pnpm start` |

### Web Deployment

Current platform: CubePath

---

## Code Snippets

### Service Hooks

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

### API Configuration

```javascript
import API_CONFIG from '@/services/api.config';

// Current mode: supabase | localStorage
console.log(API_CONFIG.MODE);
```
