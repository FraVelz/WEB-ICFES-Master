# Services Architecture, Data Layer and Learning Module

Unified document describing the services architecture, data layer, and lesson/quiz structure of the learning module.

## Table of Contents

- [Overview](#overview)
- [Main Components](#main-components)
- [Custom Hooks](#custom-hooks)
- [Supabase Table Structure](#supabase-table-structure)
- [Learning Module and Quizzes](#learning-module-and-quizzes)
- [Data Flow](#data-flow)
- [Migration Between Modes](#migration-between-modes)
- [Exports from `@/services`](#exports-from-services)

---

## Overview

The ICFES application uses a **decoupled architecture** that allows switching between **Supabase** (production) and **localStorage** (development without backend) without modifying components. The mode is controlled via `NEXT_PUBLIC_API_MODE`.

```txt
         React Components
     (UserProfilePage, ExamPage, LearningRoadmap, etc)

              ↓

       Custom Hooks
   (useUserData, useProgress, useGamification, useExam)

              ↓

    Persistence layer + Supabase services
  (userPersistence, progressPersistence, examPersistence, gamificationPersistence, *SupabaseService, LearningService, …)

              ↓

   api.config.ts (MODE: supabase | localStorage)
              ↓
   ┌──────────┴──────────┐
   ↓                     ↓
Supabase              localStorage / roadmapData
(PostgreSQL)            (utils, static data)
```

---

## Main Components

### 1. **api.config.ts** (Central Configuration)

- **Location**: `src/services/api.config.ts`
- **Purpose**: Centralizes data persistence mode
- **Supported modes**:
  - `supabase` (default): PostgreSQL + Supabase Auth
  - `localStorage`: Local development without backend

**Environment Variables** (Next.js uses `NEXT_PUBLIC_` prefix):

```txt
NEXT_PUBLIC_API_MODE=supabase     # 'supabase' | 'localStorage'
```

### 2. **Removed legacy layer**

The generic `BaseService` and `SupabaseService` classes under `src/services/` were removed; the app uses `@/services/persistence` and concrete `*SupabaseService` modules.

### 3. **Supabase Services** (`src/services/supabase/`)

Services that connect directly to PostgreSQL tables in Supabase:

| Service                         | Table               | Description                                        |
| ------------------------------- | ------------------- | -------------------------------------------------- |
| **UserSupabaseService**         | `users`             | Profile, username, bio, virtualMoney, profileImage |
| **ProgressSupabaseService**     | `user_progress`     | totalAttempts, totalCorrect, streakDays, areaStats |
| **GamificationSupabaseService** | `user_gamification` | XP, level, totalCoins, badges, achievements        |
| **ExamSupabaseService**         | `exam_results`      | Completed exams, scores, answers                   |
| **LearningSupabaseService**     | `learning_content`  | Lessons by area, content, quizzes                  |

### 4. **`gamificationPersistence`**

- **Location**: `src/services/persistence/gamificationPersistence.ts`
- **Purpose**: Single entry for gamification on Supabase or `GamificationLocalService` (`src/services/gamification/`) depending on `API_CONFIG.MODE`
- **API**: `addXP()`, `addCoins()`, `spendCoins()`, `getProfile()` (delegate to `GamificationSupabaseService` or `GamificationLocalService`)

### 5. **Feature modules and `persistence` layer**

| Feature      | Main code | Description |
| ------------ | --------- | ----------- |
| **user**     | `src/services/persistence/userPersistence.ts` | `useUserData` uses `loadUserProfile`, `patchUserProfile`, etc. |
| **progress** | `src/services/persistence/progressPersistence.ts` | `useProgress` uses `loadProgressViewState`, etc. |
| **exam**     | `src/services/persistence/examPersistence.ts` | `useExam` uses `getExamById`, `resetUserExams`, … |
| **logros**   | `GamificationSupabaseService` + localStorage; `gamificationPersistence` in lessons | `useGamification`; `LessonQuizModal` uses **`gamificationPersistence`** |
| **learning** | `src/features/learning/services/LearningService.ts` | Supabase (`learning_content`) or static roadmap data |
| **store**    | `src/services/store/` (`SubscriptionPlanService`, `PlanScheduleService`) | Plans and scheduling |
| **auth**     | `src/context/AuthContext.tsx`, pages under `features/auth/` | Supabase/OAuth session; no `AuthService` stub |

---

## Custom Hooks

Hooks abstract the logic and select the service based on `API_CONFIG.MODE`:

### **useUserData()**

```javascript
const { user, loading, updateProfile, updateUsername, updateBio, updateProfileImage, addMoney, spendMoney, refresh } =
  useUserData();
```

- **Supabase**: UserSupabaseService
- **localStorage**: `@/services/persistence` (implementation in `src/storage/userProfile`)

### **useProgress()**

```javascript
const { progress, areaStats, recommendations, attemptHistory, resetProgress, refresh } = useProgress();
```

- **Supabase**: ProgressSupabaseService
- **localStorage**: `@/services/persistence` (implementation in `src/storage/progressStorage`)

### **useGamification(userId)**

```javascript
const { achievements, totalXP, level, coins, currentStreak, updateAchievementProgress, refreshData } =
  useGamification(userId);
```

- **Supabase**: GamificationSupabaseService
- **localStorage**: localStorage (`icfes_gamification`, `icfes_streak_dates`)

### **useExam(examId)**

```javascript
const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

- **Supabase**: ExamSupabaseService
- **localStorage**: `getStoredExams()` from progressStorage

---

## Supabase Table Structure

### `users`

| Column        | Type        | Description             |
| ------------- | ----------- | ----------------------- |
| id            | uuid        | User ID (Supabase Auth) |
| email         | text        | Email                   |
| display_name  | text        | Display name            |
| username      | text        | Username                |
| bio           | text        | Biography               |
| profile_image | text        | URL or base64 of photo  |
| virtual_money | int         | Virtual coins           |
| created_at    | timestamptz | Creation date           |
| updated_at    | timestamptz | Update date             |

### `user_progress`

| Column             | Type  | Description     |
| ------------------ | ----- | --------------- |
| user_id            | uuid  | FK to users     |
| total_attempts     | int   | Total attempts  |
| total_correct      | int   | Correct answers |
| percentage         | float | Percentage      |
| streak_days        | int   | Streak days     |
| area_stats         | jsonb | Stats per area  |
| last_activity_date | date  | Last activity   |

### `user_gamification`

| Column        | Type  | Description          |
| ------------- | ----- | -------------------- |
| user_id       | uuid  | FK to users          |
| xp / total_xp | int   | Total experience     |
| level         | int   | Current level        |
| total_coins   | int   | Coins earned         |
| spent_coins   | int   | Coins spent          |
| badges        | jsonb | Unlocked badges      |
| achievements  | jsonb | Achievement progress |
| xp_history    | jsonb | XP history           |
| coins_history | jsonb | Coins history        |

### `exam_results`

| Column          | Type        | Description     |
| --------------- | ----------- | --------------- |
| id              | text        | Exam ID         |
| user_id         | uuid        | FK to users     |
| exam_type       | text        | practice        |
| score           | int         | Score           |
| correct_answers | int         | Correct answers |
| total_questions | int         | Total questions |
| time_spent      | int         | Time in seconds |
| completed_at    | timestamptz | Completion date |
| questions       | jsonb       | Saved answers   |

### `learning_content`

| Column      | Type  | Description                                                                        |
| ----------- | ----- | ---------------------------------------------------------------------------------- |
| id          | uuid  | Unique ID (auto-generated)                                                         |
| area        | text  | Area: `matematicas`, `lectura_critica`, `sociales`, `ciencias_naturales`, `ingles` |
| order_index | int   | Lesson order (1, 2, 3...)                                                          |
| published   | bool  | `true` to show, `false` to hide                                                    |
| content     | jsonb | Content (title, summary, body, questions, quiz)                                    |

**Area mapping** (app → DB):

| Area in App (ID)      | Value in DB          |
| --------------------- | -------------------- |
| `lectura-critica`     | `lectura_critica`    |
| `matematicas`         | `matematicas`        |
| `sociales-ciudadanas` | `sociales`           |
| `ciencias-naturales`  | `ciencias_naturales` |
| `ingles`              | `ingles`             |

---

## Learning Module and Quizzes

### Learning data flow

1. **LearningService.getLearningPath(areaId)** fetches lessons by `API_CONFIG.MODE`:
   - **Supabase**: `LearningSupabaseService.getLessonsByArea(area)` → `learning_content` table
   - **localStorage**: Static `roadmapData` (`BASICO_TOPICS`, `INTERMEDIO_TOPICS`)

2. Lessons are ordered by `order_index` and only shown with `published: true`.

3. **Completed lessons progress**: stored in **localStorage** (`progressStorage`) regardless of API mode. Key: `icfes_completed_lessons`.

### `content` object structure (JSONB in `learning_content`)

```json
{
  "title": "Lesson Title",
  "summary": "Brief description of the content.",
  "body": "# Content in Markdown\n\nLesson text...",
  "type": "lesson",
  "questions": [],
  "quiz": {}
}
```

| Field     | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| title     | string | Yes      | Visible lesson title                           |
| summary   | string | No       | Brief description                              |
| body      | string | No       | Markdown content (rendered with ReactMarkdown) |
| type      | string | No       | `lesson` by default                            |
| questions | array  | No       | Quiz questions (format 1, see below)           |
| quiz      | object | No       | Associated quiz (formats 2 or 3, see below)    |

### Supported quiz formats

The `LessonQuizModal` component accepts **three formats** (usage priority):

#### Format 1: Direct `questions` array

```json
{
  "title": "Introduction to Critical Reading",
  "questions": [
    {
      "id": "q1",
      "question": "What is the author's intention?",
      "options": [
        { "id": "a", "text": "Option A" },
        { "id": "b", "text": "Option B (correct)" }
      ],
      "correctAnswer": "b",
      "explanation": "Optional explanation"
    }
  ]
}
```

#### Format 2: `quiz.questions` (array inside quiz)

```json
{
  "quiz": {
    "title": "Concept test",
    "rewards": { "xp": 50, "coins": 25 },
    "questions": [
      {
        "question": "Main question",
        "options": ["Option A", "Option B", "Option C"],
        "correct_answer": 1
      }
    ]
  }
}
```

#### Format 3: Single quiz (legacy format)

```json
{
  "quiz": {
    "title": "Quick Assessment",
    "question": "What is the main question?",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B (correct)" }
    ],
    "correctAnswer": "b",
    "rewards": { "xp": 50, "coins": 20 }
  }
}
```

### Question and option fields

| Field          | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| question       | string | Question text (also accepts `text`)       |
| options        | array  | Options: `{id, text}` or array of strings |
| correctAnswer  | string | ID of correct option (a, b, c, d)         |
| correct_answer | number | Index of correct option (0, 1, 2...)      |
| explanation    | string | Optional explanation after answering      |

Options are normalized automatically: if they are strings, ids `a`, `b`, `c`, `d` are assigned.

### Rewards (XP and coins)

**Priority** for determining XP and coins when completing a lesson:

1. `lessonXp` / `lessonCoins` (component props)
2. `quiz.rewards.xp` / `quiz.rewards.coins`
3. **Default values**: 500 XP, 250 coins

Rewards are only granted **once** per lesson (verified with `getCompletedLessons()`).

### Reward flow

1. User answers all quiz questions in `LessonQuizModal`.
2. All answers are validated as correct.
3. If it's the first time completing the lesson and the user is authenticated:
   - `gamificationPersistence.addXP()` and `addCoins()` (`@/services/persistence`)
   - `markLessonAsCompleted()` in `progressStorage` (localStorage)
4. Feedback (Correct/Incorrect) and earned rewards are displayed.

---

## Data Flow

### Example: Update profile (Supabase)

```txt
1. Component: <button onClick={() => updateProfile({ username: 'new' })}>
2. Hook (useUserData): delegates to `@/services/persistence` (e.g. `patchUserProfile`)
3. Supabase mode: UserSupabaseService → `supabase.from('users').update(...).eq('id', userId)`
4. Result: PostgreSQL updated (or local profile when using `localStorage`)
```

### Example: add XP (`gamificationPersistence`)

```typescript
import { gamificationPersistence } from '@/services/persistence';

await gamificationPersistence.addXP(userId, 50, 'lesson_quiz_lessonId');
```

### Example: complete lesson and earn rewards

```txt
1. User completes quiz in LessonQuizModal
2. LessonQuizModal: gamificationPersistence.addXP / addCoins
3. LessonQuizModal: markLessonAsCompleted(userId, lessonId) → progressStorage (localStorage)
4. Lesson marked as completed (rewards are not granted again)
```

---

## Migration Between Modes

### Switch to Supabase (production)

```bash
# .env.local
NEXT_PUBLIC_API_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Switch to localStorage (development)

```bash
NEXT_PUBLIC_API_MODE=localStorage
```

---

## Exports from `@/services`

```typescript
import {
  SubscriptionPlanService,
  PlanScheduleService,
  BADGES,
  LEVELS,
} from '@/services';

import {
  gamificationPersistence,
  loadUserProfile,
  loadProgressViewState,
} from '@/services/persistence';
```

The `@/services` barrel re-exports `./persistence`; for gamification and lessons, `gamificationPersistence` and the helpers used by hooks are the usual entry points.

---
*AI-generated file. Last updated: Monday, May 18, 2026.*
