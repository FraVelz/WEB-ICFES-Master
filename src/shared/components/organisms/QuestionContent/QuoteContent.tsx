/**
 * QuoteContent - Componente para mostrar citas/fragmentos de texto
 *
 * Uso:
 * <QuoteContent
 *   text="La educación es el arma más poderosa que puedes usar para cambiar el mundo"
 *   author="Nelson Mandela"
 *   type="quote"
 * />
 *
 * <QuoteContent
 *   text="Fragmento del artículo 2 de la constitución..."
 *   source="Constitución Política de Colombia"
 *   type="excerpt"
 * />
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
      className={`my-6 rounded-lg border-l-4 py-4 pr-4 pl-6 ${
        isQuote ? 'border-blue-500 bg-blue-500/10 text-blue-100' : 'border-amber-500 bg-amber-500/10 text-amber-100'
      }`}
    >
      <p className="text-sm leading-relaxed italic">"{text ?? ''}"</p>
      {author && (
        <p className={`mt-3 text-xs font-semibold ${isQuote ? 'text-blue-300' : 'text-amber-300'}`}>— {author}</p>
      )}
      {source && (
        <p className={`mt-3 text-xs font-semibold ${isQuote ? 'text-blue-300' : 'text-amber-300'}`}>— {source}</p>
      )}
    </blockquote>
  );
};
