/**
 * TextContent - Componente para mostrar texto en las preguntas
 *
 * Uso:
 * <TextContent text="Este es el texto de la pregunta" />
 */
interface TextContentProps {
  text?: string;
  className?: string;
}

export const TextContent = ({ text, className = '' }: TextContentProps) => {
  return (
    <p className={`text-base leading-relaxed text-gray-100 ${className}`}>
      {text}
    </p>
  );
};
