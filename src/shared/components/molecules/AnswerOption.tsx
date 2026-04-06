import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

interface AnswerOptionProps {
  letter: string;
  text: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const AnswerOption = ({
  letter,
  text,
  selected = false,
  correct = false,
  incorrect = false,
  onClick,
  disabled = false,
}: AnswerOptionProps) => {
  const getBackgroundColor = () => {
    if (correct) return 'bg-linear-to-r from-green-400 to-emerald-500 border-2 border-green-600';
    if (incorrect) return 'bg-linear-to-r from-red-400 to-orange-500 border-2 border-red-600';
    if (selected) return 'bg-linear-to-r from-blue-500 to-indigo-600 border-2 border-blue-600';
    return 'bg-slate-700 border-2 border-slate-500 hover:bg-slate-600';
  };

  const getTextColor = () => {
    if (correct) return 'text-white font-black';
    if (incorrect) return 'text-white font-black';
    if (selected) return 'text-white font-black';
    return 'text-white font-bold';
  };

  const getLetterColor = () => {
    if (correct) return 'bg-white text-green-600';
    if (incorrect) return 'bg-white text-red-600';
    if (selected) return 'bg-white text-blue-600';
    return 'bg-slate-600 text-white';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group mb-4 flex w-full items-start gap-6 rounded-3xl p-4 text-left shadow-lg transition-all duration-300',
        getBackgroundColor(),
        getTextColor(),
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-105 hover:shadow-2xl'
      )}
    >
      <div className="mt-1 min-w-fit">
        <span
          className={cn(
            'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black transition-all duration-300 group-hover:scale-110',
            getLetterColor()
          )}
        >
          {letter}
        </span>
      </div>
      <div className="flex-1 pt-2">
        <p className="text-left text-lg leading-relaxed md:text-xl">{text}</p>
      </div>
      {(correct || incorrect) && (
        <div className={cn('shrink-0', correct ? 'animate-bounce text-green-400' : 'text-red-400')}>
          <Icon name={correct ? 'check' : 'times'} className="text-2xl" />
        </div>
      )}
    </button>
  );
};
