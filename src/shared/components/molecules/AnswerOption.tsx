import { Icon } from '@/shared/components/Icon';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

export const AnswerOption = ({ 
  letter, 
  text, 
  selected = false, 
  correct = false,
  incorrect = false,
  onClick,
  disabled = false
}) => {
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
      className={`
        w-full p-4 mb-4 rounded-3xl text-left transition-all duration-300
        ${getBackgroundColor()}
        ${getTextColor()}
        ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:shadow-2xl hover:scale-105 cursor-pointer'}
        flex items-start gap-6 group shadow-lg
      `}
    >
      <div className="min-w-fit mt-1">
        <span className={`inline-flex items-center justify-center w-12 h-12 ${getLetterColor()} rounded-2xl font-black text-lg transition-all duration-300 group-hover:scale-110 shrink-0`}>
          {letter}
        </span>
      </div>
      <div className="flex-1 pt-2">
        <p className="text-left text-lg md:text-xl leading-relaxed">
          {text}
        </p>
      </div>
      {(correct || incorrect) && (
        <div className={`shrink-0 ${correct ? 'animate-bounce text-green-400' : 'text-red-400'}`}>
          <Icon name={correct ? 'check' : 'times'} className="text-2xl" />
        </div>
      )}
    </button>
  );
};
