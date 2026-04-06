import { cn } from '@/utils/cn';

/**
 * QuoteContent — block quotes and excerpts
 * type: "quote" | "excerpt"
 */
interface QuoteContentProps {
  text?: string;
  author?: string | null;
  source?: string | null;
  type?: 'quote' | 'excerpt';
}

export const QuoteContent = ({ text, author = null, source = null, type = 'quote' }: QuoteContentProps) => {
  const isQuote = type === 'quote';

  return (
    <blockquote
      className={cn(
        'my-6 rounded-lg border-l-4 py-4 pr-4 pl-6',
        isQuote ? 'border-blue-500 bg-blue-500/10 text-blue-100' : 'border-amber-500 bg-amber-500/10 text-amber-100'
      )}
    >
      <p className="text-sm leading-relaxed italic">"{text ?? ''}"</p>
      {author && (
        <p className={cn('mt-3 text-xs font-semibold', isQuote ? 'text-blue-300' : 'text-amber-300')}>— {author}</p>
      )}
      {source && (
        <p className={cn('mt-3 text-xs font-semibold', isQuote ? 'text-blue-300' : 'text-amber-300')}>— {source}</p>
      )}
    </blockquote>
  );
};
