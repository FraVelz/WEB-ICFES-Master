/**
 * ImageContent - Componente para mostrar imágenes en las preguntas
 *
 * Uso:
 * <ImageContent
 *   src="/path/to/image.png"
 *   alt="Descripción de la imagen"
 *   caption="Pie de imagen opcional"
 *   maxWidth="600px"
 * />
 */
interface ImageContentProps {
  src?: string;
  alt?: string;
  caption?: string;
  maxWidth?: string;
}

export const ImageContent = ({ src, alt, caption, maxWidth = '100%' }: ImageContentProps) => {
  return (
    <figure className="my-6 flex flex-col items-center">
      <img
        src={src ?? ''}
        alt={alt ?? ''}
        style={{ maxWidth }}
        className="rounded-lg border border-white/20 shadow-lg"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-gray-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
