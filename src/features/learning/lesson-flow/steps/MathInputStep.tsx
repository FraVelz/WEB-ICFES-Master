'use client';

import { cn } from '@/utils/cn';
import { useCallback, useEffect, useState } from 'react';

import type { MathInputStepData } from '@/features/learning/types/lessonFlow';

type MathInputStepProps = {
  data: MathInputStepData;
  onStepReady: (canContinue: boolean) => void;
};

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

export function MathInputStep({ data, onStepReady }: MathInputStepProps) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  const target = normalizeAnswer(data.answer);

  useEffect(() => {
    onStepReady(checked && ok);
  }, [checked, ok, onStepReady]);

  const verify = useCallback(() => {
    const match = normalizeAnswer(value) === target;
    setChecked(true);
    setOk(match);
  }, [value, target]);

  return (
    <div className="space-y-6">
      <p className="text-center text-xl font-semibold text-white md:text-2xl">{data.question}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
            setOk(false);
          }}
          className={cn(
            'min-h-[52px] w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 text-center',
            'focus:border-app-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-app-ring/35',
            'sm:max-w-md'
          )}
          placeholder="Tu respuesta"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={verify}
          className={cn(
            'min-h-[52px] rounded-xl bg-app-accent-strong px-6 text-lg font-semibold text-white transition',
            'hover:bg-app-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          )}
        >
          Comprobar
        </button>
      </div>
      {checked ? (
        <p className={cn('text-center text-lg font-medium', ok ? 'text-emerald-400' : 'text-rose-400')}>
          {ok ? '¡Muy bien!' : 'Intenta de nuevo o revisa el enunciado.'}
        </p>
      ) : null}
    </div>
  );
}
