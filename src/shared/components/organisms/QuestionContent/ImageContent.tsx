/**
 * ImageContent — figures in exam questions
 *
 * Example:
 * <ImageContent src="..." alt="..." caption="..." maxWidth="600px" />
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
      {caption && <figcaption className="mt-3 text-center text-xs text-gray-400 italic">{caption}</figcaption>}
    </figure>
  );
};
