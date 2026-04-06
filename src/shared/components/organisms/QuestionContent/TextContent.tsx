import { cn } from '@/utils/cn';

/** Plain paragraph block for question stems */
interface TextContentProps {
  text?: string;
  className?: string;
}

export const TextContent = ({ text, className = '' }: TextContentProps) => {
  return <p className={cn('text-base leading-relaxed text-gray-100', className)}>{text}</p>;
};
