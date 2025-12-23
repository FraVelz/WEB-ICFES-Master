import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { AnswerOption } from '@/shared/components';

export const QuestionPanel = ({ 
  question, 
  onAnswer, 
  answered = false,
  selectedAnswer = null,
  showExplanation = false
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-8 fade-in sm:mx-6">
      <div className="bg-linear-to-br from-blue-600 via-purple-600 to-indigo-600 sm:rounded-3xl p-8 md:p-10 text-white shadow-2xl sm:border-2 border-cyan-400">
        <div className="mb-10">
          <div className="inline-block px-3 py-1 bg-white bg-opacity-20 text-gray-800 rounded-full text-lg font-black mb-6 border-2 border-white">
            Pregunta ICFES
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black drop-shadow-lg leading-tight">{question.text}</h2>
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              letter={letters[index]}
              text={option.text}
              selected={selectedAnswer === letters[index] && !answered}
              correct={answered && letters[index] === question.correctAnswer}
              incorrect={answered && selectedAnswer === letters[index] && letters[index] !== question.correctAnswer}
              onClick={() => !answered && onAnswer(letters[index])}
              disabled={answered}
            />
          ))}
        </div>
      </div>

      {answered && showExplanation && (
        <div className="bg-linear-to-br from-yellow-100 to-amber-100 rounded-3xl p-8 md:p-10 border-2 border-yellow-400 shadow-2xl">
          <div className="flex items-start gap-6">
              <div className="text-4xl shrink-0"><FontAwesomeIcon icon={faLightbulb} className="text-yellow-600" /></div>
            <div className="flex-1">
              <h4 className="text-xl md:text-2xl font-black text-yellow-900 mb-2 drop-shadow-lg">Explicación</h4>
              <p className="text-base md:text-lg text-yellow-800 font-medium leading-relaxed drop-shadow-lg">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
