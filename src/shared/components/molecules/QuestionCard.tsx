import { cn } from '@/utils/cn';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Text, Title } from '../atoms/Text';

interface QuestionCardQuestion {
  area?: string;
  areaLabel?: string;
  text?: string;
  difficulty?: string;
}

interface QuestionCardProps {
  question: QuestionCardQuestion;
  number: number;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const QuestionCard = ({ question, number, onSelect, isSelected = false, className = '' }: QuestionCardProps) => {
  const areaColors: Record<string, 'math' | 'language' | 'science' | 'social'> = {
    mathematics: 'math',
    lenguaje: 'language',
    science: 'science',
    social: 'social',
  };

  return (
    <Card hover onClick={onSelect} className={cn(isSelected && 'ring-2 ring-blue-500', className)}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <Title level={5} className="mb-2">
            Pregunta {number}
          </Title>
          <Badge variant={question.area && areaColors[question.area] ? areaColors[question.area] : 'default'}>
            {question.areaLabel}
          </Badge>
        </div>
      </div>
      <Text as="p" className="mb-4">
        {question.text}
      </Text>
      {question.difficulty && (
        <div className="flex items-center gap-2">
          <Text as="span" variant="small">
            Dificultad:
          </Text>
          <Badge
            variant={
              question.difficulty === 'fácil' ? 'success' : question.difficulty === 'medio' ? 'warning' : 'danger'
            }
          >
            {question.difficulty}
          </Badge>
        </div>
      )}
    </Card>
  );
};
