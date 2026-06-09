# Guía de componentes

## Hook `useExam`

La lógica de quiz en pantalla vive en **`PracticePage`** y **`FullExamPage`**. Para persistencia y estado de
intentos usa **`useExam`** (`src/features/exam/hooks/useExam.ts`):

```typescript
import { useExam } from '@/features/exam/hooks/useExam';

export function ExamStatsExample() {
  const { attempts, loading, saveAttempt } = useExam();

  // attempts: historial local o Supabase según cuenta vs demo
  // saveAttempt(payload): guarda un intento de práctica o simulacro
}
```

Tipos de pregunta: `src/features/exam/types/question.ts`.

## Crear un componente de feature (tarjeta de área)

Los átomos genéricos en `shared/atoms/` se eliminaron. Crea el componente en la feature, p. ej.
`src/features/exam/components/AreaHighlightCard.tsx`, con Tailwind y `Icon`:

```tsx
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

export function AreaHighlightCard({
  title,
  iconName,
  description,
  questionsCount,
  onClick,
  className,
}: {
  title: string;
  iconName: string;
  description: string;
  questionsCount: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'hover:border-app-ring/40 w-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-left',
        className
      )}
    >
      <div className="flex gap-4">
        <Icon name={iconName} className="text-app-accent text-3xl" />
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
          <p className="text-app-accent mt-2 text-xs">{questionsCount} preguntas</p>
        </div>
      </div>
    </button>
  );
}
```

## Añadir preguntas de un área

Ubicación: `src/features/exam/data/questions.ts`.

```typescript
export const NEW_AREA_QUESTIONS = [
  {
    id: 101,
    text: 'Pregunta de ejemplo',
    area: 'new_area',
    areaLabel: 'Nueva área',
    difficulty: 'fácil',
    options: [
      { letter: 'A', text: 'Opción 1' },
      { letter: 'B', text: 'Opción 2' },
      { letter: 'C', text: 'Opción 3' },
      { letter: 'D', text: 'Opción 4' },
    ],
    correctAnswer: 'A',
    explanation: 'Explicación de por qué A es correcta',
  },
];

// Luego incorporar el bloque en el agregado exportado (p. ej. ALL_QUESTIONS)
```

## Estructura de una pregunta (referencia)

```typescript
{
  id: 1,
  text: 'Pregunta aquí',
  area: 'mathematics',
  areaLabel: 'Matemáticas',
  difficulty: 'fácil',
  options: [
    { letter: 'A', text: 'Opción A' },
    { letter: 'B', text: 'Opción B' },
    { letter: 'C', text: 'Opción C' },
    { letter: 'D', text: 'Opción D' },
  ],
  correctAnswer: 'B',
  explanation: 'Porque...',
}
```

## Avatares e imágenes

- Perfil / ranking: `AvatarImage` en `src/features/user/components/AvatarImage.tsx` (wrapper de `next/image`).
- Mascota / tienda: `next/image` con `fill` o dimensiones fijas.
- Markdown de lecciones: `<img>` permitido solo en el renderer de `LessonContentModal` (URLs dinámicas).

## Componentes (convención del repo)

| Alcance           | Componentes                                              |
| ----------------- | -------------------------------------------------------- |
| **shared/**       | `Icon`, `MascotaCircle`, `ModalOverlay`                  |
| **home/**         | `Footer` (landing)                                       |
| **achievements/** | `AchievementsList` |
| **user/**         | `AvatarImage`, `ProfileComponents`                       |
| **Shell global**  | `src/components/DashboardHeader/`                        |

Hooks transversales: `src/hooks/gamification/` (`useGamification`, `useLeaderboard`). Catálogo de logros:
`src/shared/constants/achievementsData.ts`.

Preferir imports directos desde la feature (`@/features/user/hooks/useProgress`) en lugar del barrel global
`@/hooks` (eliminado).

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
