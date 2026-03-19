import { Icon } from '@/shared/components/Icon';
import { AnswerOption } from '@/shared/components';

export const QuestionPanel = ({
  question,
  onAnswer,
  answered = false,
  selectedAnswer = null,
  showExplanation = false,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fade-in space-y-8 sm:mx-6">
      <div className="border-cyan-400 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl sm:rounded-3xl sm:border-2 md:p-10">
        <div className="mb-10">
          <div className="bg-opacity-20 mb-6 inline-block rounded-full border-2 border-white bg-white px-3 py-1 text-lg font-black text-gray-800">
            Pregunta ICFES
          </div>
          <h2 className="text-2xl leading-tight font-black drop-shadow-lg md:text-3xl lg:text-4xl">
            {question.text}
          </h2>
        </div>

        <div className="mb-8 space-y-4">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              letter={letters[index]}
              text={option.text}
              selected={selectedAnswer === letters[index] && !answered}
              correct={answered && letters[index] === question.correctAnswer}
              incorrect={
                answered &&
                selectedAnswer === letters[index] &&
                letters[index] !== question.correctAnswer
              }
              onClick={() => !answered && onAnswer(letters[index])}
              disabled={answered}
            />
          ))}
        </div>
      </div>

      {answered && showExplanation && (
        <div className="rounded-3xl border-2 border-yellow-400 bg-linear-to-br from-yellow-100 to-amber-100 p-8 shadow-2xl md:p-10">
          <div className="flex items-start gap-6">
            <div className="shrink-0 text-4xl">
              <Icon name="lightbulb" size="2xl" className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-2 text-xl font-black text-yellow-900 drop-shadow-lg md:text-2xl">
                Explicación
              </h4>
              <p className="text-base leading-relaxed font-medium text-yellow-800 drop-shadow-lg md:text-lg">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
