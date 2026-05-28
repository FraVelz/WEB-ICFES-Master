import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import type { LegacyLessonEntry, LegacyLessonTheme } from './types';

const GLOW_BG: Record<string, string> = {
  'lesson-math-glow-a': 'bg-lesson-math-glow-a/20',
  'lesson-math-glow-b': 'bg-lesson-math-glow-b/20',
  'lesson-lc-glow-a': 'bg-lesson-lc-glow-a/20',
  'lesson-lc-glow-b': 'bg-lesson-lc-glow-b/20',
  'lesson-sci-glow-a': 'bg-lesson-sci-glow-a/20',
  'lesson-sci-glow-b': 'bg-lesson-sci-glow-b/20',
  'lesson-soc-glow-a': 'bg-lesson-soc-glow-a/20',
  'lesson-soc-glow-b': 'bg-lesson-soc-glow-b/20',
  'lesson-eng-glow-a': 'bg-lesson-eng-glow-a/20',
  'lesson-eng-glow-b': 'bg-lesson-eng-glow-b/20',
};

type LegacyLessonLayoutProps = {
  entry: LegacyLessonEntry;
  theme: LegacyLessonTheme;
};

export function LegacyLessonLayout({ entry, theme }: LegacyLessonLayoutProps) {
  const { content, glowA, glowB, keySectionTitle, practiceSectionTitle } = entry;

  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={cn('absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl', GLOW_BG[glowA])} />
        <div
          className={cn('absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full blur-3xl', GLOW_BG[glowB])}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/ruta-aprendizaje"
            className="flex items-center gap-3 text-gray-400 transition-colors hover:text-blue-400"
          >
            <Icon name="arrow-left" className="text-xl" />
            Volver
          </Link>
          <div className="text-right">
            <p className="text-sm text-gray-400">{theme.areaLabel}</p>
          </div>
        </div>

        <header className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Icon name={theme.heroIcon} className={cn('text-5xl', theme.topicHeading)} />
            <h1
              className={cn(
                'bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent md:text-6xl',
                theme.heroGradient
              )}
            >
              {content.title}
            </h1>
          </div>
          <div className="mb-8 flex justify-center gap-8 text-gray-300">
            <span className="flex items-center gap-2">
              <Icon name={theme.heroIcon} /> {content.duration}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="book" /> {content.lessons} lecciones
            </span>
            <span
              className={cn(
                'rounded-full px-4 py-1 text-sm',
                content.difficulty === 'fácil' ? 'bg-green-500/30' : 'bg-yellow-500/30'
              )}
            >
              {content.difficulty}
            </span>
          </div>
        </header>

        <div className="mb-16 space-y-8">
          {content.topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <h2 className={cn('mb-4 text-3xl font-bold', theme.topicHeading)}>{topic.name}</h2>
              <p className="mb-6 text-lg text-gray-300">{topic.description}</p>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-blue-400">Subtemas</h3>
                  <ul className="space-y-3">
                    {topic.subtopics.map((sub, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={cn('mt-1 font-bold', theme.bulletColor)}>→</span>
                        <span className="text-gray-300">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold text-green-400">Ejemplos</h3>
                  <div className="space-y-3">
                    {topic.examples.map((example, i) => (
                      <div key={i} className="rounded border-l-4 border-green-400 bg-gray-900/50 p-4">
                        <code className="text-sm text-green-300">{example}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-app-accent mb-8 text-3xl font-bold">{keySectionTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.keyFormulas.map((formula, idx) => (
              <div key={idx} className="border-app-ring/30 bg-app-ring/10 rounded-xl border p-6">
                <code className="text-app-accent-muted block text-center text-lg">{formula}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-purple-400">{practiceSectionTitle}</h2>
          <div className="space-y-4">
            {content.practiceExercises.map((exercise, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <span className="min-w-fit text-xl font-bold text-purple-400">{idx + 1}.</span>
                  <p className="text-gray-300">{exercise}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/ruta-aprendizaje"
            className={cn(
              'inline-block rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-8 py-3',
              'font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700',
              'hover:to-purple-800 hover:shadow-lg'
            )}
          >
            Volver al Aprendizaje
          </Link>
        </div>
      </div>
    </div>
  );
}
