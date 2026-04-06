'use client';

import { useCallback, useEffect, useState } from 'react';

import type { QuizStepData } from '@/features/learning/types/lessonFlow';

import { MathBlock } from '../MathBlock';

type QuizStepProps = {
  data: QuizStepData;
  onStepReady: (canContinue: boolean) => void;
};

export function QuizStep({ data, onStepReady }: QuizStepProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const answered = selected !== null;
  const isCorrect = answered && selected === data.correct;

  useEffect(() => {
    onStepReady(answered);
  }, [answered, onStepReady]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selected !== null) return;
      setSelected(index);
    },
    [selected]
  );

  return (
    <div className="space-y-6">
      <p className="text-center text-xl leading-snug font-semibold text-white md:text-2xl">{data.question}</p>
      <ul className="flex flex-col gap-3">
        {data.options.map((opt, index) => {
          const isSel = selected === index;
          const showCorrect = answered && index === data.correct;
          const showWrong = answered && isSel && !isCorrect;
          return (
            <li key={index}>
              <button
                type="button"
                disabled={answered}
                onClick={() => handleSelect(index)}
                className={`w-full rounded-xl border px-4 py-4 text-left text-lg transition-colors md:py-5 md:text-xl ${
                  showCorrect
                    ? 'border-emerald-500/80 bg-emerald-950/50 text-white'
                    : showWrong
                      ? 'border-rose-500/80 bg-rose-950/40 text-white'
                      : isSel
                        ? 'border-cyan-500/60 bg-slate-800/80 text-white'
                        : 'border-slate-600/80 bg-slate-900/60 text-slate-100 hover:border-slate-500'
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <div
          className={`rounded-xl border px-4 py-4 text-base leading-relaxed md:text-lg ${
            isCorrect
              ? 'border-emerald-600/50 bg-emerald-950/30 text-emerald-100'
              : 'border-amber-600/50 bg-amber-950/20 text-amber-100'
          }`}
        >
          <p className="font-medium">{isCorrect ? '¡Correcto!' : 'Revisa la explicación:'}</p>
          <p className="mt-2 text-slate-200">{data.explanation}</p>
          {data.mathExplanation ? <MathBlock latex={data.mathExplanation} display /> : null}
        </div>
      ) : null}
    </div>
  );
}
